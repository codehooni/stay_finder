from datetime import timedelta
from decimal import Decimal

from django.contrib.auth import get_user_model
from django.urls import reverse
from django.utils import timezone
from rest_framework import status
from rest_framework.test import APITestCase

from bookings.models import Booking
from hotels.models import City, Hotel, RoomType


class BookingApiTests(APITestCase):
    def setUp(self):
        self.user = get_user_model().objects.create_user(
            username="guest@example.com",
            email="guest@example.com",
            password="test-pass",
        )
        self.other_user = get_user_model().objects.create_user(
            username="other@example.com",
            email="other@example.com",
            password="test-pass",
        )
        self.client.force_authenticate(self.user)

        self.city = City.objects.create(
            name="Seoul",
            country="South Korea",
            slug="seoul",
        )
        self.hotel = Hotel.objects.create(
            city=self.city,
            name="StayFinder Seoul Central",
            description="Business-friendly hotel near major transit.",
            address="1 Central Road",
            star_rating=4,
            review_score=Decimal("4.6"),
            thumbnail_url="https://example.com/hotel.jpg",
        )
        self.room_type = RoomType.objects.create(
            hotel=self.hotel,
            name="Deluxe Double",
            description="Double bed room for two guests.",
            max_guests=2,
            total_rooms=1,
            nightly_price=Decimal("180000.00"),
            currency="KRW",
        )
        self.check_in = timezone.localdate() + timedelta(days=10)
        self.check_out = self.check_in + timedelta(days=3)

    def booking_payload(self, **overrides):
        payload = {
            "room_type": self.room_type.id,
            "check_in": self.check_in.isoformat(),
            "check_out": self.check_out.isoformat(),
            "guests": 2,
        }
        payload.update(overrides)
        return payload

    def test_create_booking_succeeds(self):
        response = self.client.post(reverse("booking-list"), self.booking_payload())

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["hotel"]["name"], "StayFinder Seoul Central")
        self.assertEqual(response.data["room_type"]["name"], "Deluxe Double")
        self.assertEqual(response.data["nights"], 3)
        self.assertEqual(response.data["status"], Booking.Status.PENDING)
        self.assertEqual(Booking.objects.get().user, self.user)

    def test_create_booking_requires_authentication(self):
        self.client.force_authenticate(user=None)

        response = self.client.post(reverse("booking-list"), self.booking_payload())

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.assertEqual(Booking.objects.count(), 0)

    def test_total_price_is_calculated_on_server(self):
        response = self.client.post(
            reverse("booking-list"),
            self.booking_payload(total_price="1.00", status=Booking.Status.APPROVED),
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["total_price"], "540000.00")
        self.assertEqual(response.data["status"], Booking.Status.PENDING)
        self.assertEqual(Booking.objects.get().total_price, Decimal("540000.00"))

    def test_rejects_check_in_on_or_after_check_out(self):
        response = self.client.post(
            reverse("booking-list"),
            self.booking_payload(check_out=self.check_in.isoformat()),
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("check_out", response.data)

    def test_rejects_past_check_in(self):
        past = timezone.localdate() - timedelta(days=1)

        response = self.client.post(
            reverse("booking-list"),
            self.booking_payload(check_in=past.isoformat(), check_out=self.check_out.isoformat()),
        )

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("check_in", response.data)

    def test_rejects_guest_count_above_room_limit(self):
        response = self.client.post(reverse("booking-list"), self.booking_payload(guests=3))

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("guests", response.data)

    def test_rejects_when_overlapping_active_bookings_fill_inventory(self):
        Booking.objects.create(
            user=self.other_user,
            room_type=self.room_type,
            check_in=self.check_in,
            check_out=self.check_out,
            guests=1,
            total_price=Decimal("540000.00"),
            currency="KRW",
            status=Booking.Status.APPROVED,
        )

        response = self.client.post(reverse("booking-list"), self.booking_payload())

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("room_type", response.data)

    def test_list_returns_only_authenticated_users_bookings(self):
        own_booking = Booking.objects.create(
            user=self.user,
            room_type=self.room_type,
            check_in=self.check_in,
            check_out=self.check_out,
            guests=2,
            total_price=Decimal("540000.00"),
            currency="KRW",
            status=Booking.Status.PENDING,
        )
        Booking.objects.create(
            user=self.other_user,
            room_type=self.room_type,
            check_in=self.check_out + timedelta(days=1),
            check_out=self.check_out + timedelta(days=2),
            guests=1,
            total_price=Decimal("180000.00"),
            currency="KRW",
            status=Booking.Status.PENDING,
        )

        response = self.client.get(reverse("booking-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual([booking["id"] for booking in response.data], [own_booking.id])

    def test_other_user_booking_detail_returns_404(self):
        booking = Booking.objects.create(
            user=self.other_user,
            room_type=self.room_type,
            check_in=self.check_in,
            check_out=self.check_out,
            guests=1,
            total_price=Decimal("540000.00"),
            currency="KRW",
            status=Booking.Status.PENDING,
        )

        response = self.client.get(reverse("booking-detail", args=[booking.id]))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_cancel_booking_sets_status_to_cancelled(self):
        booking = Booking.objects.create(
            user=self.user,
            room_type=self.room_type,
            check_in=self.check_in,
            check_out=self.check_out,
            guests=2,
            total_price=Decimal("540000.00"),
            currency="KRW",
            status=Booking.Status.PENDING,
        )

        response = self.client.post(reverse("booking-cancel", args=[booking.id]))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], Booking.Status.CANCELLED)
        booking.refresh_from_db()
        self.assertEqual(booking.status, Booking.Status.CANCELLED)

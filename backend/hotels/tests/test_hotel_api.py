from decimal import Decimal

from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from hotels.models import City, Hotel, RoomType


class HotelApiTests(APITestCase):
    def setUp(self):
        self.seoul = City.objects.create(
            name="Seoul",
            country="South Korea",
            slug="seoul",
        )
        self.busan = City.objects.create(
            name="Busan",
            country="South Korea",
            slug="busan",
        )
        self.hotel = Hotel.objects.create(
            city=self.seoul,
            name="StayFinder Seoul Central",
            description="Business-friendly hotel near major transit.",
            address="1 Central Road",
            star_rating=4,
            review_score=Decimal("4.6"),
            thumbnail_url="https://example.com/hotel.jpg",
        )
        self.other_hotel = Hotel.objects.create(
            city=self.busan,
            name="StayFinder Busan Harbor",
            description="Harbor-side hotel for weekend stays.",
            address="2 Harbor Road",
            star_rating=3,
            review_score=Decimal("4.2"),
            thumbnail_url="https://example.com/busan.jpg",
        )
        self.room_type = RoomType.objects.create(
            hotel=self.hotel,
            name="Deluxe Double",
            description="Double bed room for two guests.",
            max_guests=2,
            total_rooms=12,
            nightly_price=Decimal("180000.00"),
            currency="KRW",
        )

    def test_hotel_list_returns_public_hotel_summaries(self):
        response = self.client.get(reverse("hotel-list"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]["name"], "StayFinder Seoul Central")
        self.assertEqual(response.data[0]["city"], "Seoul")
        self.assertEqual(response.data[0]["country"], "South Korea")
        self.assertEqual(response.data[0]["min_price"], "180000.00")
        self.assertEqual(response.data[0]["currency"], "KRW")

    def test_hotel_detail_returns_room_types(self):
        response = self.client.get(reverse("hotel-detail", args=[self.hotel.id]))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["name"], "StayFinder Seoul Central")
        self.assertEqual(response.data["room_types"][0]["name"], "Deluxe Double")
        self.assertEqual(response.data["room_types"][0]["max_guests"], 2)
        self.assertEqual(response.data["room_types"][0]["nightly_price"], "180000.00")

    def test_hotel_room_types_endpoint_returns_only_that_hotels_rooms(self):
        RoomType.objects.create(
            hotel=self.other_hotel,
            name="Harbor Twin",
            description="Twin room near the harbor.",
            max_guests=2,
            total_rooms=8,
            nightly_price=Decimal("140000.00"),
            currency="KRW",
        )

        response = self.client.get(reverse("hotel-room-types", args=[self.hotel.id]))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "Deluxe Double")

    def test_missing_hotel_returns_404(self):
        response = self.client.get(reverse("hotel-detail", args=[999]))

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_hotel_list_can_filter_by_city_slug(self):
        response = self.client.get(reverse("hotel-list"), {"city": "seoul"})

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)
        self.assertEqual(response.data[0]["name"], "StayFinder Seoul Central")

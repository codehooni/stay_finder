from dataclasses import dataclass, replace
from decimal import Decimal

from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from bookings.models import Booking
from hotels.models import RoomType


@dataclass(frozen=True)
class BookingRequest:
    user: object
    room_type: object
    check_in: object
    check_out: object
    guests: int


def create_booking(request: BookingRequest) -> Booking:
    validate_booking_request(request)

    with transaction.atomic():
        room_type = RoomType.objects.select_for_update().get(pk=request.room_type.pk)
        locked_request = replace(request, room_type=room_type)
        validate_booking_request(locked_request)
        validate_room_inventory(locked_request)
        nights = (locked_request.check_out - locked_request.check_in).days
        total_price = locked_request.room_type.nightly_price * Decimal(nights)
        return Booking.objects.create(
            user=locked_request.user,
            room_type=locked_request.room_type,
            check_in=locked_request.check_in,
            check_out=locked_request.check_out,
            guests=locked_request.guests,
            total_price=total_price,
            currency=locked_request.room_type.currency,
            status=Booking.Status.PENDING,
        )


def validate_booking_request(request: BookingRequest) -> None:
    errors = {}
    today = timezone.localdate()

    if request.check_in < today:
        errors["check_in"] = ["Check-in date cannot be in the past."]
    if request.check_in >= request.check_out:
        errors["check_out"] = ["Check-out date must be after check-in date."]
    if request.guests > request.room_type.max_guests:
        errors["guests"] = ["Guest count exceeds this room type limit."]

    if errors:
        raise serializers.ValidationError(errors)


def validate_room_inventory(request: BookingRequest) -> None:
    overlapping_count = (
        Booking.objects.select_for_update()
        .filter(
            room_type=request.room_type,
            status__in=[Booking.Status.PENDING, Booking.Status.APPROVED],
            check_in__lt=request.check_out,
            check_out__gt=request.check_in,
        )
        .count()
    )

    if overlapping_count >= request.room_type.total_rooms:
        raise serializers.ValidationError(
            {"room_type": ["This room type is not available for the selected dates."]}
        )


def cancel_booking(booking: Booking) -> Booking:
    if booking.status not in [Booking.Status.PENDING, Booking.Status.APPROVED]:
        raise serializers.ValidationError(
            {"status": ["Only pending or approved bookings can be cancelled."]}
        )
    booking.status = Booking.Status.CANCELLED
    booking.save(update_fields=["status", "updated_at"])
    return booking

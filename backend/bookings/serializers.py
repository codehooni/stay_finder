from rest_framework import serializers

from bookings.models import Booking
from bookings.services import BookingRequest, create_booking
from hotels.models import RoomType


class BookingHotelSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    city = serializers.CharField(source="city.name")
    country = serializers.CharField(source="city.country")


class BookingRoomTypeSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()


class BookingSerializer(serializers.ModelSerializer):
    hotel = BookingHotelSerializer(source="room_type.hotel", read_only=True)
    room_type = BookingRoomTypeSerializer(read_only=True)
    nights = serializers.IntegerField(read_only=True)

    class Meta:
        model = Booking
        fields = [
            "id",
            "hotel",
            "room_type",
            "check_in",
            "check_out",
            "guests",
            "nights",
            "total_price",
            "currency",
            "status",
            "created_at",
        ]


class BookingCreateSerializer(serializers.Serializer):
    room_type = serializers.PrimaryKeyRelatedField(queryset=RoomType.objects.all())
    check_in = serializers.DateField()
    check_out = serializers.DateField()
    guests = serializers.IntegerField(min_value=1)
    user_id = serializers.IntegerField(required=False, write_only=True)
    total_price = serializers.DecimalField(
        max_digits=12,
        decimal_places=2,
        required=False,
        write_only=True,
    )
    status = serializers.ChoiceField(
        choices=Booking.Status.choices,
        required=False,
        write_only=True,
    )

    def create(self, validated_data):
        return create_booking(
            BookingRequest(
                user=self.context["request"].user,
                room_type=validated_data["room_type"],
                check_in=validated_data["check_in"],
                check_out=validated_data["check_out"],
                guests=validated_data["guests"],
            )
        )

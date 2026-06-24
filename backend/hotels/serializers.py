from rest_framework import serializers

from hotels.models import Hotel, RoomType


class RoomTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = RoomType
        fields = [
            "id",
            "name",
            "description",
            "max_guests",
            "total_rooms",
            "nightly_price",
            "currency",
        ]


class HotelListSerializer(serializers.ModelSerializer):
    city = serializers.CharField(source="city.name")
    country = serializers.CharField(source="city.country")
    min_price = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        read_only=True,
        allow_null=True,
    )
    currency = serializers.SerializerMethodField()

    class Meta:
        model = Hotel
        fields = [
            "id",
            "name",
            "city",
            "country",
            "star_rating",
            "review_score",
            "min_price",
            "currency",
            "thumbnail_url",
        ]

    def get_currency(self, hotel):
        room_type = hotel.room_types.order_by("nightly_price", "id").first()
        return room_type.currency if room_type else None


class HotelDetailSerializer(serializers.ModelSerializer):
    city = serializers.CharField(source="city.name")
    country = serializers.CharField(source="city.country")
    room_types = RoomTypeSerializer(many=True, read_only=True)

    class Meta:
        model = Hotel
        fields = [
            "id",
            "name",
            "description",
            "address",
            "city",
            "country",
            "star_rating",
            "review_score",
            "thumbnail_url",
            "room_types",
        ]

from django.db.models import Min
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response

from hotels.models import Hotel
from hotels.serializers import (
    HotelDetailSerializer,
    HotelListSerializer,
    RoomTypeSerializer,
)


class HotelViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Hotel.objects.select_related("city").prefetch_related("room_types")

    def get_queryset(self):
        queryset = super().get_queryset().annotate(min_price=Min("room_types__nightly_price"))
        city = self.request.query_params.get("city")
        if city:
            queryset = queryset.filter(city__slug__iexact=city)
        return queryset

    def get_serializer_class(self):
        if self.action == "list":
            return HotelListSerializer
        return HotelDetailSerializer

    @action(detail=True, methods=["get"], url_path="room-types")
    def room_types(self, request, pk=None):
        hotel = self.get_object()
        serializer = RoomTypeSerializer(hotel.room_types.all(), many=True)
        return Response(serializer.data)

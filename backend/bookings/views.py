from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from bookings.models import Booking
from bookings.serializers import BookingCreateSerializer, BookingSerializer
from bookings.services import cancel_booking


class BookingViewSet(viewsets.ModelViewSet):
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "head", "options"]

    def get_queryset(self):
        queryset = Booking.objects.select_related(
            "room_type",
            "room_type__hotel",
            "room_type__hotel__city",
            "user",
        )
        if self.request.user.is_staff:
            return queryset
        return queryset.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.action == "create":
            return BookingCreateSerializer
        return BookingSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        booking = serializer.save()
        output = BookingSerializer(booking, context=self.get_serializer_context())
        return Response(output.data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=["post"])
    def cancel(self, request, pk=None):
        booking = cancel_booking(self.get_object())
        serializer = BookingSerializer(booking, context=self.get_serializer_context())
        return Response(serializer.data)

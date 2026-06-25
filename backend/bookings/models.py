from django.conf import settings
from django.core.validators import MinValueValidator
from django.db import models


class Booking(models.Model):
    class Status(models.TextChoices):
        PENDING = "pending", "Pending"
        APPROVED = "approved", "Approved"
        REJECTED = "rejected", "Rejected"
        CANCELLED = "cancelled", "Cancelled"

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        related_name="bookings",
        on_delete=models.CASCADE,
    )
    room_type = models.ForeignKey(
        "hotels.RoomType",
        related_name="bookings",
        on_delete=models.PROTECT,
    )
    check_in = models.DateField()
    check_out = models.DateField()
    guests = models.PositiveSmallIntegerField(validators=[MinValueValidator(1)])
    total_price = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default="KRW")
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.PENDING,
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at", "-id"]
        indexes = [
            models.Index(fields=["user", "-created_at"]),
            models.Index(fields=["room_type", "check_in", "check_out", "status"]),
        ]

    def __str__(self):
        return f"{self.user_id} {self.room_type_id} {self.check_in} to {self.check_out}"

    @property
    def nights(self):
        return (self.check_out - self.check_in).days

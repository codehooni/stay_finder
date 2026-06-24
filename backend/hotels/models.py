from django.core.validators import MaxValueValidator, MinValueValidator
from django.db import models


class City(models.Model):
    name = models.CharField(max_length=120)
    country = models.CharField(max_length=120)
    slug = models.SlugField(max_length=140, unique=True)

    class Meta:
        ordering = ["name"]
        verbose_name_plural = "cities"

    def __str__(self):
        return f"{self.name}, {self.country}"


class Hotel(models.Model):
    city = models.ForeignKey(City, related_name="hotels", on_delete=models.PROTECT)
    name = models.CharField(max_length=200)
    description = models.TextField()
    address = models.CharField(max_length=255)
    star_rating = models.PositiveSmallIntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(5)]
    )
    review_score = models.DecimalField(max_digits=3, decimal_places=1)
    thumbnail_url = models.URLField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["id"]

    def __str__(self):
        return self.name


class RoomType(models.Model):
    hotel = models.ForeignKey(Hotel, related_name="room_types", on_delete=models.CASCADE)
    name = models.CharField(max_length=160)
    description = models.TextField()
    max_guests = models.PositiveSmallIntegerField(validators=[MinValueValidator(1)])
    total_rooms = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    nightly_price = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3, default="KRW")

    class Meta:
        ordering = ["nightly_price", "id"]

    def __str__(self):
        return f"{self.hotel.name} - {self.name}"

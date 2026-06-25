from decimal import Decimal

from django.core.management.base import BaseCommand
from django.db import transaction

from hotels.models import City, Hotel, RoomType


DEMO_HOTELS = [
    {
        "city": {"name": "Seoul", "country": "South Korea", "slug": "seoul"},
        "hotel": {
            "name": "StayFinder Seoul Central",
            "description": "Business-friendly hotel near major transit with calm rooms and fast access to the city core.",
            "address": "1 Central Road",
            "star_rating": 4,
            "review_score": Decimal("4.6"),
            "thumbnail_url": "https://example.com/hotel-seoul.jpg",
        },
        "rooms": [
            {
                "name": "Deluxe Double",
                "description": "Double bed room for two guests.",
                "max_guests": 2,
                "total_rooms": 12,
                "nightly_price": Decimal("180000.00"),
                "currency": "KRW",
            },
            {
                "name": "Premier Family",
                "description": "Larger room for small families or longer business stays.",
                "max_guests": 4,
                "total_rooms": 6,
                "nightly_price": Decimal("260000.00"),
                "currency": "KRW",
            },
        ],
    },
    {
        "city": {"name": "Busan", "country": "South Korea", "slug": "busan"},
        "hotel": {
            "name": "Busan Harbor House",
            "description": "Harbor-side stay with sea views, easy dining, and weekend-friendly room choices.",
            "address": "22 Harbor Road",
            "star_rating": 4,
            "review_score": Decimal("4.5"),
            "thumbnail_url": "https://example.com/hotel-busan.jpg",
        },
        "rooms": [
            {
                "name": "Harbor Twin",
                "description": "Twin room overlooking the harbor.",
                "max_guests": 2,
                "total_rooms": 10,
                "nightly_price": Decimal("145000.00"),
                "currency": "KRW",
            },
            {
                "name": "Ocean Suite",
                "description": "Suite with lounge area and broader sea view.",
                "max_guests": 3,
                "total_rooms": 4,
                "nightly_price": Decimal("310000.00"),
                "currency": "KRW",
            },
        ],
    },
    {
        "city": {"name": "Paris", "country": "France", "slug": "paris"},
        "hotel": {
            "name": "Maison Lumiere",
            "description": "Restored townhouse with sunlit rooms, a quiet courtyard, and quick access to galleries.",
            "address": "18 Rue du Marais",
            "star_rating": 5,
            "review_score": Decimal("4.8"),
            "thumbnail_url": "https://example.com/hotel-paris.jpg",
        },
        "rooms": [
            {
                "name": "Classic Queen",
                "description": "Quiet queen room facing the inner courtyard.",
                "max_guests": 2,
                "total_rooms": 9,
                "nightly_price": Decimal("182.00"),
                "currency": "USD",
            },
            {
                "name": "Courtyard Suite",
                "description": "Suite with sitting area and garden-facing windows.",
                "max_guests": 3,
                "total_rooms": 3,
                "nightly_price": Decimal("280.00"),
                "currency": "USD",
            },
        ],
    },
    {
        "city": {"name": "Tokyo", "country": "Japan", "slug": "tokyo"},
        "hotel": {
            "name": "Sakura Stay Ginza",
            "description": "Compact, polished city stay near shopping, transit, and late-night dining.",
            "address": "6 Ginza Crossing",
            "star_rating": 4,
            "review_score": Decimal("4.7"),
            "thumbnail_url": "https://example.com/hotel-tokyo.jpg",
        },
        "rooms": [
            {
                "name": "Smart Single",
                "description": "Efficient room for solo travelers.",
                "max_guests": 1,
                "total_rooms": 16,
                "nightly_price": Decimal("17000.00"),
                "currency": "JPY",
            },
            {
                "name": "Ginza King",
                "description": "King room with work desk and city view.",
                "max_guests": 2,
                "total_rooms": 8,
                "nightly_price": Decimal("28000.00"),
                "currency": "JPY",
            },
        ],
    },
]


class Command(BaseCommand):
    help = "Seed local demo cities, hotels, and room types for StayFinder development."

    @transaction.atomic
    def handle(self, *args, **options):
        created_hotels = 0
        created_rooms = 0

        for item in DEMO_HOTELS:
            city, _ = City.objects.update_or_create(
                slug=item["city"]["slug"],
                defaults={
                    "name": item["city"]["name"],
                    "country": item["city"]["country"],
                },
            )
            hotel_defaults = {**item["hotel"], "city": city}
            hotel, hotel_created = Hotel.objects.update_or_create(
                name=item["hotel"]["name"],
                defaults=hotel_defaults,
            )
            if hotel_created:
                created_hotels += 1

            for room in item["rooms"]:
                _, room_created = RoomType.objects.update_or_create(
                    hotel=hotel,
                    name=room["name"],
                    defaults=room,
                )
                if room_created:
                    created_rooms += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Seeded {len(DEMO_HOTELS)} demo hotels "
                f"({created_hotels} new hotels, {created_rooms} new room types)."
            )
        )

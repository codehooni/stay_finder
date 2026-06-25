from django.core.management import call_command
from django.test import TestCase

from hotels.models import City, Hotel, RoomType


class SeedDemoDataCommandTests(TestCase):
    def test_seed_demo_data_creates_reusable_hotel_catalog(self):
        call_command("seed_demo_data", verbosity=0)

        self.assertGreaterEqual(City.objects.count(), 4)
        self.assertGreaterEqual(Hotel.objects.count(), 4)
        self.assertGreaterEqual(RoomType.objects.count(), 8)

        for hotel in Hotel.objects.all():
            self.assertGreaterEqual(hotel.room_types.count(), 2)

    def test_seed_demo_data_is_idempotent(self):
        call_command("seed_demo_data", verbosity=0)
        first_counts = (City.objects.count(), Hotel.objects.count(), RoomType.objects.count())

        call_command("seed_demo_data", verbosity=0)

        self.assertEqual(
            (City.objects.count(), Hotel.objects.count(), RoomType.objects.count()),
            first_counts,
        )

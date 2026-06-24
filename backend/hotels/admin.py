from django.contrib import admin

from hotels.models import City, Hotel, RoomType


@admin.register(City)
class CityAdmin(admin.ModelAdmin):
    list_display = ["name", "country", "slug"]
    search_fields = ["name", "country", "slug"]


class RoomTypeInline(admin.TabularInline):
    model = RoomType
    extra = 0


@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ["name", "city", "star_rating", "review_score"]
    list_filter = ["city", "star_rating"]
    search_fields = ["name", "address", "city__name"]
    inlines = [RoomTypeInline]


@admin.register(RoomType)
class RoomTypeAdmin(admin.ModelAdmin):
    list_display = ["name", "hotel", "max_guests", "total_rooms", "nightly_price", "currency"]
    list_filter = ["currency", "max_guests"]
    search_fields = ["name", "hotel__name"]

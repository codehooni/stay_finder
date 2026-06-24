from django.contrib import admin
from django.urls import include, path
from rest_framework.routers import DefaultRouter

from hotels.views import HotelViewSet


router = DefaultRouter()
router.register("hotels", HotelViewSet, basename="hotel")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
]

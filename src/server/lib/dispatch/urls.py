from django.urls import path
from dispatch.views import (
    account_index,
    rider_index,
    driver_index,
    index,
    TripDetailView,
    # AccountListView,
    trip_index,
)


urlpatterns = [
    path("", index, name="core_index"),
    path("trips/", trip_index, name="trips_index"),
    path("riders/", rider_index, name="riders_index"),
    path("drivers/", driver_index, name="drivers_index"),
    path("<int:pk>/", TripDetailView.as_view(), name="trip_detail"),
    # path("account/", AccountListView.as_view()), # Old Class Based URL
    path("account/", account_index, name="account_index"),
]

htmx_urlpatterns = []

urlpatterns += htmx_urlpatterns

from django.shortcuts import render

# Create your views here.
from django_tables2 import RequestConfig, SingleTableView
from core.models import Driver, Account
from trip.models import Trip, Place
from dispatch.tables import TripTable, AccountTable
from dispatch.forms import AccountForm
from django.shortcuts import render
from django.views.generic.detail import DetailView
from django.views.generic import ListView
from django.http import (
    HttpRequest,
    HttpResponseRedirect,
    HttpResponseBadRequest,
    HttpResponse,
)
from django.db.models import Q
from django.template.loader import render_to_string  # <-- add


def trip_index(request):
    if request.htmx:
        template_name = "dispatch/trip/partials/list.html"
    else:
        template_name = "dispatch/trip/trip.html"
    return render(request, template_name)


def rider_index(request):
    if request.htmx:
        template_name = "dispatch/rider/partials/list.html"
    else:
        template_name = "dispatch/rider/rider.html"
    return render(request, template_name)


def driver_index(request):
    if request.htmx:
        template_name = "dispatch/driver/partials/list.html"
    else:
        template_name = "dispatch/driver/driver.html"
    return render(request, template_name)


def index(request):
    template_name = "dispatch/index.html"
    return render(request, template_name)


class TripDetailView(DetailView):
    model = Trip
    template_name = "dispatch/trip_detail.html"

    def get_template_names(self):
        request: HttpRequest = self.request  # type: ignore
        if getattr(request, "htmx", False):
            return ["dispatch/trips/partials/details.html"]
        return [self.template_name]

    def post(self, request: HttpRequest, *args, **kwargs):  # type: ignore
        self.object = self.get_object()
        origin_address = request.POST.get("origin_address", "").strip()
        destination_address = request.POST.get("destination_address", "").strip()
        origin_id = request.POST.get("origin_id", "").strip()
        destination_id = request.POST.get("destination_id", "").strip()

        # Upsert origin Place
        if origin_address and origin_id:
            origin_place, _ = Place.objects.update_or_create(
                place_id=origin_id,
                defaults={"address": origin_address},
            )
            self.object.origin = origin_place  # type: ignore

        # Upsert destination Place
        if destination_address and destination_id:
            destination_place, _ = Place.objects.update_or_create(
                place_id=destination_id,
                defaults={"address": destination_address},
            )
            self.object.destination = destination_place  # type: ignore

        # Optionally parse lat/lng to set coordinate if posted (not shown here)

        self.object.full_clean(exclude=["hashid"])  # validate model constraints
        self.object.save()

        if getattr(request, "htmx", False):
            context = self.get_context_data(object=self.object)
            return render(request, "dispatch/trips/partials/details.html", context)
        return HttpResponseRedirect(self.object.get_absolute_url())  # type: ignore


# Old Class Based View for Accounts using Django Tables
# class AccountListView(SingleTableView):
#     model = Account
#     template_name = "dispatch/account/list.html"
#     table_class = AccountTable


def account_index(request):
    if request.method == "POST":
        form = AccountForm(request.POST)
        if form.is_valid():
            account = form.save()
            context = {"account": account}
            return render(request, "dispatch/account/index.html#account-item", context)

    context = {"form": AccountForm(), "accounts": Account.objects.all()}
    return render(request, "dispatch/account/index.html", context)

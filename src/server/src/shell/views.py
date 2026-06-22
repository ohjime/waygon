import random

from django.http import HttpResponse
from django.shortcuts import render

from shell.utils import show_drawer, swap_content

# Pseudo destinations for the navbar. Colors are picked at random on each page
# load so the restructured shell is easy to eyeball — swap these for real
# hx-get destinations once the app grows.
DESTINATIONS = [
    "Trips",
    "Riders",
    "Drivers",
    "Dispatch",
    "Billing",
    "Reports",
    "Settings",
]

SWATCHES = [
    "bg-red-500",
    "bg-orange-500",
    "bg-amber-500",
    "bg-lime-500",
    "bg-emerald-500",
    "bg-teal-500",
    "bg-cyan-500",
    "bg-blue-500",
    "bg-indigo-500",
    "bg-violet-500",
    "bg-fuchsia-500",
    "bg-pink-500",
    "bg-rose-500",
]


def _random_destinations():
    return [
        {"label": label, "color": random.choice(SWATCHES)} for label in DESTINATIONS
    ]


def index(request):
    """Landing page for the restructured shell: navbar + drawer demo."""
    return render(
        request,
        "shell/home.html",
        {"destinations": _random_destinations()},
    )


# Sample copy for the demo endpoints. Plain data — the templates turn it into
# markup; the views never touch HTML.
LOREM = [
    "The dispatcher reassigns the route before the driver clocks in.",
    "A rider requested a return trip for the same afternoon.",
    "Surge pricing kicked in across the downtown corridor.",
    "Two vehicles are idling near the depot waiting on a manifest.",
    "The quote was generated but never confirmed by the client.",
    "Maintenance flagged unit 14 for a brake inspection.",
    "An overnight booking spilled into the morning shift.",
]


def swap(request):
    """Demo destination: show a page in #app_content (and close the navbar)."""
    if not request.htmx:
        return HttpResponse("Request Denied.")
    return swap_content(
        request,
        "shell/pages/destination.html",
        {
            "name": request.GET.get("name", "Home"),
            "paragraphs": random.sample(LOREM, k=random.randint(2, 4)),
        },
    )


def open_drawer(request):
    """Demo: show the test drawer."""
    if not request.htmx:
        return HttpResponse("Request Denied.")
    return show_drawer(
        request,
        "shell/drawers/test_drawer.html",
        {
            "ticket": random.randint(1000, 9999),
            "paragraphs": random.sample(LOREM, k=random.randint(2, 4)),
        },
    )

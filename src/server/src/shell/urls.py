from django.urls import path

from shell.views import index, open_drawer, swap


urlpatterns = [
    path("", index, name="shell_index"),
    path("drawer/", open_drawer, name="shell_open_drawer"),
    path("swap/", swap, name="shell_swap"),
]

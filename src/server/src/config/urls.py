from django.urls import include, path
from django.contrib import admin
from django.conf import settings

from config.api import api


urlpatterns = [
    path("admin/", admin.site.urls, name="admin"),
    path("api/", api.urls, name="api"),
    path("shell/", include("shell.urls")),
    path("", include("core.urls")),
]

if settings.DEBUG:
    urlpatterns += [
        path("__reload__/", include("django_browser_reload.urls")),
    ]

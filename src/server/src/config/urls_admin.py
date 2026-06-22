"""URLconf for the admin subdomain (admin.waygon.dev).

Mounts the Django admin at the site root so the admin lives at
``admin.waygon.dev/`` instead of ``admin.waygon.dev/admin/``. Selected per
request by ``config.middleware.SubdomainURLConf`` based on the Host header; the
default ``config.urls`` (admin at ``/admin/``) is untouched, so local dev and the
apex site are unaffected.
"""

from django.contrib import admin
from django.urls import path

urlpatterns = [
    path("", admin.site.urls),
]

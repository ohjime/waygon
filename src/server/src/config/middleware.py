"""Host-based URLconf switching.

Lets a subdomain serve a different URL tree at its root without affecting any
other host. Map a Host prefix to a urlconf module below; every other host —
including ``localhost`` under ``make server`` — keeps the default
``config.urls``, so local dev and the apex site stay unchanged.

To add another subdomain (e.g. ``api.waygon.dev`` -> the django-ninja API at the
root), create ``config/urls_api.py`` and add ``"api.": "config.urls_api"`` here.
"""

# Host prefix -> URLconf that mounts that app at the subdomain root.
SUBDOMAIN_URLCONFS = {
    "admin.": "config.urls_admin",  # admin.* -> Django admin at /
}


class SubdomainURLConf:
    """Swap ``request.urlconf`` based on the request Host.

    Runs before CommonMiddleware so the urlconf is set before URL resolution
    (and APPEND_SLASH). Hosts that match no prefix fall through to the default
    ROOT_URLCONF.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        host = request.get_host().split(":")[0].lower()
        for prefix, urlconf in SUBDOMAIN_URLCONFS.items():
            if host.startswith(prefix):
                request.urlconf = urlconf
                break
        return self.get_response(request)

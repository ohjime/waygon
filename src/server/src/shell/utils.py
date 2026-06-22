from django.http import HttpResponse
from django.shortcuts import render


# Both helpers below are thin HTMX wrappers around render(): a view picks a
# template and a context, the helper handles every swap/animation detail
# (where it lands, how it opens, how the navbar reacts). Views never deal with
# HTML, targets, or events — they just say which template to show.


def show_drawer(request, template, context=None):
    """
    Render `template` into the base drawer (#app_drawer_content) and slide it
    open. Mirrors core.utils.show_modal from cosound.

        return show_drawer(request, "shell/drawers/trip.html", {"trip": trip})

    The template lays out its own content with the <c-drawer> component
    (title / header_actions / body / footer_actions). The base drawer panel in
    shell/base.html listens for the `show-drawer` event — fired here via
    HX-Trigger-After-Swap — to open once the new content is swapped in.
    """
    response = render(request, template, context or {})
    response["HX-Retarget"] = "#app_drawer_content"
    response["HX-Reswap"] = "innerHTML"
    response["HX-Trigger-After-Swap"] = "show-drawer"
    return response


def swap_content(request, template, context=None, *, close_nav=True):
    """
    Render `template` into the main content region (#app_content). The swap-in
    animation is handled by CSS in shell/base.html (every fresh child of
    #app_content fades/slides in), so the template just renders its content.

        return swap_content(request, "shell/pages/trips.html", {"trips": trips})

    By default this also fires `nav:close`, which the navbar listens for to
    animate shut. Pass close_nav=False to leave the navbar open.
    """
    response = render(request, template, context or {})
    response["HX-Retarget"] = "#app_content"
    response["HX-Reswap"] = "innerHTML"
    if close_nav:
        response["HX-Trigger-After-Swap"] = "nav:close"
    return response


def close_drawer(request, template=None, context=None, reswap=None):
    """
    Close the base drawer (#app_drawer) by firing `close-drawer`. Optionally
    render a template whose body holds `hx-swap-oob` elements to update other
    parts of the page at the same time; `reswap` overrides the triggering
    element's hx-swap (defaults to "none" so the main swap is suppressed when
    OOB content is used).
    """
    if template:
        response = render(request, template, context or {})
    else:
        response = HttpResponse("")

    response["HX-Reswap"] = reswap or "none"
    response["HX-Trigger"] = "close-drawer"
    return response

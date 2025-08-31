from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

from unfold.admin import ModelAdmin
from unfold.contrib.filters.admin import FieldTextFilter
from unfold.forms import AdminPasswordChangeForm, UserChangeForm, UserCreationForm

from core.models import User, Account, Driver, Rider, Trip, Place


@admin.register(User)
class UserAdmin(BaseUserAdmin, ModelAdmin):
    form = UserChangeForm
    add_form = UserCreationForm
    change_password_form = AdminPasswordChangeForm
    list_filter_submit = True
    list_filter = [("email", FieldTextFilter)]


@admin.register(Account)
class AccountAdmin(ModelAdmin):
    list_filter_submit = True
    list_filter = [("email", FieldTextFilter)]


@admin.register(Driver)
class DriverAdmin(ModelAdmin):
    pass


@admin.register(Rider)
class RiderAdmin(ModelAdmin):
    pass


@admin.register(Trip)
class TripAdmin(ModelAdmin):
    pass


@admin.register(Place)
class PlaceAdmin(ModelAdmin):
    pass

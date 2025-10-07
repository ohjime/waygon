from django import forms
from core.models import Account


class AccountForm(forms.ModelForm):
    class Meta:
        model = Account
        fields = ("uid", "first_name", "last_name", "email", "phone", "avatar")

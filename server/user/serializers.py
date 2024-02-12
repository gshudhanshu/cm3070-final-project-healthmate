from rest_framework import serializers
import pytz
from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
User = get_user_model()

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'account_type', 'password']
        ref_name = 'CustomUserCreate'
        

class UserSerializer(UserCreateSerializer):
    timezone = serializers.ChoiceField(choices=pytz.all_timezones)
    class Meta(UserCreateSerializer.Meta):
        fields = ['id', 'username', 'first_name', 'last_name', 'account_type', 'email', 'timezone']
        ref_name = 'CustomUser'
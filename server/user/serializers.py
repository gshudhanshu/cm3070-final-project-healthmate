from rest_framework import serializers
import pytz
from djoser.serializers import UserCreateSerializer
from django.contrib.auth import get_user_model
User = get_user_model()


# class CustomUserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CustomUser
#         fields = '__all__'

# class UserSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CustomUser
#         fields =  ('email', 'username', 'first_name', 'last_name')
        

# class RegisterSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = CustomUser
#         fields =  ('email', 'username', 'first_name', 'last_name')
#         extra_kwargs = {'password': {'write_only': True}}

#     def create(self, validated_data):
#         user = CustomUser.objects.create_user(**validated_data)
#         return user

class UserCreateSerializer(UserCreateSerializer):
    class Meta(UserCreateSerializer.Meta):
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'account_type', 'password']
        ref_name = 'CustomUserCreate'
        


class UserSerializer(UserCreateSerializer):
    timezone = serializers.ChoiceField(choices=pytz.all_timezones)
    class Meta(UserCreateSerializer.Meta):
        fields = ['id', 'username', 'first_name', 'last_name', 'account_type', 'email', 'timezone']
        ref_name = 'CustomUser'
from rest_framework import serializers
from .models import CustomUser

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields =  ('email', 'username', 'first_name', 'last_name', 'phone')
        

class RegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields =  ('email', 'username', 'first_name', 'last_name', 'phone')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(**validated_data)
        return user

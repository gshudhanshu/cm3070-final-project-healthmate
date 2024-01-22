from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Doctor, Patient

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email']  # Add other fields you want to include

class DoctorSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Doctor
        fields = ['user', 'phone', 'hospital_address', 'specialties', 'qualifications', 'experience', 'profile_pic', 'cost', 'currency']

class PatientSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Patient
        fields = ['user', 'phone', 'dob', 'marital_status', 'gender', 'height', 'weight', 'blood_group', 'address', 'profile_pic']

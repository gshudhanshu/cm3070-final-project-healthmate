from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Doctor, Patient, Language, LanguageProficiency, Review, Speciality, Qualification, DoctorQualification, Address
from appointment.models import Appointment
from django.utils import timezone
from datetime import time, timedelta


User = get_user_model()

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']
        ref_name = 'UserProfile'
        
        
class LanguageProficiencySerializer(serializers.ModelSerializer):
    name = serializers.ReadOnlyField(source='language.name')
    
    class Meta:
        model = LanguageProficiency
        fields = ['name', 'level']
  
        
class SpecialitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Speciality
        fields = '__all__'
        
# class QualificationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Qualification
#         fields = '__all__' 
        
class DoctorQualificationSerializer(serializers.ModelSerializer):
    name = serializers.ReadOnlyField(source='qualification.name')
    university = serializers.ReadOnlyField(source='qualification.university')

    class Meta:
        model = DoctorQualification
        fields = ['name', 'university','start_year', 'finish_year']
        

class DoctorSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    specialties = SpecialitySerializer(many=True, read_only=True)
    languages = LanguageProficiencySerializer(source='languageproficiency_set', many=True, read_only=True)
    qualifications = DoctorQualificationSerializer(source='doctor_qualifications', many=True, read_only=True)
    reviews = serializers.SerializerMethodField()
    hospital_address = AddressSerializer(read_only=True)
    average_rating = serializers.SerializerMethodField(read_only=True) 
    appointment_slots = serializers.SerializerMethodField()
    
    class Meta:
        model = Doctor
        fields = '__all__'
        
    def get_reviews(self, obj):
        return ReviewSerializer(obj.reviews.all()[:5], many=True).data
    
    def get_average_rating(self, obj):
        return obj.average_rating()
    
    def get_appointment_slots(self, obj):
        # Calculate today's date
        today = timezone.now().date()
        # Define the start and end times for slots
        start_time = time(8, 0)  # 8 AM
        end_time = time(20, 0)  # 8 PM

        # Generate all 1-hour slots for today
        all_slots = [time(hour=h, minute=0) for h in range(start_time.hour, end_time.hour + 1)]

        # Retrieve today's appointments for this doctor
        appointments = Appointment.objects.filter(doctor=obj.user, date=today)

        booked_slots = [appointment.time for appointment in appointments]

        # Create a list of objects for all slots indicating their booking status
        slots_with_status = []
        for slot in all_slots:
            slot_str = slot.strftime('%H:%M')
            # Check if this slot is booked
            is_booked = any(booked_slot == slot for booked_slot in booked_slots)
            slot_info = {
                'time': slot_str,
                'status': 'booked' if is_booked else 'unbooked'
            }
            slots_with_status.append(slot_info)

        return slots_with_status


        

class PatientSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = Patient
        fields = ['user', 'phone', 'dob', 'marital_status', 'gender', 'height', 'weight', 'blood_group', 'address', 'profile_pic']


class ReviewSerializer(serializers.ModelSerializer):
    patient_name = serializers.ReadOnlyField(source='patient.user.get_full_name')

    class Meta:
        model = Review
        fields = ['id', 'patient_name', 'rating', 'comment', 'date_created']


class SimpleProfileSerializer(serializers.ModelSerializer):
    profile_pic = serializers.SerializerMethodField()
    username = serializers.CharField(source='user.username')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.EmailField(source='user.email')
    account_type = serializers.EmailField(source='user.account_type')

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'profile_pic', 'account_type']
        ref_name = 'SimpleProfile'
    
    def get_profile_pic(self, obj):
        return obj.profile_pic.url if obj.profile_pic else None



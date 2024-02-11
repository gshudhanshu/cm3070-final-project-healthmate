from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Doctor, Patient, Language, DoctorLanguageProficiency,PatientLanguageProficiency, Review, Speciality, Qualification, DoctorQualification, Address
from appointment.models import Appointment
from django.utils import timezone
from datetime import datetime, time, timedelta
import pytz
from django.utils.timezone import make_aware
from django.conf import settings




User = get_user_model()

class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = '__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    timezone = serializers.ChoiceField(choices=pytz.all_timezones)
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'timezone']
        ref_name = 'UserProfile'
        
        
class DoctorLanguageProficiencySerializer(serializers.ModelSerializer):
    name = serializers.ReadOnlyField(source='language.name')
    
    class Meta:
        model = DoctorLanguageProficiency
        fields = ['name', 'level']
        
class PatientLanguageProficiencySerializer(serializers.ModelSerializer):
    name = serializers.ReadOnlyField(source='language.name')
    
    class Meta:
        model = PatientLanguageProficiency
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
    languages = DoctorLanguageProficiencySerializer(source='doctor_language_proficiencies', many=True, read_only=True)
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
        request = self.context.get('request')
        user_timezone = request.user.timezone if hasattr(request.user, 'timezone') else 'UTC'
        tz = pytz.timezone(user_timezone) if isinstance(user_timezone, str) else user_timezone

        # Use today's date in the user's timezone
        today_user_tz = timezone.now().astimezone(tz).date()

        slots_with_status = []
        # Define working hours (8 AM to 8 PM)
        for hour in range(8, 20):
            # Create naive datetime for the slot
            slot_naive_datetime = datetime.combine(today_user_tz, time(hour, 0))
            # Make it timezone aware using the user's timezone
            slot_aware_datetime = make_aware(slot_naive_datetime, timezone=tz)
            # Convert to UTC to match stored appointments
            slot_utc_datetime = slot_aware_datetime.astimezone(pytz.utc)

            is_booked = Appointment.objects.filter(
                doctor=obj.user,
                date=slot_utc_datetime.date(),
                time=slot_utc_datetime.time()
            ).exists()

            slots_with_status.append({
                'date': slot_aware_datetime.strftime('%Y-%m-%d'),
                'time': slot_aware_datetime.strftime('%H:%M'),
                'status': 'booked' if is_booked else 'unbooked',
                'datetime_utc': slot_utc_datetime.isoformat()
            })

        return slots_with_status
    
        

class PatientSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    languages = PatientLanguageProficiencySerializer(source='patient_language_proficiencies', many=True, read_only=True)
    address =  AddressSerializer(read_only=True)

    class Meta:
        model = Patient
        fields = '__all__'
        # fields = ['languages', 'address', 'user']


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
    account_type = serializers.CharField(source='user.account_type')
    timezone = serializers.CharField(source='user.timezone')

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'profile_pic', 'account_type', 'timezone']
        ref_name = 'SimpleProfile'
    
    # def get_profile_pic(self, obj):
    #     return obj.profile_pic.url if obj.profile_pic else None
    
    def get_profile_pic(self, obj):
        return f"{settings.BASE_URL}{obj.profile_pic.url}" if obj.profile_pic else None
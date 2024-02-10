from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Doctor, Patient, Language, LanguageProficiency, Review, Speciality, Qualification, DoctorQualification, Address
from appointment.models import Appointment
from django.utils import timezone
from datetime import datetime, time, timedelta
import pytz
from django.utils.timezone import make_aware



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
        request = self.context.get('request')
        # Get date from request parameters or use today's date
        date_str = request.query_params.get('date', timezone.now().astimezone(pytz.utc).strftime('%Y-%m-%d'))
        # Get timezone from request parameters or use UTC
        tz_str = request.query_params.get('timezone', 'UTC')
        tz = pytz.timezone(tz_str)

        # Parse the date parameter
        try:
            appointment_date = datetime.strptime(date_str, '%Y-%m-%d')
        except ValueError:
            # If there's an error parsing the date, use today's date
            appointment_date = timezone.now().astimezone(pytz.utc).date()

        appointment_date = make_aware(datetime.combine(appointment_date, datetime.min.time()), timezone=pytz.utc)

        slots_with_status = []
        # Define working hours (8 AM to 8 PM)
        for hour in range(8, 20):
            slot_time = time(hour, 0)
            slot_datetime = make_aware(datetime.combine(appointment_date, slot_time), timezone=pytz.utc)
            # Adjust slot_datetime to the requested timezone
            slot_datetime_tz = slot_datetime.astimezone(tz)

            # Check if the slot is booked
            is_booked = Appointment.objects.filter(
                doctor=obj.user,
                date=slot_datetime_tz.date(),
                time=slot_datetime_tz.time()
            ).exists()

            slots_with_status.append({
                'date': slot_datetime_tz.strftime('%Y-%m-%d'),
                'time': slot_datetime_tz.strftime('%H:%M'),
                'status': 'booked' if is_booked else 'unbooked',
                'datetime_utc': slot_datetime.isoformat()
            })

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
    timezone = serializers.ChoiceField(choices=pytz.all_timezones)

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'profile_pic', 'account_type', 'timezone']
        ref_name = 'SimpleProfile'
    
    def get_profile_pic(self, obj):
        return obj.profile_pic.url if obj.profile_pic else None



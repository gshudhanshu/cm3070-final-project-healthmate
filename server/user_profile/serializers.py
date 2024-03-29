from django.forms import ValidationError
from rest_framework import serializers
from django.contrib.auth import get_user_model

from conversation.models import Conversation
from .models import Doctor, Patient, Language, DoctorLanguageProficiency,PatientLanguageProficiency, Review, Speciality, Qualification, DoctorQualification, Address
from appointment.models import Appointment
from django.utils import timezone
from datetime import datetime, time, timedelta
import pytz
from django.utils.timezone import make_aware, now
from django.conf import settings
from django.db import transaction
from zoneinfo import ZoneInfo

# Get the User model
User = get_user_model()

class AddressSerializer(serializers.ModelSerializer):
    """
    Serializer for Address model.
    """    
    class Meta:
        model = Address
        fields = '__all__'

class UserProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for User profile.
    """
    
    timezone = serializers.ChoiceField(choices=pytz.all_timezones)
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'timezone']
        ref_name = 'UserProfile'
        extra_kwargs = {
            'username': {'read_only': True},  
            'email': {'read_only': True},
        }

    
    def update(self, instance, validated_data):
        """
        Custom update method for User profile.
        """        
        # remove the username and email from the validated data
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.timezone = validated_data.get('timezone', instance.timezone)
        instance.save()
        return instance

        
        
class DoctorLanguageProficiencySerializer(serializers.ModelSerializer):
    """
    Serializer for Doctor's language proficiency.
    """    
    name = serializers.CharField(source='language.name')
    
    class Meta:
        model = DoctorLanguageProficiency
        fields = ['id','name', 'level']
        extra_kwargs = {'id': {'read_only': False, 'required': False}}
        

        
class PatientLanguageProficiencySerializer(serializers.ModelSerializer):
    """
    Serializer for Patient's language proficiency.
    """
    
    name = serializers.CharField(source='language.name')
    
    class Meta:
        model = PatientLanguageProficiency
        fields = ['id','name', 'level']
        extra_kwargs = {'id': {'read_only': False, 'required': False}}
        
  
        
class SpecialitySerializer(serializers.ModelSerializer):
    """
    Serializer for Speciality model.
    """
    
    class Meta:
        model = Speciality
        fields = '__all__'
        
# class QualificationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Qualification
#         fields = '__all__' 
        
class DoctorQualificationSerializer(serializers.ModelSerializer):
    """
    Serializer for Doctor's qualifications.
    """    
    name = serializers.CharField(source='qualification.name')
    university = serializers.CharField(source='qualification.university')

    class Meta:
        model = DoctorQualification
        fields = ['id','name', 'university','start_year', 'finish_year']
        extra_kwargs = {'id': {'read_only': False, 'required': False}}
        

class DoctorSerializer(serializers.ModelSerializer):
    """
    Serializer for Doctor model.
    """    
    user = UserProfileSerializer()
    specialties = SpecialitySerializer(many=True,)
    languages = DoctorLanguageProficiencySerializer(source='doctor_language_proficiencies', many=True, )
    qualifications = DoctorQualificationSerializer(source='doctor_qualifications', many=True, )
    reviews = serializers.SerializerMethodField()
    hospital_address = AddressSerializer()
    average_rating = serializers.SerializerMethodField() 
    appointment_slots = serializers.SerializerMethodField()
    profile_pic = serializers.ImageField(use_url=True, required=False, allow_null=True)
    
    class Meta:
        model = Doctor
        fields = '__all__'
        
    def get_reviews(self, obj):
        return ReviewSerializer(obj.reviews.all()[:5], many=True).data
    
    def get_average_rating(self, obj):
        return obj.average_rating()
    
    
    def get_appointment_slots(self, obj):
        """
        Get available appointment slots for the doctor.
        """        
        request = self.context.get('request')
        user_timezone_str = request.query_params.get('timezone', 'UTC')
        user_tz = ZoneInfo(user_timezone_str)


        datetime_str = request.query_params.get('datetime')
        
        # Get the requested datetime in the user's timezone or the current datetime
        if datetime_str:
            requested_datetime_user_tz = datetime.fromisoformat(datetime_str)
        else:
            user_tz = ZoneInfo(request.query_params.get('timezone', 'UTC'))
            requested_datetime_user_tz = make_aware(datetime.now(), timezone=user_tz)

        # Get the doctor's timezone
        doctor_tz = ZoneInfo(str(obj.get_timezone()))
        # ZoneInfo(obj.get_timezone())
        requested_datetime_doctor_tz = requested_datetime_user_tz.astimezone(doctor_tz)
        requested_date_doctor_tz = requested_datetime_doctor_tz.date()
        
        # Get current datetime in the user's timezone to filter out past slots
        current_datetime_user_tz = datetime.now(tz=user_tz)

        slots_with_status = []
        # Get the doctor's availability hours
        start_hour = obj.availability_start.hour
        end_hour = obj.availability_end.hour

        # Generate slots for the requested day in the doctor's timezone
        for hour in range(start_hour, end_hour):
            slot_time = time(hour, 0)
            slot_naive_datetime = datetime.combine(requested_date_doctor_tz, slot_time)
            slot_aware_datetime = make_aware(slot_naive_datetime, timezone=doctor_tz)
            slot_utc_datetime = slot_aware_datetime.astimezone(ZoneInfo('UTC'))
            
            # Convert the slot datetime back to the user's timezone for displaying
            slot_user_tz_datetime = slot_utc_datetime.astimezone(user_tz)
            
            # Filter out slots that have already passed in the user's timezone
            if slot_user_tz_datetime < current_datetime_user_tz:
                continue            


            is_booked = Appointment.objects.filter(
                doctor=obj.user,
                date=slot_utc_datetime.date(),
                time=slot_utc_datetime.time()
            ).exists()

            # Convert the slot datetime back to the user's timezone for displaying
            slot_user_tz_datetime = slot_utc_datetime.astimezone(user_tz)

            slots_with_status.append({
                'date': slot_user_tz_datetime.strftime('%Y-%m-%d'),
                'time': slot_user_tz_datetime.strftime('%H:%M'),
                'status': 'booked' if is_booked else 'unbooked',
                'datetime_utc': slot_utc_datetime.isoformat(),
                'datetime_user_tz': slot_user_tz_datetime.isoformat(),
            })

        return slots_with_status

    
    def update(self, instance, validated_data):
        """
        Custom update method for Doctor model.
        """        
        
        user_data = validated_data.pop('user', None)

        if user_data:
            # Retrieve the User instance from the Doctor instance
            user_instance = instance.user
            
            # Update the User instance with the validated data
            user_data.pop('username', None)  
            user_data.pop('email', None)
            
            # Manually update the User instance with the remaining data
            for attr, value in user_data.items():
                setattr(user_instance, attr, value)
            user_instance.save()

        
        languages_data = validated_data.pop('doctor_language_proficiencies', [])
        specialties_data = validated_data.pop('specialties', [])
        qualifications_data = validated_data.pop('doctor_qualifications', [])
        address_data = validated_data.pop('hospital_address', None)
        profile_pic = validated_data.get('profile_pic', None)
        
        if profile_pic is not None:
            instance.profile_pic = profile_pic


        with transaction.atomic():
            # Update the remaining direct fields on Doctor
            for attr, value in validated_data.items():
                if attr != 'profile_pic':
                    setattr(instance, attr, value)
            instance.save()

            # Languages
            self.update_languages(instance, languages_data)

            # Specialties
            self.update_specialties(instance, specialties_data)

            # Qualifications
            self.update_qualifications(instance, qualifications_data)

            # Address
            self.update_address(instance, address_data)

        return instance

    def update_languages(self, doctor, languages_data):
        """
        Update the languages for a doctor.
        """
        doctor.doctor_language_proficiencies.all().delete()
        for language_data in languages_data:
            # Accessing the nested 'name' correctly
            language_name = language_data.get('language', {}).get('name')
            if not language_name:
                # Handle the case where language name is missing or structure is unexpected
                print("Language name missing or data structure is incorrect.")
                continue  # Skip this iteration

            language, _ = Language.objects.get_or_create(name=language_name)
            DoctorLanguageProficiency.objects.create(
                doctor=doctor,
                language=language,
                level=language_data.get('level') or 'native'
            )

    def update_specialties(self, doctor, specialties_data):
        """
        Update the specialties for a doctor.
        """
        doctor.specialties.clear()
        for specialty_data in specialties_data:
            specialty, _ = Speciality.objects.get_or_create(name=specialty_data['name'])
            doctor.specialties.add(specialty)

    def update_qualifications(self, doctor, qualifications_data):
        """
        Update the qualifications for a doctor.
        """
        
        DoctorQualification.objects.filter(doctor=doctor).delete()
        for qualification_data in qualifications_data:
            qualification, _ = Qualification.objects.get_or_create(
                name=qualification_data['qualification']['name'],
                university=qualification_data['qualification']['university']
            )
            DoctorQualification.objects.create(
                doctor=doctor,
                qualification=qualification,
                start_year=qualification_data.get('start_year'),
                finish_year=qualification_data.get('finish_year')
            )

    def update_address(self, doctor, address_data):
        """
        Update the address for a doctor.
        """
        if address_data:
            address_id = doctor.hospital_address_id
            Address.objects.filter(id=address_id).update(**address_data)

        

class PatientSerializer(serializers.ModelSerializer):
    """
    Serializer for Patient model.
    """    
    user = UserProfileSerializer()
    languages = PatientLanguageProficiencySerializer(source='patient_language_proficiencies', many=True, )
    address =  AddressSerializer()
    profile_pic = serializers.ImageField(use_url=True, required=False, allow_null=True)

    class Meta:
        model = Patient
        fields = '__all__'
        # fields = ['languages', 'address', 'user']
        
    def update(self, instance, validated_data):
        """
        Custom update method for Patient model.
        """

        # Extract nested data
        
        user_data = validated_data.pop('user', None)
        languages_data = validated_data.pop('patient_language_proficiencies', [])
        address_data = validated_data.pop('address', None)
        profile_pic = validated_data.get('profile_pic', None)
        
        if profile_pic is not None:
            instance.profile_pic = profile_pic
        

        # Update the User instance
        if user_data:
            user_serializer = UserProfileSerializer(instance=instance.user, data=user_data, partial=True)
            user_serializer.is_valid(raise_exception=True)
            user_serializer.save()
            

        # Update or create the Address instance
        if address_data:
            address_serializer = AddressSerializer(instance=instance.address, data=address_data, partial=True)
            address_serializer.is_valid(raise_exception=True)
            instance.address = address_serializer.save()
          

        for language_data in languages_data:
            instance.patient_language_proficiencies.all().delete()
            # Accessing the nested 'name' correctly
            language_name = language_data.get('language', {}).get('name')
            if not language_name:
                # Handle the case where language name is missing or structure is unexpected
                print("Language name missing or data structure is incorrect.")
                continue  

            language, _ = Language.objects.get_or_create(name=language_name)
            PatientLanguageProficiency.objects.create(
                 patient=instance,
                language=language,
                level=language_data.get('level') or 'native'
            )


        
        # Update the remaining direct fields on Patient
        for attr, value in validated_data.items():
            if attr != 'profile_pic':
                setattr(instance, attr, value)
        instance.save()

        return instance



class ReviewSerializer(serializers.ModelSerializer):
    """
    Serializer for Review model.
    """
    
    patient_name = serializers.ReadOnlyField(source='patient.user.get_full_name')
    conversation_id = serializers.IntegerField()

    class Meta:
        model = Review
        fields = ['id', 'patient_name', 'rating', 'comment', 'date_created', "conversation_id"]
        
    def create(self, validated_data):
        """
        Custom create method for Review model.
        """
        
        conversation_id = validated_data.pop('conversation_id')
        conversation = Conversation.objects.get(id=conversation_id)

        # Check if a review already exists for this conversation
        if Review.objects.filter(conversation=conversation).exists():
            raise serializers.ValidationError({
                'error': 'A review already exists for this conversation.'
            })

        # Ensure that the conversation's doctor is indeed a Doctor instance
        try:
            doctor = Doctor.objects.get(user=conversation.doctor)
        except Doctor.DoesNotExist:
            raise serializers.ValidationError({
                'error': 'The specified doctor does not exist.'
            })

        patient = Patient.objects.get(user=self.context['request'].user)

        # Create the Review instance
        review = Review.objects.create(
            doctor=doctor,
            patient=patient,
            conversation=conversation,
            **validated_data
        )

        return review

    


class SimpleProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for a simplified User profile.
    """
    profile_pic = serializers.SerializerMethodField()
    username = serializers.CharField(source='user.username')
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.EmailField(source='user.email')
    account_type = serializers.CharField(source='user.account_type')
    timezone = serializers.CharField(source='user.timezone')
    id = serializers.IntegerField(source='user.id')

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'profile_pic', 'account_type', 'timezone']
        ref_name = 'SimpleProfile'
    
    # def get_profile_pic(self, obj):
    #     return obj.profile_pic.url if obj.profile_pic else None
    
    def get_profile_pic(self, obj):
        """
        Method to get the profile picture of the user.
        """
        
        return f"{settings.BASE_URL}{obj.profile_pic.url}" if obj.profile_pic else None
    
    

class SimpleDoctorProfileSerializer(serializers.ModelSerializer):
    """
    Serializer for a simplified Doctor profile.
    """    
    user = UserProfileSerializer(read_only=True)
    specialties = SpecialitySerializer(many=True, read_only=True)
    qualifications = DoctorQualificationSerializer(source='doctor_qualifications', many=True, read_only=True)
    hospital_address = AddressSerializer(read_only=True)
    average_rating = serializers.SerializerMethodField(read_only=True) 
    
    class Meta:
        model = Doctor
        fields = '__all__'
            
    def get_average_rating(self, obj):
        """
        Method to get the average rating of the doctor.
        """
        
        return obj.average_rating()
    

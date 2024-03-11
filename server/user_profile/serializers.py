from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Doctor, Patient, Language, DoctorLanguageProficiency,PatientLanguageProficiency, Review, Speciality, Qualification, DoctorQualification, Address
from appointment.models import Appointment
from django.utils import timezone
from datetime import datetime, time, timedelta
import pytz
from django.utils.timezone import make_aware
from django.conf import settings
from django.db import transaction





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
        extra_kwargs = {
            'username': {'read_only': True},  
            'email': {'read_only': True},
        }

    
    def update(self, instance, validated_data):
        # remove the username and email from the validated data
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.timezone = validated_data.get('timezone', instance.timezone)
        instance.save()
        return instance

        
        
class DoctorLanguageProficiencySerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='language.name')
    
    class Meta:
        model = DoctorLanguageProficiency
        fields = ['id','name', 'level']
        extra_kwargs = {'id': {'read_only': False, 'required': False}}
        
    # def create(self, validated_data):
    #     # Get or create the Language instance based on the name
    #     language_name = validated_data.pop('name')
    #     language, _ = Language.objects.get_or_create(name=language_name)
        
    #     # Create the DoctorLanguageProficiency instance
    #     proficiency_instance = DoctorLanguageProficiency.objects.create(
    #         language=language, **validated_data)
        
    #     return proficiency_instance

    # def update(self, instance, validated_data):
    #     # Assuming language names can be updated,
    #     # you'd handle that here similarly to 'create'
    #     language_name = validated_data.pop('name', None)
    #     if language_name:
    #         language, _ = Language.objects.get_or_create(name=language_name)
    #         instance.language = language
            
    #     # Update other fields as normal
    #     for attr, value in validated_data.items():
    #         setattr(instance, attr, value)
    #     instance.save()

    #     return instance

        
class PatientLanguageProficiencySerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='language.name')
    
    class Meta:
        model = PatientLanguageProficiency
        fields = ['id','name', 'level']
        
  
        
class SpecialitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Speciality
        fields = '__all__'
        
# class QualificationSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Qualification
#         fields = '__all__' 
        
class DoctorQualificationSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source='qualification.name')
    university = serializers.CharField(source='qualification.university')

    class Meta:
        model = DoctorQualification
        fields = ['id','name', 'university','start_year', 'finish_year']
        extra_kwargs = {'id': {'read_only': False, 'required': False}}
        

class DoctorSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer()
    specialties = SpecialitySerializer(many=True,)
    languages = DoctorLanguageProficiencySerializer(source='doctor_language_proficiencies', many=True, )
    qualifications = DoctorQualificationSerializer(source='doctor_qualifications', many=True, )
    reviews = serializers.SerializerMethodField()
    hospital_address = AddressSerializer()
    average_rating = serializers.SerializerMethodField() 
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

    
    def update(self, instance, validated_data):
        
        print('validated_data',validated_data)
        
        user_data = validated_data.pop('user', None)
        print(user_data)

        if user_data:
            # Retrieve the User instance from the Doctor instance
            user_instance = instance.user
            
            # Skip updating 'username' and 'email' by popping them out of user_data
            user_data.pop('username', None)  # Remove 'username' to prevent its update
            user_data.pop('email', None)  # Remove 'email' to prevent its update
            
            # Manually update the User instance with the remaining data
            for attr, value in user_data.items():
                setattr(user_instance, attr, value)
            user_instance.save()

        
        languages_data = validated_data.pop('doctor_language_proficiencies', [])
        specialties_data = validated_data.pop('specialties', [])
        qualifications_data = validated_data.pop('doctor_qualifications', [])
        address_data = validated_data.pop('hospital_address', None)
        
        

        with transaction.atomic():
            # Update the Doctor instance
            for attr, value in validated_data.items():
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
        doctor.specialties.clear()
        for specialty_data in specialties_data:
            specialty, _ = Speciality.objects.get_or_create(name=specialty_data['name'])
            doctor.specialties.add(specialty)

    def update_qualifications(self, doctor, qualifications_data):
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
        
        if address_data:
            address_id = doctor.hospital_address_id
            Address.objects.filter(id=address_id).update(**address_data)



        

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
    id = serializers.IntegerField(source='user.id')

    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email', 'profile_pic', 'account_type', 'timezone']
        ref_name = 'SimpleProfile'
    
    # def get_profile_pic(self, obj):
    #     return obj.profile_pic.url if obj.profile_pic else None
    
    def get_profile_pic(self, obj):
        return f"{settings.BASE_URL}{obj.profile_pic.url}" if obj.profile_pic else None
    
    

class SimpleDoctorProfileSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    specialties = SpecialitySerializer(many=True, read_only=True)
    qualifications = DoctorQualificationSerializer(source='doctor_qualifications', many=True, read_only=True)
    hospital_address = AddressSerializer(read_only=True)
    average_rating = serializers.SerializerMethodField(read_only=True) 
    
    class Meta:
        model = Doctor
        fields = '__all__'
            
    def get_average_rating(self, obj):
        return obj.average_rating()
    

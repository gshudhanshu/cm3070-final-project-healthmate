from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Doctor, Patient, Language, LanguageProficiency, Review, Speciality, Qualification, DoctorQualification, Address

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
    
    class Meta:
        model = Doctor
        fields = '__all__'
        
    def get_reviews(self, obj):
        return ReviewSerializer(obj.reviews.all()[:5], many=True).data
        

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
        # Check if the user is a doctor
        if hasattr(obj, 'doctor_profile'):
            return obj.doctor_profile.profile_pic.url if obj.doctor_profile.profile_pic else None

        # Check if the user is a patient
        if hasattr(obj, 'patient_profile'):
            return obj.patient_profile.profile_pic.url if obj.patient_profile.profile_pic else None

        return None

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Doctor, Patient, Language, LanguageProficiency, Speciality, Qualification

User = get_user_model()

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']
        ref_name = 'UserProfile'
        
        
class LanguageProficiencySerializer(serializers.ModelSerializer):
    language_name = serializers.ReadOnlyField(source='language.name')
    
    class Meta:
        model = LanguageProficiency
        fields = ['language_name', 'level']
  
        
class SpecialitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Speciality
        fields = '__all__'
        
class QualificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Qualification
        fields = '__all__'

class DoctorSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    specialties = SpecialitySerializer(many=True, read_only=True)
    language_proficiencies = LanguageProficiencySerializer(source='languageproficiency_set', many=True, read_only=True)

    qualifications = QualificationSerializer(many=True, read_only=True)
    
    class Meta:
        model = Doctor
        fields = '__all__'
        

class PatientSerializer(serializers.ModelSerializer):
    user = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = Patient
        fields = ['user', 'phone', 'dob', 'marital_status', 'gender', 'height', 'weight', 'blood_group', 'address', 'profile_pic']

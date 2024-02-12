from rest_framework import serializers
from .models import Appointment
from user_profile.serializers import SimpleProfileSerializer, SimpleDoctorProfileSerializer
from conversation.serializers import ConversationSerializer



class AppointmentSerializer(serializers.ModelSerializer):
    patient = SimpleProfileSerializer(source='patient.patient_profile', read_only=True)
    doctor = SimpleDoctorProfileSerializer(source='doctor.doctor_profile', read_only=True)
    conversation = ConversationSerializer(read_only=True)
    class Meta:
        model = Appointment
        fields = '__all__'

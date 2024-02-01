from rest_framework import serializers
from .models import Conversation, Message, Call

from user.serializers import UserSerializer
from user_profile.serializers import DoctorSerializer, PatientSerializer

class ConversationSerializer(serializers.ModelSerializer):
    patient = serializers.SerializerMethodField()
    # doctor = serializers.SerializerMethodField()
    # last_message = serializers.SerializerMethodField()
    
    class Meta:
        model = Conversation
        fields = '__all__'
        
    def get_patient(self, obj):
        print(obj.patient)
        return PatientSerializer(obj.patient).data
    
    def get_doctor(self, obj):
        return DoctorSerializer(obj.doctor).data
    
    def get_lat_message (self, obj):
        last_message = obj.messages.order_by('-timestamp').first()
        return MessageSerializer(last_message).data if last_message else None


class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = '__all__'

class CallSerializer(serializers.ModelSerializer):
    class Meta:
        model = Call
        fields = '__all__'

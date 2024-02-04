from rest_framework import serializers
from .models import Conversation, Message, Call, Attachment
from user_profile.models import Doctor, Patient

from user.serializers import UserSerializer
from user_profile.serializers import DoctorSerializer, PatientSerializer, SimpleProfileSerializer

class AttachmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Attachment
        fields = '__all__'
        extra_kwargs = {'message': {'required': False, 'allow_null': True}}


class ConversationSerializer(serializers.ModelSerializer):
    patient = serializers.SerializerMethodField()
    doctor = serializers.SerializerMethodField()
    last_message = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = '__all__'

    def get_patient(self, obj):
        patient_profile = obj.patient.patient_profile
        return SimpleProfileSerializer(patient_profile).data if patient_profile else None
    
    def get_doctor(self, obj):
        doctor_profile = obj.doctor.doctor_profile
        return SimpleProfileSerializer(doctor_profile).data if doctor_profile else None
    
    def get_last_message(self, obj):
        last_message = obj.messages.order_by('-timestamp').first()
        return MessageSerializer(last_message).data if last_message else None


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    type = serializers.SerializerMethodField(method_name='get_type')
    attachments = AttachmentSerializer(many=True, read_only=True,)


    class Meta:
        model = Message
        fields = '__all__'
        
    def get_sender(self, obj):
        if(obj.sender.account_type == 'patient'):
            sender_profile = obj.sender.patient_profile
        else :
            sender_profile = obj.sender.doctor_profile
        return SimpleProfileSerializer(sender_profile).data if sender_profile else None
    
    def get_type(self, obj):
        return 'message'
    


class CallSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField(method_name='get_type')
    class Meta:
        model = Call
        fields = '__all__'
        
    def get_type(self, obj):
        return 'call'



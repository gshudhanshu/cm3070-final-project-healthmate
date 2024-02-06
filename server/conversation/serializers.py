from rest_framework import serializers
from .models import Conversation, Message, Call, Attachment
from user_profile.models import Doctor, Patient
from django.conf import settings


from user.serializers import UserSerializer
from user_profile.serializers import DoctorSerializer, PatientSerializer, SimpleProfileSerializer

class AttachmentSerializer(serializers.ModelSerializer):
    file_name = serializers.SerializerMethodField()
    file_size = serializers.SerializerMethodField()
    file_extension = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()
    class Meta:
        model = Attachment
        fields = '__all__'
        extra_kwargs = {'message': {'required': False, 'allow_null': True}}
        
    def get_file_name(self, obj):
        return obj.file.name.split('/')[-1] if obj.file else None

    def get_file_size(self, obj):
        if not obj.file:
            return None
        size = obj.file.size
        if size < 1024:
            return f"{size} B"
        elif size < 1048576:
            return f"{size / 1024:.2f} KB"
        else:
            return f"{size / 1048576:.2f} MB"
        
        
    def get_file_extension(self, obj):
        return obj.file.name.split('.')[-1] if obj.file and '.' in obj.file.name else None
    
    def get_file_url(self, obj):
        if obj.file:
            # Construct the absolute URL
            return f"{settings.BASE_URL}{obj.file.url}"
        return None
    
    
    


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
    caller = serializers.SerializerMethodField()
    receiver = serializers.SerializerMethodField()
    class Meta:
        model = Call
        fields = '__all__'
        
    def get_type(self, obj):
        return 'call'
    
    def get_caller(self, obj):
        if(obj.caller.account_type == 'patient'):
            caller_profile = obj.caller.patient_profile
        else :
            caller_profile = obj.caller.doctor_profile
        return SimpleProfileSerializer(caller_profile).data if caller_profile else None
    
    def get_receiver(self, obj):
        if(obj.receiver.account_type == 'patient'):
            receiver_profile = obj.receiver.patient_profile
        else :
            receiver_profile = obj.receiver.doctor_profile
        return SimpleProfileSerializer(receiver_profile).data if receiver_profile else None
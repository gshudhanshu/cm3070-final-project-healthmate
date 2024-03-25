from rest_framework import viewsets, permissions
from .models import MedicalRecord
from .serializers import MedicalRecordSerializer, MedicalRecordCreateSerializer
from conversation.models import Conversation
from django.db.models import Q
from django.db import transaction
from django.shortcuts import get_object_or_404
from .serializers import DisorderSerializer, MedicineSerializer, DiagnosisSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework.exceptions import ValidationError


# Get the User model
from django.contrib.auth import get_user_model
User = get_user_model()


class MedicalRecordViewSet(viewsets.ModelViewSet):
    """
    A viewset for handling MedicalRecord instances.
    """
    
    serializer_class = MedicalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        """
        Retrieve the MedicalRecord instance based on the user's role and provided query parameters.
        """        
        user = self.request.user
        username = self.request.query_params.get('username', None)
        conversation_id = self.request.query_params.get('conversation_id', None)
    

        print(username, conversation_id, user.is_authenticated)

        if user.is_authenticated:
            # If the data fetcher is the patient themselves
            if hasattr(user, 'patient_profile') and username == user.username:
                return MedicalRecord.objects.filter(patient__user=user).first()
            # If the data fetcher is a doctor
            if hasattr(user, 'doctor_profile') and username == user.username:
                return None
            # If the data fetcher is a doctor
            elif hasattr(user, 'doctor_profile'):
                print(user.account_type)
                if conversation_id:
                    # Ensure the doctor is part of the conversation
                    conversation = get_object_or_404(Conversation, id=conversation_id)
                    if user in [conversation.doctor, conversation.patient]:
                        # Fetch the medical record of the patient involved in the conversation
                        patient_user = get_object_or_404(User, username=username)
                        return MedicalRecord.objects.filter(patient__user=patient_user).first()
                    else:
                        # Doctor is not part of the conversation
                        return None
                else:
                    # Conversation ID not provided
                    return None
            else:
                # User is neither the patient nor the doctor
                return None
        else:
            # User is not authenticated
            return None
        
    
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        """
        Either create a new MedicalRecord instance or retrieve an existing one based on the patient ID.
        """
        request.data['patient'] = request.data.get('patient_id')
        
        serializer = MedicalRecordCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        medical_record = serializer.save()

        return Response(serializer.data, status=status.HTTP_201_CREATED)


from rest_framework import viewsets, permissions
from .models import MedicalRecord
from .serializers import MedicalRecordSerializer
from conversation.models import Conversation
from django.db.models import Q
from django.shortcuts import get_object_or_404


from django.contrib.auth import get_user_model
User = get_user_model()


# class MedicalRecordViewSet(viewsets.ModelViewSet):
#     queryset = MedicalRecord.objects.all()
#     serializer_class = MedicalRecordSerializer
#     permission_classes = permissions.IsAuthenticated,



class MedicalRecordViewSet(viewsets.ModelViewSet):
    serializer_class = MedicalRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        user = self.request.user
        username = self.request.query_params.get('username', None)
        conversation_id = self.request.query_params.get('conversation_id', None)
    
        
        print(username, conversation_id, user.is_authenticated)

        if user.is_authenticated:
            # If the data fetcher is the patient themselves
            if hasattr(user, 'patient_profile') and username == user.username:
                return MedicalRecord.objects.filter(patient__user=user)
            # If the data fetcher is a doctor
            elif hasattr(user, 'doctor_profile'):
                if conversation_id:
                    # Ensure the doctor is part of the conversation
                    conversation = get_object_or_404(Conversation, id=conversation_id)
                    if user in [conversation.doctor.user, conversation.patient.user]:
                        # Fetch the medical record of the patient involved in the conversation
                        patient_user = get_object_or_404(User, username=username)
                        return MedicalRecord.objects.filter(patient__user=patient_user)
                    else:
                        # Doctor is not part of the conversation
                        return MedicalRecord.objects.none()
                else:
                    # Conversation ID not provided
                    return MedicalRecord.objects.none()
            else:
                # User is neither the patient nor the doctor
                return MedicalRecord.objects.none()
        else:
            # User is not authenticated
            return MedicalRecord.objects.none()

from rest_framework import viewsets, permissions
from .models import MedicalRecord
from .serializers import MedicalRecordSerializer
from conversation.models import Conversation
from django.db.models import Q
from django.db import transaction
from django.shortcuts import get_object_or_404
from .serializers import DisorderSerializer, MedicineSerializer, DiagnosisSerializer
from rest_framework import status
from rest_framework.response import Response


from django.contrib.auth import get_user_model
User = get_user_model()


# class MedicalRecordViewSet(viewsets.ModelViewSet):
#     queryset = MedicalRecord.objects.all()
#     serializer_class = MedicalRecordSerializer
#     permission_classes = permissions.IsAuthenticated,



# class MedicalRecordViewSet(viewsets.ModelViewSet):
#     serializer_class = MedicalRecordSerializer
#     permission_classes = [permissions.IsAuthenticated]

#     def get_object(self):
#         user = self.request.user
#         username = self.request.query_params.get('username', None)
#         conversation_id = self.request.query_params.get('conversation_id', None)
    
        
#         print(username, conversation_id, user.is_authenticated)

#         if user.is_authenticated:
#             # If the data fetcher is the patient themselves
#             if hasattr(user, 'patient_profile') and username == user.username:
#                 return MedicalRecord.objects.filter(patient__user=user)
#             # If the data fetcher is a doctor
#             elif hasattr(user, 'doctor_profile'):
#                 if conversation_id:
#                     # Ensure the doctor is part of the conversation
#                     conversation = get_object_or_404(Conversation, id=conversation_id)
#                     if user in [conversation.doctor.user, conversation.patient.user]:
#                         # Fetch the medical record of the patient involved in the conversation
#                         patient_user = get_object_or_404(User, username=username)
#                         return MedicalRecord.objects.filter(patient__user=patient_user)
#                     else:
#                         # Doctor is not part of the conversation
#                         return MedicalRecord.objects.none()
#                 else:
#                     # Conversation ID not provided
#                     return MedicalRecord.objects.none()
#             else:
#                 # User is neither the patient nor the doctor
#                 return MedicalRecord.objects.none()
#         else:
#             # User is not authenticated
#             return MedicalRecord.objects.none()


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
        # Extract the nested data
        disorders_data = request.data.pop('disorders', [])
        medicines_data = request.data.pop('medicines', [])
        diagnoses_data = request.data.pop('diagnoses', [])

        # Now handle the creation of the MedicalRecord
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        medical_record = serializer.save()

        # Handle the creation of nested objects
        disorders_serializer = DisorderSerializer(data=disorders_data, many=True)
        if disorders_serializer.is_valid():
            disorders_serializer.save(medical_record=medical_record)

        medicines_serializer = MedicineSerializer(data=medicines_data, many=True)
        if medicines_serializer.is_valid():
            medicines_serializer.save(medical_record=medical_record)

        diagnoses_serializer = DiagnosisSerializer(data=diagnoses_data, many=True)
        if diagnoses_serializer.is_valid():
            diagnoses_serializer.save(medical_record=medical_record)

        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

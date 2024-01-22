from rest_framework import viewsets
from .models import MedicalRecord, Disorder, Medicine, Diagnosis, AppointmentHistory
from .serializers import (MedicalRecordSerializer, DisorderSerializer, 
                          MedicineSerializer, DiagnosisSerializer, AppointmentHistorySerializer)
from rest_framework.permissions import IsAuthenticated

class MedicalRecordViewSet(viewsets.ModelViewSet):
    serializer_class = MedicalRecordSerializer
    queryset = MedicalRecord.objects.all()
    permission_classes = [IsAuthenticated]

class DisorderViewSet(viewsets.ModelViewSet):
    serializer_class = DisorderSerializer
    queryset = Disorder.objects.all()
    permission_classes = [IsAuthenticated]

class MedicineViewSet(viewsets.ModelViewSet):
    serializer_class = MedicineSerializer
    queryset = Medicine.objects.all()
    permission_classes = [IsAuthenticated]

class DiagnosisViewSet(viewsets.ModelViewSet):
    serializer_class = DiagnosisSerializer
    queryset = Diagnosis.objects.all()
    permission_classes = [IsAuthenticated]

class AppointmentHistoryViewSet(viewsets.ModelViewSet):
    serializer_class = AppointmentHistorySerializer
    queryset = AppointmentHistory.objects.all()
    permission_classes = [IsAuthenticated]

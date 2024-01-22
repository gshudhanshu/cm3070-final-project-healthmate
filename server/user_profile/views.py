from rest_framework import viewsets
from .models import Doctor, Patient
from .serializers import DoctorSerializer, PatientSerializer
from rest_framework.permissions import IsAuthenticated

class DoctorViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing doctor instances.
    """
    serializer_class = DoctorSerializer
    queryset = Doctor.objects.all()
    permission_classes = [IsAuthenticated] 

class PatientViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing patient instances.
    """
    serializer_class = PatientSerializer
    queryset = Patient.objects.all()
    permission_classes = [IsAuthenticated] 

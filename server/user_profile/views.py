from rest_framework import viewsets
from .models import Doctor, Patient
from .serializers import DoctorSerializer, PatientSerializer
from .permissions import IsOwnerOrReadOnly, IsDoctorOrReadOnly
from rest_framework import permissions

class DoctorViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing doctor instances.
    """
    serializer_class = DoctorSerializer
    permission_classes = [IsOwnerOrReadOnly]
    lookup_field = 'user__username'
    queryset = Doctor.objects.all()
    
    def get_queryset(self):
        """
        This view should return a list of all records for
        any user but only allow updating their own profile.
        """
        queryset = Doctor.objects.all()
        user = self.request.user
        if user.is_authenticated and self.lookup_field == user.username and hasattr(user, 'doctor_profile'):
            queryset = queryset.filter(user=user)
        return queryset




class PatientViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing patient instances.
    """
    serializer_class = PatientSerializer
    permission_classes = [IsDoctorOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        """
        This view should return a list of all patient records
        for doctors, but patients should only see their own profile.
        """
        user = self.request.user
        if user.is_authenticated:
            if hasattr(user, 'doctor_profile'):
                return Patient.objects.all()
            if hasattr(user, 'patient_profile'):
                return Patient.objects.filter(user=user)
        return Patient.objects.none()

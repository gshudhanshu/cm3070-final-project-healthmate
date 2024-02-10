from rest_framework import status, viewsets
from rest_framework.response import Response
from .models import Appointment
from .serializers import AppointmentSerializer
from rest_framework.permissions import IsAuthenticated
from datetime import timedelta, time
from django.utils import timezone
import pytz
from dateutil.parser import parse




from django.contrib.auth import get_user_model
User = get_user_model()



class AppointmentViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing appointment instances.
    """
    serializer_class = AppointmentSerializer
    queryset = Appointment.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        Restricts the returned appointments to those associated with the given user,
        either as a patient or as a doctor.
        """
        queryset = super().get_queryset()
        user = self.request.user

        if user.is_authenticated:
            # Check if the user has a doctor profile
            if hasattr(user, 'doctor_profile'):
                # User is a doctor, return appointments for this doctor
                queryset = queryset.filter(doctor=user.doctor_profile)
            else:
                # User is assumed to be a patient, return appointments for this patient
                queryset = queryset.filter(patient=user)

        return queryset
    
    
    def create(self, request, *args, **kwargs):
        # Extract data from request
        doctor_username = request.data.get('doctor')
        datetime_utc_str = request.data.get('datetime_utc')
        purpose = request.data.get('purpose', '')

        # Convert datetime_utc to aware datetime object
        datetime_aware = parse(datetime_utc_str)

        # Find doctor by username
        try:
            doctor = User.objects.get(username=doctor_username)
        except User.DoesNotExist:
            return Response({'error': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)

        # Create appointment
        appointment = Appointment(
            patient=request.user,
            doctor=doctor,
            date=datetime_aware.date(),
            time=datetime_aware.time(),
            purpose=purpose
        )
        appointment.save()

        # Serialize and return the newly created appointment
        serializer = self.get_serializer(appointment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

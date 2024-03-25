from rest_framework import status, viewsets
from rest_framework.response import Response
from .models import Appointment
from .serializers import AppointmentSerializer
from conversation.models import Conversation
from rest_framework import permissions
from datetime import timedelta, time
from django.utils import timezone
import pytz
from dateutil.parser import parse
from django.contrib.auth.models import AnonymousUser


# Get the User model
from django.contrib.auth import get_user_model
User = get_user_model()

# Define the AppointmentViewSet class
class AppointmentViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing appointment instances.
    """
    # Specify serializer class, queryset, and permissions
    serializer_class = AppointmentSerializer
    queryset = Appointment.objects.all()
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """
        Restricts the returned appointments to those associated with the given user,
        either as a patient or as a doctor.
        """
        
        queryset = super().get_queryset()
        user = self.request.user
                
        # Check if the user has a doctor profile
        if hasattr(user, 'doctor_profile'):
            # User is a doctor, return appointments for this doctor
            queryset = queryset.filter(doctor=user)
        else:
            # Return appointments for this patient
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
            # Check if the user is a patient
            if(request.user.account_type != 'patient'):
                return Response({'error': 'User is not a patient'}, status=status.HTTP_400_BAD_REQUEST)
            
        except User.DoesNotExist:
            return Response({'error': 'Doctor not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Check if an appointment already exists at the specified time for the doctor
        if Appointment.objects.filter(datetime_utc=datetime_aware, doctor=doctor).exists():
            return Response({'error': 'An appointment at this time already exists.'}, status=status.HTTP_400_BAD_REQUEST)

        # Create a conversation between patient and doctor
        conversation = Conversation.objects.create(
            patient=request.user,
            doctor=doctor,
        )

        # Create appointment instance
        appointment = Appointment(
            patient=request.user,
            doctor=doctor,
            date=datetime_aware.date(),
            time=datetime_aware.time(),
            datetime_utc = datetime_aware,
            conversation = conversation,
            purpose=purpose
        )
        appointment.save()
        
        # Serialize and return the newly created appointment
        serializer = self.get_serializer(appointment)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

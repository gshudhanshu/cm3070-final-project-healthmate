from rest_framework import viewsets
from .models import Appointment
from .serializers import AppointmentSerializer
from rest_framework.permissions import IsAuthenticated
from datetime import timedelta, time
from django.utils import timezone
import pytz



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

    # def perform_create(self, serializer):
    #     """
    #     Set the patient to the current user and validate appointment time.
    #     """
    #     patient = self.request.user
    #     doctor_username = self.request.data.get('doctor')
    #     appointment_time = serializer.validated_data.get('time')
    #     appointment_date = serializer.validated_data.get('date')

    #     # Get doctor object
    #     doctor = get_object_or_404(Doctor, pk=doctor_id)

    #     # Ensure the appointment time is within the doctor's working hours
    #     # and adjust for the doctor's timezone if necessary
    #     now = timezone.now()
    #     if appointment_time < now:
    #         # Prevent booking in the past
    #         raise ValidationError('Cannot book an appointment in the past.')

    #     # Example: Ensure the appointment is within the next 30 days
    #     if appointment_time > now + timedelta(days=30):
    #         raise ValidationError('Can only book appointments within the next 30 days.')

    #     # Adjust appointment time to doctor's timezone if different from UTC
    #     # appointment_time = appointment_time.astimezone(timezone.get_default_timezone())

    #     serializer.save(patient=patient, doctor=doctor)

    # @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    # def book(self, request, pk=None):
    #     """
    #     Custom action to book an appointment.
    #     """
    #     appointment = self.get_object()
    #     # Implement booking logic here
    #     # For example, update the appointment status to 'booked'
    #     appointment.status = 'booked'
    #     appointment.save()
    #     return Response({'status': 'Appointment booked'}, status=status.HTTP_200_OK)

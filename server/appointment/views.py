from rest_framework import viewsets
from .models import Appointment
from .serializers import AppointmentSerializer
from rest_framework.permissions import IsAuthenticated
from datetime import timedelta, time
from django.utils import timezone



class AppointmentViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing appointment instances.
    """
    serializer_class = AppointmentSerializer
    queryset = Appointment.objects.all()
    permission_classes = [IsAuthenticated]


    def get_today_appointments_slots(self):
        today = timezone.now().date()
        start_time = time(8, 0)  # 8 AM
        end_time = time(20, 0)  # 8 PM

        # Generate all 1-hour slots for today
        all_slots = [time(hour, 0) for hour in range(start_time.hour, end_time.hour)]

        # Retrieve today's appointments from the database
        today_appointments = self.queryset.filter(date=today)

        # Extract times of today's appointments
        booked_slots = [appointment.time for appointment in today_appointments]

        # Determine booked and unbooked slots
        booked_slots_str = [slot.strftime('%H:%M') for slot in booked_slots]
        all_slots_str = [slot.strftime('%H:%M') for slot in all_slots]
        unbooked_slots_str = list(set(all_slots_str) - set(booked_slots_str))

        # Convert back to time objects if necessary, or directly return the string representation
        unbooked_slots = [time(int(slot.split(':')[0]), int(slot.split(':')[1])) for slot in unbooked_slots_str]

        return {
            'booked_slots': booked_slots_str,
            'unbooked_slots': unbooked_slots_str,
            'all_slots_full': len(unbooked_slots) == 0
        }

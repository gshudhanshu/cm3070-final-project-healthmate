# from rest_framework import generics
# from .models import Appointment
# from .serializers import AppointmentSerializer

# class AppointmentListCreateView(generics.ListCreateAPIView):
#     queryset = Appointment.objects.all()
#     serializer_class = AppointmentSerializer

#     def perform_create(self, serializer):
#         # Add custom creation logic here if needed
#         serializer.save(patient=self.request.user)

# class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Appointment.objects.all()
#     serializer_class = AppointmentSerializer


from rest_framework import viewsets
from .models import Appointment
from .serializers import AppointmentSerializer
from rest_framework.permissions import IsAuthenticated

class AppointmentViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing appointment instances.
    """
    serializer_class = AppointmentSerializer
    queryset = Appointment.objects.all()
    permission_classes = [IsAuthenticated]

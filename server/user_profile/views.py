from rest_framework import viewsets
from .models import Doctor, Patient, Review
from .serializers import DoctorSerializer, PatientSerializer, ReviewSerializer
from .permissions import IsOwnerOrReadOnly, IsDoctorOrReadOnly, IsReadOnlyOrIsNew
from rest_framework import permissions

from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination


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

class ReviewPagination(PageNumberPagination):
    page_size = 5

class DoctorReviewsAPIView(ListAPIView):
    serializer_class = ReviewSerializer
    pagination_class = ReviewPagination
    permission_classes = [IsReadOnlyOrIsNew]

    def get_queryset(self):
        username = self.kwargs['username']
        try:
            doctor = Doctor.objects.get(user__username=username)
            return Review.objects.filter(doctor=doctor).order_by('-date_created')
        except Doctor.DoesNotExist:
            return Review.objects.none()  # Return an empty queryset


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

from rest_framework import viewsets
from django_filters import rest_framework as filters
from .models import Doctor, Patient, Review
from .serializers import DoctorSerializer, PatientSerializer, ReviewSerializer
from .permissions import IsOwnerOrReadOnly, IsDoctorOrReadOnly, IsReadOnlyOrIsNew
from .filters import DoctorFilter
from rest_framework import permissions

from rest_framework.generics import ListAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class DoctorPagination(PageNumberPagination):
    page_size = 1
    
    def get_paginated_response(self, data):
        next_page = self.page.number + 1 if self.page.has_next() else None
        previous_page = self.page.number - 1 if self.page.has_previous() else None

        return Response({
            'next_page': next_page,
            'current_page': self.page.number,
            'previous_page': previous_page,
            'count': self.page.paginator.count,
            'results': data
        })


class DoctorViewSet(viewsets.ModelViewSet, filters.FilterSet):
    """
    A viewset for viewing and editing doctor instances.
    """
    serializer_class = DoctorSerializer
    pagination_class = DoctorPagination
    permission_classes = [IsOwnerOrReadOnly]
    lookup_field = 'user__username'
    queryset = Doctor.objects.all()
    filter_backends = (filters.DjangoFilterBackend,)
    filterset_class = DoctorFilter
    
    def get_queryset(self):
        """
        This view should return a list of all records for
        any user but only allow updating their own profile.
        """
        
        query_params = self.request.query_params
        print(f"Query Params: {query_params}")

        
        queryset = Doctor.objects.all()
        user = self.request.user
        if user.is_authenticated and self.lookup_field == user.username and hasattr(user, 'doctor_profile'):
            queryset = queryset.filter(user=user)
        return queryset

class ReviewPagination(PageNumberPagination):
    page_size = 10

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

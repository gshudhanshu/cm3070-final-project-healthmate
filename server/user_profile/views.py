from django.forms import ValidationError
from django.shortcuts import get_object_or_404
from rest_framework import viewsets
from django_filters import rest_framework as filters

from conversation.models import Conversation
from .models import Doctor, Patient, Review
from .serializers import DoctorSerializer, PatientSerializer, ReviewSerializer
from .permissions import IsOwnerOrReadOnly, IsDoctorOrReadOnly, IsReadOnlyOrIsNew
from .filters import DoctorFilter
from rest_framework import permissions, status, mixins 
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from drf_nested_forms.parsers import NestedMultiPartParser, NestedJSONParser


from rest_framework.generics import ListAPIView, ListCreateAPIView
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response




class DoctorPagination(PageNumberPagination):
    page_size = 10
    
    def get_paginated_response(self, data):
        next_page = self.page.number + 1 if self.page.has_next() else None
        previous_page = self.page.number - 1 if self.page.has_previous() else None

        return Response({
            'next_page': next_page,
            'current_page': self.page.number,
            'previous_page': previous_page,
            'total_pages': self.page.paginator.num_pages,
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
    # parser_classes = (MultiPartParser, FormParser, JSONParser)
    parser_classes = (NestedMultiPartParser, FormParser)

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
    
    def get_serializer_context(self):
        """
        Extra context provided to the serializer class.
        """
        return {'request': self.request, 'format': self.format_kwarg, 'view': self}

    


class ReviewPagination(PageNumberPagination):
    page_size = 10

class DoctorReviewsAPIView(ListCreateAPIView):

    serializer_class = ReviewSerializer
    pagination_class = ReviewPagination
    permission_classes = [IsReadOnlyOrIsNew]
    # permissions_classes = [IsAuthenticated]

    def get_queryset(self):
        username = self.kwargs['username']
        try:
            doctor = Doctor.objects.get(user__username=username)
            return Review.objects.filter(doctor=doctor).order_by('-date_created')
        except Doctor.DoesNotExist:
            return Review.objects.none() 
        
class ReviewViewSet(mixins.CreateModelMixin,
                    mixins.RetrieveModelMixin,
                    viewsets.GenericViewSet):
    """
    A viewset that provides 'retrieve' and 'create' actions.
    """
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]

    def retrieve(self, request, *args, **kwargs):
        """
        Retrieve a single review.
        """
        conversation_id = kwargs.get('pk')
        review = get_object_or_404(Review, conversation_id=conversation_id)
        serializer = self.get_serializer(review)
        return Response(serializer.data)

    # def perform_create(self, serializer):
    #     serializer.save()

    # def perform_create(self, serializer):
    #     patient = get_object_or_404(Patient, user=self.request.user)
    #     conversation_id = serializer.validated_data.get('conversation_id')
    #     conversation = get_object_or_404(Conversation, id=conversation_id)

    #     # Attempt to retrieve an existing review for the conversation
    #     review, created = Review.objects.update_or_create(
    #         conversation=conversation,
    #         patient=patient,
    #         defaults=serializer.validated_data
    #     )

    #     if created:
    #         # If a new review was created, set the HTTP status code to 201 (Created)
    #         self.request.method = 'POST'
    #         self.request.status_code = status.HTTP_201_CREATED
    #     else:
    #         # If an existing review was updated, set the HTTP status code to 200 (OK)
    #         self.request.method = 'PATCH'  # or 'PUT', depending on your use case
    #         self.request.status_code = status.HTTP_200_OK
    
    def create(self, request, *args, **kwargs):
        # Use the existing serializer to validate the request data
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Custom logic to either create or update
        patient = get_object_or_404(Patient, user=self.request.user)
        conversation_id = serializer.validated_data['conversation_id']
        conversation = get_object_or_404(Conversation, id=conversation_id)
        doctor = Doctor.objects.get(user=conversation.doctor)
        
        review, created = Review.objects.update_or_create(
            conversation=conversation, 
            patient=patient,
            defaults={'doctor': doctor, **serializer.validated_data}
        )
        
        # Serialize the review instance to return full data
        review_serializer = self.get_serializer(review)
        headers = self.get_success_headers(review_serializer.data)
        
        return Response(review_serializer.data, status=status.HTTP_201_CREATED if created else status.HTTP_200_OK, headers=headers)

    def perform_create(self, serializer):
        # This method is overridden by the create method above
        pass



class PatientViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing patient instances.
    """
    serializer_class = PatientSerializer
    permission_classes = [IsOwnerOrReadOnly,IsDoctorOrReadOnly]
    lookup_field = 'user__username'
    # parser_classes = (MultiPartParser, FormParser, JSONParser)
    parser_classes = (NestedMultiPartParser, FormParser)


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
    
    def update (self, request, *args, **kwargs):
        print(request.data)
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

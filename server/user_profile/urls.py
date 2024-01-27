from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DoctorViewSet, PatientViewSet, DoctorReviewsAPIView

router = DefaultRouter()
router.register(r'doctors', DoctorViewSet, basename='doctor')
router.register(r'patients', PatientViewSet, basename='patient')

urlpatterns = [
    path('', include(router.urls)),
    path('doctors/<str:username>/reviews/', DoctorReviewsAPIView.as_view(), name='doctor-reviews'),
    
]

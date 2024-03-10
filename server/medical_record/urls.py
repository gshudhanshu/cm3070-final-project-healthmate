from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import MedicalRecordViewSet

# router = DefaultRouter()
# router.register(r'', MedicalRecordViewSet, basename='medical_record')

urlpatterns = [
    # path('', include(router.urls)),
    path('', MedicalRecordViewSet.as_view({'get':'retrieve', 'post':'create'}))
]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (MedicalRecordViewSet, DisorderViewSet, MedicineViewSet, 
                    DiagnosisViewSet, AppointmentHistoryViewSet)

router = DefaultRouter()
router.register(r'medical_record', MedicalRecordViewSet)
router.register(r'disorders', DisorderViewSet)
router.register(r'medicines', MedicineViewSet)
router.register(r'diagnoses', DiagnosisViewSet)
router.register(r'appointment_histories', AppointmentHistoryViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

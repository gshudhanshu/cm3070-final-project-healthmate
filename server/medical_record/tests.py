from django.test import TestCase
from django.contrib.auth import get_user_model
from user_profile.models import Patient
from .models import MedicalRecord, Disorder, Medicine, Diagnosis
from datetime import date
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

User = get_user_model()

class MedicalRecordTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Assuming you have a custom user model with a username field
        self.patient_user  = User.objects.create_user(username="patient", email='patient@example.com', password="testpass123", account_type="patient")
        self.doctor_user  = User.objects.create_user(username="doctor", email='doctor@example.com',password="testpass123", account_type="doctor")
        
        self.medical_record = MedicalRecord.objects.create(patient=Patient.objects.get(user=self.patient_user))
        self.disorder = Disorder.objects.create(
            medical_record=self.medical_record, name="Test Disorder", details="Some details", first_noticed=date.today())
        self.medicine = Medicine.objects.create(
            medical_record=self.medical_record, name="Test Medicine", dosage="Twice daily", start_date=date.today())
        self.diagnosis = Diagnosis.objects.create(
            medical_record=self.medical_record, name="Test Diagnosis", details="Diagnosis details", date=date.today())

        self.client.force_authenticate(user=self.doctor_user)
        
        
    def test_model_relationships(self):
        self.assertEqual(self.medical_record.disorders.count(), 1)
        self.assertEqual(self.medical_record.medicines.count(), 1)
        self.assertEqual(self.medical_record.diagnosis.count(), 1)


    def test_medical_record_creation(self):
        url = reverse('medicalrecord')  # Adjust based on your actual URL name
        data = {
            # "patient": self.patient_user.id,
            "patient_id": self.patient_user.id,
            "disorders": [{"name": "Another Disorder", "details": "Detailed info", "first_noticed": "2020-01-01"}],
            "medicines": [{"name": "Another Medicine", "dosage": "Once daily", "start_date": "2020-01-02"}],
        }
        
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(MedicalRecord.objects.count(), 1) 

    def test_medical_record_retrieval(self):
        url = reverse('medicalrecord')
        response = self.client.get(url, data={"username": self.patient_user.username})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
from django.test import TestCase
from django.contrib.auth import get_user_model
from user_profile.models import Patient
from .models import MedicalRecord, Disorder, Medicine, Diagnosis
from datetime import date
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse

# Get the User model
User = get_user_model()

class MedicalRecordTests(TestCase):
    """
    Test case for the MedicalRecord model and related functionalities.
    """    
    def setUp(self):
        """
        Setting up initial data for tests.
        """        
        self.client = APIClient()
        # Creating user instances
        self.patient_user  = User.objects.create_user(username="patient", email='patient@example.com', password="testpass123", account_type="patient")
        self.doctor_user  = User.objects.create_user(username="doctor", email='doctor@example.com',password="testpass123", account_type="doctor")
        
        # Creating a medical record instance
        self.medical_record = MedicalRecord.objects.create(patient=Patient.objects.get(user=self.patient_user))
        
        # Creating disorder, medicine, and diagnosis instances associated with the medical record        
        self.disorder = Disorder.objects.create(
            medical_record=self.medical_record, name="Test Disorder", details="Some details", first_noticed=date.today())
        self.medicine = Medicine.objects.create(
            medical_record=self.medical_record, name="Test Medicine", dosage="Twice daily", start_date=date.today())
        self.diagnosis = Diagnosis.objects.create(
            medical_record=self.medical_record, name="Test Diagnosis", details="Diagnosis details", date=date.today())

        self.client.force_authenticate(user=self.doctor_user)
        
        
    def test_model_relationships(self):
        """
        Test the relationships between MedicalRecord and related models.
        """        
        self.assertEqual(self.medical_record.disorders.count(), 1)
        self.assertEqual(self.medical_record.medicines.count(), 1)
        self.assertEqual(self.medical_record.diagnosis.count(), 1)


    def test_medical_record_creation(self):
        """
        Test the creation of a new medical record instance.
        """        
        url = reverse('medicalrecord')
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
        """
        Test retrieval of medical records.
        """        
        url = reverse('medicalrecord')
        response = self.client.get(url, data={"username": self.patient_user.username})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
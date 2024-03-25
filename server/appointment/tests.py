from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Appointment, Conversation
from datetime import datetime
import pytz
from user_profile.models import Doctor


User = get_user_model()

# Define test cases for AppointmentViewSet
class AppointmentViewSetTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        # Create patient and doctor users with their account types
        self.patient_user = User.objects.create_user(username='patient', email='patient@example.com', password='testpass123', account_type='patient')
        self.doctor_user = User.objects.create_user(username='doctor', email='doctor@example.com', password='testpass123', account_type='doctor')
        
        # Create a conversation between the patient and doctor
        self.conversation = Conversation.objects.create(patient=self.patient_user, doctor=self.doctor_user)
        # Create an appointment for the patient with the doctor
        self.appointment = Appointment.objects.create(
            patient=self.patient_user,
            doctor=self.doctor_user,
            date=datetime.now().date(),
            time=datetime.now().time(),
            datetime_utc=datetime.now(pytz.utc),
            conversation=self.conversation,
            purpose='Checkup'
        )
        # Authenticate the client with the patient user
        self.client.force_authenticate(user=self.patient_user)

    # Test case to list appointments for a patient
    def test_list_appointments_for_patient(self):
        # Reverse the URL for listing appointments
        url = reverse('appointment-list') 
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check if only one appointment exists for this patient
        self.assertEqual(len(response.data), 1) 

    # Test case to create a new appointment
    def test_create_appointment(self):
        # Reverse the URL for creating appointments
        url = reverse('appointment-list')
        data = {
            'doctor': self.doctor_user.username,
            'datetime_utc': datetime.now(pytz.utc).isoformat(),
            'purpose': 'New Checkup'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Appointment.objects.count(), 2)
        self.assertEqual(response.data['purpose'], 'New Checkup')

    # Test case to retrieve appointment details
    def test_retrieve_appointment_detail(self):
         # Reverse the URL for retrieving appointment details
        url = reverse('appointment-detail', kwargs={'pk': self.appointment.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['purpose'], self.appointment.purpose)
        
        
from rest_framework.test import APITestCase
from .serializers import AppointmentSerializer

# Define test cases for AppointmentSerializer
class AppointmentSerializerTestCase(APITestCase):
    def setUp(self):
        # Create patient and doctor users without account types
        self.patient_user = User.objects.create_user(username='patient', email='patient@example.com', password='testpass123')
        # Set account types for the users
        self.patient_user.account_type = 'patient'
        self.doctor_user = User.objects.create_user(username='doctor', email='doctor@example.com', password='testpass123')
        self.doctor_user.account_type = 'doctor'
        # Create a doctor profile and a conversation
        self.doctor_profile = Doctor.objects.create(user=self.doctor_user)
        self.conversation = Conversation.objects.create(patient=self.patient_user, doctor=self.doctor_user)
        # Create an appointment for the patient with the doctor
        self.appointment = Appointment.objects.create(
            patient=self.patient_user,
            doctor=self.doctor_user,
            date=datetime.now().date(),
            time=datetime.now().time(),
            datetime_utc=datetime.now(pytz.utc),
            conversation=self.conversation,
            purpose='Checkup'
        )
    # Test case to serialize appointment data
    def test_serialize_appointment(self):
        serializer = AppointmentSerializer(instance=self.appointment)
        data = serializer.data
        self.assertEqual(data['purpose'], 'Checkup')
        self.assertTrue('patient' in data)
        self.assertTrue('doctor' in data)
        self.assertTrue('conversation' in data)
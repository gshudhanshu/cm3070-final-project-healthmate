from django.urls import reverse
from rest_framework.test import APITestCase, APIClient
from rest_framework import status
from django.contrib.auth import get_user_model
from .models import Appointment, Conversation
from datetime import datetime
import pytz
from user_profile.models import Doctor


User = get_user_model()

class AppointmentViewSetTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()
        # Adjust user creation to include the account type
        self.patient_user = User.objects.create_user(username='patient', email='patient@example.com', password='testpass123', account_type='patient')
        # Ensure the doctor_user has the 'doctor' account type
        self.doctor_user = User.objects.create_user(username='doctor', email='doctor@example.com', password='testpass123', account_type='doctor')
        
        # The rest of your setup code remains the same...
        self.conversation = Conversation.objects.create(patient=self.patient_user, doctor=self.doctor_user)
        self.appointment = Appointment.objects.create(
            patient=self.patient_user,
            doctor=self.doctor_user,
            date=datetime.now().date(),
            time=datetime.now().time(),
            datetime_utc=datetime.now(pytz.utc),
            conversation=self.conversation,
            purpose='Checkup'
        )
        self.client.force_authenticate(user=self.patient_user)

    def test_list_appointments_for_patient(self):
        url = reverse('appointment-list')  # Adjust based on your actual URL name
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Assuming only one appointment exists for this patient

    def test_create_appointment(self):
        url = reverse('appointment-list')  # Adjust based on your actual URL name
        data = {
            'doctor': self.doctor_user.username,
            'datetime_utc': datetime.now(pytz.utc).isoformat(),
            'purpose': 'New Checkup'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Appointment.objects.count(), 2)  # Assuming the initial appointment plus the new one
        self.assertEqual(response.data['purpose'], 'New Checkup')

    def test_retrieve_appointment_detail(self):
        url = reverse('appointment-detail', kwargs={'pk': self.appointment.pk})  # Adjust based on your actual URL name
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['purpose'], self.appointment.purpose)
        
        
from rest_framework.test import APITestCase
from .serializers import AppointmentSerializer

class AppointmentSerializerTestCase(APITestCase):
    def setUp(self):
        self.patient_user = User.objects.create_user(username='patient', email='patient@example.com', password='testpass123')
        self.patient_user.account_type = 'patient'
        self.doctor_user = User.objects.create_user(username='doctor', email='doctor@example.com', password='testpass123')
        self.doctor_user.account_type = 'doctor'
        
        self.doctor_profile = Doctor.objects.create(user=self.doctor_user)
        self.conversation = Conversation.objects.create(patient=self.patient_user, doctor=self.doctor_user)

        self.appointment = Appointment.objects.create(
            patient=self.patient_user,
            doctor=self.doctor_user,
            date=datetime.now().date(),
            time=datetime.now().time(),
            datetime_utc=datetime.now(pytz.utc),
            conversation=self.conversation,
            purpose='Checkup'
        )

    def test_serialize_appointment(self):
        serializer = AppointmentSerializer(instance=self.appointment)
        data = serializer.data
        self.assertEqual(data['purpose'], 'Checkup')
        self.assertTrue('patient' in data)
        self.assertTrue('doctor' in data)
        self.assertTrue('conversation' in data)        
from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from .models import Notification
from datetime import datetime

User = get_user_model()

class NotificationTestCase(TestCase):
    def setUp(self):
        """
        Setting up initial data for testing Notification model and views.
        """    
        self.client = APIClient()
        self.patient_user  = User.objects.create_user(username="patient", email='patient@example.com', password="testpass123", account_type="patient")
        self.doctor_user  = User.objects.create_user(username="doctor", email='doctor@example.com',password="testpass123", account_type="doctor")
        
        self.notification1 = Notification.objects.create(
            recipient=self.patient_user,
            sender=self.doctor_user,
            notification_type='message',
            text='Hi there!'
        )
        
        self.notification2 = Notification.objects.create(
            recipient=self.patient_user,
            notification_type='alert',
            text='System alert!'
        )
        
        self.client.force_authenticate(user=self.patient_user)


    def test_notification_creation(self):
        """
        Test case to ensure notifications are created correctly.
        """        
        self.assertEqual(Notification.objects.count(), 2)
        self.assertFalse(self.notification1.is_read)
        self.assertEqual(str(self.notification1), "Notification for patient - Hi there!")

    def test_notification_list(self):
        """
        Test case to ensure notifications are listed correctly.
        """        
        url = reverse('notification-list')
        response = self.client.get(url) 
        # response = self.client.get('/api/notifications/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        
    def test_notification_mark_as_read(self):
        """
        Test case to ensure notifications can be marked as read.
        """
        
        url = reverse('notification-mark-all-as-read')
        response = self.client.patch(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(Notification.objects.filter(is_read=False).count(), 0)
        
    def test_unauthorized_access(self):
        """
        Test case to ensure unauthorized access to notifications is restricted.
        """        
        self.client.force_authenticate(user=self.doctor_user)  
        response = self.client.get('/notifications/')
        self.assertEqual(response.status_code, 404)
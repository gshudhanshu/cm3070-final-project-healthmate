from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
User = get_user_model()
from .models import Doctor, Address, Speciality
from rest_framework.test import APIClient

class DoctorViewSetTestCase(APITestCase):
    """
    Test case for DoctorViewSet.
    """

    def setUp(self):
        """
        Set up test data.
        """        
        # Create test users and doctor profiles
        self.user1 = User.objects.create_user(username='doctor1', email='u1@email.com', password='testpass123')
        self.user2 = User.objects.create_user(username='doctor2', email='u2@email.com', password='testpass123')
        # Create a speciality, address, and doctor profiles
        self.speciality = Speciality.objects.create(name="Cardiology")
        self.address = Address.objects.create(street="123 Main St", city="Anytown", state="Anystate", postal_code="12345", country="USA")
        
        self.doctor1 = Doctor.objects.create(user=self.user1, hospital_address=self.address)
        self.doctor1.specialties.add(self.speciality)
        
        self.doctor2 = Doctor.objects.create(user=self.user2, hospital_address=self.address)
        self.doctor2.specialties.add(self.speciality)
        self.client = APIClient()

    def test_doctor_list_pagination(self):
        """
        Test pagination of doctor list.
        """
        #  URL for doctor list
        url = reverse('doctor-list')  
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check pagination
        self.assertIn('next_page', response.data)
        self.assertIn('previous_page', response.data)
        self.assertIn('results', response.data)
        self.assertEqual(len(response.data['results']), 2) 

    def test_doctor_retrieve(self):
        """
        Test retrieval of doctor detail.
        """
        #  URL for doctor detail
        url = reverse('doctor-detail', kwargs={'user__username': self.user1.username}) 
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['username'], self.user1.username)


class DoctorReviewsAPIViewTestCase(APITestCase):
    """
    Test case for DoctorReviewsAPIView.
    """    
    def setUp(self):
        """
        Set up test data.
        """        
        # Create test users and doctor profiles
        self.user1 = User.objects.create_user(username='doctor1', email='u1@email.com', password='testpass123')
        self.user2 = User.objects.create_user(username='doctor2', email='u2@email.com', password='testpass123')
        
        self.speciality = Speciality.objects.create(name="Cardiology")
        self.address = Address.objects.create(street="123 Main St", city="Anytown", state="Anystate", postal_code="12345", country="USA")
        
        self.doctor1 = Doctor.objects.create(user=self.user1, hospital_address=self.address)
        self.doctor1.specialties.add(self.speciality)
        
        self.doctor2 = Doctor.objects.create(user=self.user2, hospital_address=self.address)
        self.doctor2.specialties.add(self.speciality)

    def test_reviews_for_doctor(self):
        """
        Test retrieval of reviews for a doctor.
        """        
        doctor_username = self.doctor1.user.username
        url = reverse('doctor-reviews', kwargs={'username': doctor_username})  
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

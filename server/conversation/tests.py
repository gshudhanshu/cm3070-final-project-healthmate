from django.forms import ValidationError
from rest_framework.test import APIClient, APITestCase
from django.urls import reverse
from rest_framework import status
from .models import Attachment, Call, Conversation, Message
from django.core.files.uploadedfile import SimpleUploadedFile

from django.contrib.auth import get_user_model
User = get_user_model()


class ConversationViewSetTests(APITestCase):

    def setUp(self):
        self.client = APIClient()
        self.patient_user  = User.objects.create_user(username="patient", email='patient@example.com', password="testpass123", account_type="patient")
        self.doctor_user  = User.objects.create_user(username="doctor", email='doctor@example.com',password="testpass123", account_type="doctor")
        self.conversation = Conversation.objects.create(patient=self.patient_user, doctor=self.doctor_user)


    def test_unauthorized_access(self):
        response = self.client.get(reverse('conversation-list'))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_authorized_access(self):
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(reverse('conversation-list'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Ensure the user can only see their conversation
        
    def test_conversation_validation(self):
        with self.assertRaises(ValidationError):
            Conversation.objects.create(patient=self.doctor_user, doctor=self.patient_user).clean()
            
    def test_message_creation_and_retrieval(self):
        mess = Message.objects.create(conversation=self.conversation, sender=self.patient_user, text="Hello")
        self.assertEqual(self.conversation.messages.count(), 1)
        
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.get(reverse('conversation-detail', args=[self.conversation.id]))        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
   
        
    def test_call_creation_and_update(self):
        call = Call.objects.create(conversation=self.conversation, caller=self.patient_user, receiver=self.doctor_user, call_type='audio')
        self.assertEqual(call.call_status, 'initiated')
        
        call.call_status = 'completed'
        call.save()
        self.assertEqual(Call.objects.get(id=call.id).call_status, 'completed')


    def test_attachment_upload(self):
        message = Message.objects.create(conversation=self.conversation, sender=self.patient_user, text="Hi there")
        file_upload = SimpleUploadedFile("file.txt", b"hello world", content_type="text/plain")
        
        self.client.force_authenticate(user=self.patient_user)
        response = self.client.post(reverse('conversation-attachment'), {'file': file_upload, 'message': message.id}, format='multipart')
        
        print(response.data)
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Attachment.objects.count(), 1)



    def tearDown(self):
        self.patient_user.delete()
        self.doctor_user.delete()

from django.db import models
from django.contrib.auth import get_user_model
from conversation.models import Conversation
User = get_user_model()

# Create your models here.
class Appointment(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor_appointments')
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient_appointments')
    conversation = models.ForeignKey(Conversation, related_name='appointments', on_delete=models.SET_NULL, blank=True, null=True)
    date = models.DateField()
    time = models.TimeField()
    datetime_utc = models.DateTimeField(blank=True, null=True)
    purpose = models.TextField(blank=True, null=True)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)
    
    def __str__(self):
        return f"{self.patient}'s appointment with {self.doctor} on {self.date} at {self.time}"
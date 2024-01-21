from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

# Create your models here.
class Appointment(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor_appointments')
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient_appointments')
    date = models.DateField()
    time = models.TimeField()
    purpose = models.TextField(blank=True, null=True)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)
    
    def __str__(self):
        return f"{self.patient}'s appointment with {self.doctor} on {self.date} at {self.time}"
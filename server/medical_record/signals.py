from django.db.models.signals import post_save
from django.dispatch import receiver
from user_profile.models import Patient
from .models import MedicalRecord

@receiver(post_save, sender=Patient)
def create_medical_record(sender, instance, created, **kwargs):
    if created:
        MedicalRecord.objects.create(patient=instance)


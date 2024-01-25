from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Doctor, Patient

User = get_user_model()

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    print(instance.account_type)
    if created:
        if instance.account_type == 'doctor':
            Doctor.objects.create(user=instance)
        elif instance.account_type == 'patient':
            Patient.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if hasattr(instance, 'doctor_profile'):
        instance.doctor_profile.save()
    elif hasattr(instance, 'patient_profile'):
        instance.patient_profile.save()

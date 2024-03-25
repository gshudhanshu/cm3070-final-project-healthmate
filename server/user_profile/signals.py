from django.db.models.signals import post_save
from django.dispatch import receiver
from django.contrib.auth import get_user_model
from .models import Doctor, Patient

User = get_user_model()

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    """
    Signal receiver function to create a profile for a new user.
    """
    if created:
        if instance.account_type == 'doctor':
            Doctor.objects.create(user=instance)
        elif instance.account_type == 'patient':
            Patient.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    """
    Signal receiver function to save the profile of a user after it's been updated.
    """    
    if hasattr(instance, 'doctor_profile'):
        instance.doctor_profile.save()
    elif hasattr(instance, 'patient_profile'):
        instance.patient_profile.save()

from django.db.models.signals import post_save
from django.dispatch import receiver
from conversation.models import Message, Call
from appointment.models import Appointment
from .models import Notification

@receiver(post_save, sender=Message)
def create_message_notification(sender, instance, created, **kwargs):
    """
    Signal to create a notification when a new message is created.
    """    
    conversation = instance.conversation
    # Determine the recipient based on the conversation    
    if instance.sender == conversation.patient:
        recipient = conversation.doctor
    else:
        recipient = conversation.patient
    if created:  # Only create a notification for new messages
        Notification.objects.create(
            recipient=recipient,
            sender=instance.sender,
            notification_type='message',
            text=f'New message from {instance.sender.username}'
        )


@receiver(post_save, sender=Call)
def create_call_notification(sender, instance, created, **kwargs):
    """
    Signal to create a notification when a new call is created.
    """    
    if created:
        Notification.objects.create(
            recipient=instance.receiver,
            sender=instance.caller,
            notification_type='call',
            text=f'New call from {instance.caller.first_name} {instance.caller.last_name}'
        )
        

@receiver(post_save, sender=Appointment)
def create_appointment_notification(sender, instance, created, **kwargs):
    """
    Signal to create a notification when a new appointment is created.
    """
    if created:
        Notification.objects.create(
            recipient=instance.doctor,
            sender=instance.patient,
            notification_type='appointment',
            text=f'New appointment from {instance.patient.first_name} {instance.patient.last_name}'
        )
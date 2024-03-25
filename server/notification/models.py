from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Notification(models.Model):
    """
    Model to represent notifications for users.
    """
    
    # Types of notifications
    NOTIFICATION_TYPES = (
        ('message', 'Message'),
        ('call', 'Call'),
        ('appointment', 'Appointment'),
        ('alert', 'Alert'),
    )

    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_notifications', null=True, blank=True)
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    text = models.TextField() 
    is_read = models.BooleanField(default=False) 
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        """
        String representation of the notification.
        """        
        return f"Notification for {self.recipient.username} - {self.text[:20]}"

    class Meta:
        """
        Meta options for the Notification model.
        """        
        ordering = ['-created_at']  # Newest notifications first

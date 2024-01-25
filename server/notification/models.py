from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Notification(models.Model):
    # Types of notifications
    NOTIFICATION_TYPES = (
        ('message', 'Message'),
        ('call', 'Call'),
        ('appointment', 'Appointment'),
        ('alert', 'Alert'),
        # ... other types of notifications
    )

    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_notifications', null=True, blank=True)
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    text = models.TextField()  # The message you want to display in the notification
    is_read = models.BooleanField(default=False)  # If the notification has been read
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Notification for {self.recipient.username} - {self.text[:20]}"

    class Meta:
        ordering = ['-created_at']  # Newest notifications first

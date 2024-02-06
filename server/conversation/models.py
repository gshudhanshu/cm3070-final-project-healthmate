from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model

User = get_user_model()

class Conversation(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE,
                                related_name='doctor_conversations')
    doctor = models.ForeignKey(User, on_delete=models.CASCADE,
                               related_name='patient_conversations')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.patient}'s conversation with {self.doctor}"
    
    def clean(self):
        """
        Custom validation to ensure patient is a user with account_type 'patient'
        and doctor is a user with account_type 'doctor'.
        """
        if self.patient and self.patient.account_type != 'patient':
            raise ValidationError("The patient must be a user with account type 'patient'.")
        if self.doctor and self.doctor.account_type != 'doctor':
            raise ValidationError("The doctor must be a user with account type 'doctor'.")
        
    def save(self, *args, **kwargs):
        """
        Override the save method to include clean.
        """
        self.clean()
        super(Conversation, self).save(*args, **kwargs)
        


class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE,
                               related_name='sent_messages')
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Message from {self.sender} at {self.timestamp}"

class Attachment(models.Model):
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='attachments', null=True, blank=True)
    file = models.FileField(upload_to='attachments/')
    
    def __str__(self):
        return self.file.name
    
    def filename(self):
        return self.file.name.split('/')[-1]
    
    def extension(self):
        return self.file.name.split('.')[-1]
    
    def size(self):
        return self.file.size
    
    def url(self):
        return self.file.url

class Call(models.Model):
    CALL_TYPES = [
        ('video', 'Video Call'),
        ('audio', 'Audio Call'),
    ]
    
    CALL_STATUS = [
        ('initiated', 'Initiated'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('missed', 'Missed'),
        ('rejected', 'Rejected')
    ]

    conversation = models.ForeignKey(Conversation, related_name='calls', on_delete=models.CASCADE)
    caller = models.ForeignKey(User, related_name='calls_made', on_delete=models.CASCADE)
    receiver= models.ForeignKey(User, related_name='calls_received', on_delete=models.CASCADE )
    call_type = models.CharField(max_length=10, choices=CALL_TYPES, blank=True, null=True)
    call_status = models.CharField(max_length=10, choices=CALL_STATUS, default='initiated')
    start_time = models.DateTimeField(auto_now_add=True)
    end_time = models.DateTimeField(blank=True, null=True)

    def __str__(self):
        return f"{self.call_type} call between {self.caller} and {self.receiver} (Status: {self.call_status})"

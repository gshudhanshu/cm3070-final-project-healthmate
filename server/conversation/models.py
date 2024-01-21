from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Conversation(models.Model):
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='doctor_conversations')
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='patient_conversations')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"{self.patient}'s conversation with {self.doctor}"

class Message(models.Model):
    conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
    text = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return f"Message from {self.sender} at {self.timestamp}"

class Attachment(models.Model):
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='attachments')
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
        ('audio', 'Audio Call')
    ]

    conversation = models.ForeignKey(Conversation, related_name='calls', on_delete=models.CASCADE)
    caller = models.ForeignKey(User, related_name='calls_made', on_delete=models.CASCADE)
    call_type = models.CharField(max_length=10, choices=CALL_TYPES)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()

    def __str__(self):
        return f"{self.call_type.title()} with {self.conversation}"
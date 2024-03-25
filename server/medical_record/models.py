from django.db import models
from user_profile.models import Patient

class MedicalRecord(models.Model):
    """
    Model to represent a patient's medical record.
    """    
    patient = models.ForeignKey(Patient, related_name='medical_records', on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    last_updated = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"MedicalRecord for {self.patient.user.username} - {self.created_at.strftime('%Y-%m-%d')}"

class Disorder(models.Model):
    """
    Model to represent a disorder recorded in a medical record.
    """    
    medical_record = models.ForeignKey(MedicalRecord, related_name='disorders', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    details = models.TextField()
    first_noticed = models.DateField()
    
    def __str__(self):
        return self.name

class Medicine(models.Model):
    """
    Model to represent a prescribed medicine in a medical record.
    """
    
    medical_record = models.ForeignKey(MedicalRecord, related_name='medicines', on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    dosage = models.CharField(max_length=250)
    start_date = models.DateField()
    end_date = models.DateField(null=True, blank=True)  # Optional: not every medicine has a defined end date
    
    def __str__(self):
        return self.name
    
    def total_duration(self):
        """
        Calculate the total duration of the medicine.
        """        
        return (self.end_date - self.start_date).days if self.end_date else None

class Diagnosis(models.Model):
    """
    Model to represent a diagnosis recorded in a medical record.
    """    
    medical_record = models.ForeignKey(MedicalRecord, related_name='diagnosis', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    details = models.TextField()
    date = models.DateField()
    
    def __str__(self):
        return self.diagnosis
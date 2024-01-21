from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()

class Specialty(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class Qualification(models.Model):
    name = models.CharField(max_length=100)
    university = models.CharField(max_length=200)
    start_year = models.IntegerField()
    finish_year = models.IntegerField()

    def __str__(self):
        return f"{self.name} from {self.university} ({self.start_year} - {self.finish_year})"

class Language(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class LanguageProficiency(models.Model):
    PROFICIENCY_LEVELS = [
        ('native', 'Native'),
        ('fluent', 'Fluent'),
        ('conversational', 'Conversational'),
        ('basic', 'Basic'),
    ]
    level = models.CharField(max_length=20, choices=PROFICIENCY_LEVELS)
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    doctor = models.ForeignKey('Doctor', on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.language.name} ({self.get_level_display()})"

class Doctor(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='doctor_profile')
    phone = models.CharField(max_length=20)
    hospital_address = models.CharField(max_length=200)
    specialties = models.ManyToManyField(Specialty, related_name='doctors')
    qualifications = models.ManyToManyField(Qualification, related_name='doctors')
    experience = models.PositiveIntegerField()
    profile_pic = models.ImageField(upload_to='profile_pic/Doctor/', null=True, blank=True)
    languages = models.ManyToManyField(Language, through=LanguageProficiency)
    cost = models.DecimalField(max_digits=10, decimal_places=2)
    currency = models.CharField(max_length=3)

    def average_rating(self):
        total = sum(review.rating for review in self.reviews.all())
        count = self.reviews.count()
        return total / count if count > 0 else 0

    def __str__(self):
        return self.user.username

class Patient(models.Model):
    MARITAL_STATUS_CHOICES = [
        ('single', 'Single'),
        ('married', 'Married'),
        ('divorced', 'Divorced'),
        ('widowed', 'Widowed')
    ]
    GENDER_CHOICES = [
        ('male', 'Male'),
        ('female', 'Female'),
        ('other', 'Other')
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='patient_profile')
    phone = models.CharField(max_length=20)
    dob = models.DateField()
    marital_status = models.CharField(max_length=10, choices=MARITAL_STATUS_CHOICES)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES)
    height = models.DecimalField(max_digits=5, decimal_places=2)
    weight = models.DecimalField(max_digits=5, decimal_places=2)
    blood_group = models.CharField(max_length=10)
    language = models.ManyToManyField(Language, related_name='patients')
    address = models.CharField(max_length=200)
    profile_pic = models.ImageField(upload_to='profile_pic/Patient/', null=True, blank=True)

    def __str__(self):
        return self.user.username

class Review(models.Model):
    doctor = models.ForeignKey(Doctor, related_name='reviews', on_delete=models.CASCADE)
    patient = models.ForeignKey(Patient, related_name='reviews', on_delete=models.CASCADE)
    rating = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)])  # 1 to 5 rating
    comment = models.TextField()
    date_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Review by {self.patient.user.username} for {self.doctor.user.username}"

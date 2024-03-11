from django.db import models
from django.contrib.auth import get_user_model
User = get_user_model()


class Address(models.Model):
    street = models.CharField(max_length=255)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.street}, {self.city}, {self.state}, {self.postal_code}, {self.country}"


class Speciality(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name


class Language(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class DoctorLanguageProficiency(models.Model):
    PROFICIENCY_LEVELS = [
        ('native', 'Native'),
        ('fluent', 'Fluent'),
        ('conversational', 'Conversational'),
        ('basic', 'Basic'),
    ]
    level = models.CharField(max_length=20, choices=PROFICIENCY_LEVELS, default='native')
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    doctor = models.ForeignKey('Doctor', on_delete=models.CASCADE, related_name='doctor_language_proficiencies')

    def __str__(self):
        return f"{self.language.name} ({self.get_level_display()})"

class PatientLanguageProficiency(models.Model):
    PROFICIENCY_LEVELS = [
        ('native', 'Native'),
        ('fluent', 'Fluent'),
        ('conversational', 'Conversational'),
        ('basic', 'Basic'),
    ]
    level = models.CharField(max_length=20, choices=PROFICIENCY_LEVELS)
    language = models.ForeignKey(Language, on_delete=models.CASCADE)
    patient = models.ForeignKey('Patient', on_delete=models.CASCADE, related_name='patient_language_proficiencies')

    def __str__(self):
        return f"{self.language.name} ({self.get_level_display()})"


class Qualification(models.Model):
    name = models.CharField(max_length=100)
    university = models.CharField(max_length=200)

    def __str__(self):
        return f"{self.name} from {self.university}"
    

class Doctor(models.Model):
    AVAILABILITY_CHOICES = [
        ('full-time', 'Full time'),
        ('part-time', 'Part time'),
        ('weekends', 'Weekends'),
        ('evenings', 'Evenings')
    ]
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True, related_name='doctor_profile')
    phone = models.CharField(max_length=20, null=True, blank=True)
    hospital_address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, blank=True, related_name='doctors')
    specialties = models.ManyToManyField(Speciality, related_name='doctors', blank=True)
    qualifications = models.ManyToManyField(Qualification, through='DoctorQualification', related_name='doctors', blank=True)
    experience = models.PositiveIntegerField(null=True, blank=True)
    profile_pic = models.ImageField(upload_to='profile_pic/doctor/', null=True, blank=True)
    languages = models.ManyToManyField(Language, through=DoctorLanguageProficiency, related_name='doctor_language_proficiencies', blank=True)
    cost = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=3, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    availability = models.CharField(max_length=10, choices=AVAILABILITY_CHOICES, null=True, blank=True)

    def average_rating(self):
        total = sum(review.rating for review in self.reviews.all())
        count = self.reviews.count()
        return total / count if count > 0 else 0

    def __str__(self):
        return self.user.username
    
    
class DoctorQualification(models.Model):
    doctor = models.ForeignKey(Doctor, on_delete=models.CASCADE, related_name='doctor_qualifications')
    qualification = models.ForeignKey(Qualification, on_delete=models.CASCADE, related_name='doctor_entries')
    start_year = models.IntegerField(null = True, blank = True)
    finish_year = models.IntegerField(null = True, blank = True)

    def __str__(self):
        return f"{self.qualification} - {self.start_year} to {self.finish_year}"
    

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
    phone = models.CharField(max_length=20, null=True, blank=True)
    dob = models.DateField(null=True, blank=True)
    marital_status = models.CharField(max_length=10, choices=MARITAL_STATUS_CHOICES, null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, null=True, blank=True)
    height = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    weight = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    blood_group = models.CharField(max_length=10, null=True, blank=True)
    languages = models.ManyToManyField(Language, through=PatientLanguageProficiency, related_name='patient_language_proficiencies', blank=True)
    address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, blank=True, related_name='patients')
    profile_pic = models.ImageField(upload_to='profile_pic/patient/', null=True, blank=True)

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

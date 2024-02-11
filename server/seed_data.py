import os
import django
import random
from faker import Faker
from datetime import timedelta, datetime

from django.utils import timezone


# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'server.settings')
django.setup()

from django.contrib.auth import get_user_model
from user_profile.models import (
    Address, Speciality, Language, Doctor, Patient,
    DoctorLanguageProficiency, PatientLanguageProficiency,
    Qualification, DoctorQualification, Review
)
from appointment.models import Appointment
from django.utils import timezone
from medical_record.models import MedicalRecord, Disorder, Medicine, Diagnosis
from conversation.models import Conversation, Message, Attachment, Call

User = get_user_model()
fake = Faker()

def create_users(n):
    for _ in range(n):
        account_type = random.choice(['patient', 'doctor'])
        user = User.objects.create_user(
            username=fake.unique.user_name(),
            email=fake.unique.email(),
            password="pass@123",
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            account_type=account_type,
            timezone=fake.timezone()
        )
        print(f"Created User: {user.username} as {account_type}")

def create_addresses(n):
    for _ in range(n):
        address = Address.objects.create(
            street=fake.street_address(),
            city=fake.city(),
            state=fake.state(),
            postal_code=fake.postcode(),
            country=fake.country()
        )
        print(f"Created Address: {address}")

def create_specialities():
    specialities = ['Cardiology', 'Dermatology', 'Neurology', 'Pediatrics', 'Psychiatry']
    for speciality in specialities:
        Speciality.objects.create(name=speciality)
    print("Created Specialities")

def create_languages():
    languages = ['English', 'Spanish', 'French', 'German', 'Chinese']
    for language in languages:
        Language.objects.create(name=language)
    print("Created Languages")

def create_qualifications():
    qualifications = [
        {"name": "MBBS", "university": "Harvard University"},
        {"name": "MD", "university": "Stanford University"},
        {"name": "BDS", "university": "University of Pennsylvania"},
        {"name": "Ph.D. in Medical Science", "university": "Johns Hopkins University"},
        {"name": "MS in Surgery", "university": "University of California, San Francisco"}
    ]
    for qual in qualifications:
        Qualification.objects.create(name=qual["name"], university=qual["university"])
    print("Created Qualifications")

def update_doctors(n):
    # Assuming doctor profiles are automatically created
    for doctor in Doctor.objects.all()[:n]:
        doctor.phone = fake.phone_number()
        doctor.hospital_address = random.choice(Address.objects.all())
        doctor.cost = random.randint(100, 500)
        doctor.currency = 'USD'
        doctor.experience = random.randint(1, 20)
        doctor.availability = random.choice(['full-time', 'part-time', 'weekends', 'evenings'])
        doctor.profile_picture = fake.image_url()
        doctor.save()

        doctor.specialties.set(random.sample(list(Speciality.objects.all()), k=random.randint(1, Speciality.objects.count())))
        doctor.languages.set(random.sample(list(Language.objects.all()), k=random.randint(1, Language.objects.count())))
        for qualification in random.sample(list(Qualification.objects.all()), k=random.randint(1, Qualification.objects.count())):
            DoctorQualification.objects.create(
                doctor=doctor,
                qualification=qualification,
                start_year=fake.year(),
                finish_year=fake.year()
            )
        print(f"Updated Doctor: {doctor.user.username}")

def update_patients(n):
    # Assuming patient profiles are automatically created
    for patient in Patient.objects.all()[:n]:
        patient.phone = fake.phone_number()
        patient.dob = fake.date_of_birth()
        patient.marital_status = random.choice(['single', 'married', 'divorced', 'widowed'])
        patient.gender = random.choice(['male', 'female', 'other'])
        patient.height = random.uniform(150, 200)
        patient.weight = random.uniform(50, 100)
        patient.blood_group = random.choice(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        patient.address = random.choice(Address.objects.all())
        patient.profile_picture = fake.image_url()
        patient.save()

        patient.languages.set(random.sample(list(Language.objects.all()), k=random.randint(1, Language.objects.count())))
        print(f"Updated Patient: {patient.user.username}")

def create_appointments(n):
    for _ in range(n):
        doctor = random.choice(Doctor.objects.all())
        patient = random.choice(Patient.objects.all())
        appointment_date = fake.date_between(start_date='-1y', end_date='today')
        appointment_time = fake.time_object()

        # Ensure there is a conversation between the patient and doctor
        conversation, created = Conversation.objects.get_or_create(
            patient=patient.user,
            doctor=doctor.user
        )

        # Create the appointment with a specific datetime and link it to the conversation
        appointment_datetime = timezone.make_aware(datetime.combine(appointment_date, appointment_time))
        appointment = Appointment.objects.create(
            patient=patient.user,
            doctor=doctor.user,
            date=appointment_date,
            time=appointment_time,
            datetime_utc=appointment_datetime,
            purpose=fake.sentence(),
            conversation=conversation,  # Link the appointment to the conversation
            created_at=timezone.now(),
            updated_at=timezone.now()
        )
        print(f"Created Appointment: {appointment} with conversation ID {conversation.id}")
        
def create_reviews(n):
    for _ in range(n):
        doctor = random.choice(Doctor.objects.all())
        patient = random.choice(Patient.objects.all())
        Review.objects.create(
            doctor=doctor,
            patient=patient,
            rating=random.randint(1, 5),
            comment=fake.text(max_nb_chars=200),
            date_created=fake.date_time_this_year()
        )
    print(f"Created {n} Reviews")

def create_medical_records(n):
    for _ in range(n):
        patient = random.choice(Patient.objects.all())
        MedicalRecord.objects.create(
            patient=patient,
            created_at=fake.date_time_this_year(),
            last_updated=fake.date_time_this_month()
        )
    print(f"Created {n} Medical Records")

def create_disorders(n):
    for _ in range(n):
        medical_record = random.choice(MedicalRecord.objects.all())
        Disorder.objects.create(
            medical_record=medical_record,
            name=fake.word(),
            details=fake.text(max_nb_chars=200),
            first_noticed=fake.date_time_this_decade()
        )
    print(f"Created {n} Disorders")

def create_medicines(n):
    for _ in range(n):
        medical_record = random.choice(MedicalRecord.objects.all())
        Medicine.objects.create(
            medical_record=medical_record,
            name=fake.word(),
            dosage=fake.sentence(),
            start_date=fake.date_time_this_year(),
            end_date=fake.date_time_this_year() + timedelta(days=30)
        )
    print(f"Created {n} Medicines")

def create_diagnoses(n):
    for _ in range(n):
        medical_record = random.choice(MedicalRecord.objects.all())
        Diagnosis.objects.create(
            medical_record=medical_record,
            diagnosis=fake.word(),
            details=fake.text(max_nb_chars=200),
            date=fake.date_time_this_year()
        )
    print(f"Created {n} Diagnoses")

def create_conversations(n):
    for _ in range(n):
        patient = random.choice(User.objects.filter(patient_profile__isnull=False))
        doctor = random.choice(User.objects.filter(doctor_profile__isnull=False))
        Conversation.objects.create(
            patient=patient,
            doctor=doctor,
            created_at=fake.date_time_this_year(),
            updated_at=fake.date_time_this_month()
        )
    print(f"Created {n} Conversations")

def create_messages(n):
    for _ in range(n):
        conversation = random.choice(Conversation.objects.all())
        sender = random.choice([conversation.patient, conversation.doctor])
        Message.objects.create(
            conversation=conversation,
            sender=sender,
            text=fake.text(max_nb_chars=200),
            timestamp=fake.date_time_this_year()
        )
    print(f"Created {n} Messages")

def create_attachments(n):
    for _ in range(n):
        message = random.choice(Message.objects.all())
        Attachment.objects.create(
            message=message,
            file=fake.file_name(category='image')
        )
    print(f"Created {n} Attachments")

def create_calls(n):
    for _ in range(n):
        conversation = random.choice(Conversation.objects.all())
        caller = random.choice([conversation.patient, conversation.doctor])
        receiver = conversation.doctor if caller == conversation.patient else conversation.patient
        start_time = fake.date_time_this_year()
        end_time = start_time + timedelta(minutes=30)
        # Make the end_time timezone-aware
        end_time_aware = timezone.make_aware(end_time, timezone.get_default_timezone())
        Call.objects.create(
            conversation=conversation,
            caller=caller,
            receiver=receiver,
            call_type=random.choice(['video', 'audio']),
            call_status=random.choice(['initiated', 'ongoing', 'completed', 'missed', 'rejected']),
            start_time=timezone.make_aware(start_time, timezone.get_default_timezone()),
            end_time=end_time_aware
        )
    print(f"Created {n} Calls")


# Add calls to the functions here to execute them
create_users(20)  # Adjust numbers as needed
create_addresses(10)
create_specialities()
create_languages()
create_qualifications()
update_doctors(10)
update_patients(10)
create_appointments(20)
create_reviews(10)
create_medical_records(10)
create_disorders(20)
create_medicines(20)
create_diagnoses(20)
create_conversations(10)
create_messages(50)
create_attachments(20)
create_calls(10)

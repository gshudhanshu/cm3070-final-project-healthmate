from rest_framework import serializers
from .models import MedicalRecord, Disorder, Medicine, Diagnosis
from user_profile.serializers import PatientSerializer
from appointment.serializers import AppointmentSerializer
from appointment.models import Appointment

class DisorderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disorder
        fields = '__all__'

class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = '__all__'

class DiagnosisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diagnosis
        fields = '__all__'

class MedicalRecordSerializer(serializers.ModelSerializer):
    disorders = DisorderSerializer(many=True, read_only=True)
    medicines = MedicineSerializer(many=True, read_only=True)
    diagnosis = DiagnosisSerializer(many=True, read_only=True)
    patient = PatientSerializer(read_only=True)
    appointments = serializers.SerializerMethodField()

    class Meta:
        model = MedicalRecord
        fields = '__all__'

    def get_appointments(self, obj):
        appointments = Appointment.objects.filter(patient=obj.patient.user)
        return AppointmentSerializer(appointments, many=True).data


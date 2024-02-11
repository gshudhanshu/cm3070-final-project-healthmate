from rest_framework import serializers
from .models import MedicalRecord, Disorder, Medicine, Diagnosis
from user_profile.serializers import PatientSerializer

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
    diagnoses = DiagnosisSerializer(many=True, read_only=True)
    patient = PatientSerializer(read_only=True)

    class Meta:
        model = MedicalRecord
        fields = '__all__'

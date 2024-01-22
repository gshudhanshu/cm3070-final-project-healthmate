from rest_framework import serializers
from .models import MedicalRecord, Disorder, Medicine, Diagnosis, AppointmentHistory

class MedicalRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = MedicalRecord
        fields = '__all__'

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

class AppointmentHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = AppointmentHistory
        fields = '__all__'

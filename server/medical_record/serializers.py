from rest_framework import serializers
from .models import MedicalRecord, Disorder, Medicine, Diagnosis
from user_profile.serializers import PatientSerializer
from appointment.serializers import AppointmentSerializer
from appointment.models import Appointment

class DisorderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Disorder
        fields = '__all__'
        extra_kwargs = {'medical_record': {'required': False}}

class MedicineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Medicine
        fields = '__all__'
        extra_kwargs = {'medical_record': {'required': False}}

class DiagnosisSerializer(serializers.ModelSerializer):
    class Meta:
        model = Diagnosis
        fields = '__all__'
        extra_kwargs = {'medical_record': {'required': False}}

class MedicalRecordSerializer(serializers.ModelSerializer):
    disorders = DisorderSerializer(many=True, read_only=True)
    medicines = MedicineSerializer(many=True, read_only=True)
    diagnosis = DiagnosisSerializer(many=True, read_only=True)
    patient = PatientSerializer(read_only=True)
    appointments = serializers.SerializerMethodField()

    class Meta:
        model = MedicalRecord
        fields = '__all__'
    
    def get_appointments(self, instance):
        # Assuming that `instance` is a `MedicalRecord` instance
        patient = instance.patient.user  # Assuming `patient` is a `CustomUser` instance
        appointments = Appointment.objects.filter(patient=patient)
        return AppointmentSerializer(appointments, many=True).data


class MedicalRecordCreateSerializer(serializers.ModelSerializer):
    # Assuming you have already defined nested serializers for Disorder, Medicine, and Diagnosis
    disorders = DisorderSerializer(many=True, allow_null=True, required=False)
    medicines = MedicineSerializer(many=True, allow_null=True, required=False)
    diagnoses = DiagnosisSerializer(many=True, allow_null=True, required=False)

    class Meta:
        model = MedicalRecord
        fields = '__all__'

    def create(self, validated_data):
        # Assume that the validated_data dictionary includes keys for the nested objects
        disorders_data = validated_data.pop('disorders', [])
        medicines_data = validated_data.pop('medicines', [])
        diagnoses_data = validated_data.pop('diagnoses', [])
        
        medical_record = MedicalRecord.objects.create(**validated_data)

        for disorder_data in disorders_data:
            Disorder.objects.create(medical_record=medical_record, **disorder_data)

        for medicine_data in medicines_data:
            Medicine.objects.create(medical_record=medical_record, **medicine_data)

        for diagnosis_data in diagnoses_data:
            Diagnosis.objects.create(medical_record=medical_record, **diagnosis_data)

        return medical_record

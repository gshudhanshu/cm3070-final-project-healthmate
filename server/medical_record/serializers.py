from rest_framework import serializers
from .models import MedicalRecord, Disorder, Medicine, Diagnosis
from user_profile.serializers import PatientSerializer
from appointment.serializers import AppointmentSerializer
from appointment.models import Appointment

class DisorderSerializer(serializers.ModelSerializer):
    """
    Serializer for the Disorder model.
    """    
    class Meta:
        model = Disorder
        fields = '__all__'
        extra_kwargs = {'medical_record': {'required': False}}

class MedicineSerializer(serializers.ModelSerializer):
    """
    Serializer for the Medicine model.
    """    
    class Meta:
        model = Medicine
        fields = '__all__'
        extra_kwargs = {'medical_record': {'required': False}}

class DiagnosisSerializer(serializers.ModelSerializer):
    """
    Serializer for the Diagnosis model.
    """    
    class Meta:
        model = Diagnosis
        fields = '__all__'
        extra_kwargs = {'medical_record': {'required': False}}

class MedicalRecordSerializer(serializers.ModelSerializer):
    """
    Serializer for the MedicalRecord model.
    """
    
    disorders = DisorderSerializer(many=True, read_only=True)
    medicines = MedicineSerializer(many=True, read_only=True)
    diagnosis = DiagnosisSerializer(many=True, read_only=True)
    patient = PatientSerializer(read_only=True)
    appointments = serializers.SerializerMethodField()

    class Meta:
        model = MedicalRecord
        fields = '__all__'
    
    def get_appointments(self, instance):
        """
        Method to get all appointments associated with the patient of the medical record.
        """
        
        patient = instance.patient.user 
        appointments = Appointment.objects.filter(patient=patient)
        return AppointmentSerializer(appointments, many=True).data


class MedicalRecordCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating a new MedicalRecord instance.
    """
    disorders = DisorderSerializer(many=True, allow_null=True, required=False)
    medicines = MedicineSerializer(many=True, allow_null=True, required=False)
    diagnoses = DiagnosisSerializer(many=True, allow_null=True, required=False)

    class Meta:
        model = MedicalRecord
        fields = '__all__'

    def create(self, validated_data):
        """
        Custom create method to handle nested objects creation.
        """
        disorders_data = validated_data.pop('disorders', [])
        medicines_data = validated_data.pop('medicines', [])
        diagnoses_data = validated_data.pop('diagnoses', [])
        
        medical_record, created = MedicalRecord.objects.get_or_create(**validated_data)
        
        for disorder_data in disorders_data:
            Disorder.objects.create(medical_record=medical_record, **disorder_data)

        for medicine_data in medicines_data:
            Medicine.objects.create(medical_record=medical_record, **medicine_data)

        for diagnosis_data in diagnoses_data:
            Diagnosis.objects.create(medical_record=medical_record, **diagnosis_data)

        return medical_record

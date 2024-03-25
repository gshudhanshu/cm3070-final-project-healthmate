from django.apps import AppConfig


class MedicalRecordsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "medical_record"
    
    def ready(self):
        import medical_record.signals

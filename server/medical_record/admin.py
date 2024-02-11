from django.contrib import admin

from .models import MedicalRecord,Disorder,Medicine,Diagnosis

# Register your models here.
admin.site.register(MedicalRecord)
admin.site.register(Disorder)
admin.site.register(Medicine)
admin.site.register(Diagnosis)

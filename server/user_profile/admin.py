from django.contrib import admin

# Register your models here.
from .models import Specialty, Qualification, Language, LanguageProficiency, Doctor, Patient, Review

admin.site.register(Specialty)
admin.site.register(Qualification)
admin.site.register(Language)
admin.site.register(LanguageProficiency)

class LanguageProficiencyInline(admin.TabularInline):
    model = LanguageProficiency
    extra = 1

@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    list_display = ('user', 'average_rating_admin', 'phone', 'hospital_address', 'experience', 'cost', 'currency')
    search_fields = ('user__username', 'specialties__name', 'qualifications__name')
    list_filter = ('specialties', 'qualifications', 'languages')
    inlines = [LanguageProficiencyInline]
    
    def average_rating_admin(self, obj):
        return obj.average_rating()
    average_rating_admin.short_description = 'Average Rating'


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    list_display = ('user', 'phone', 'dob', 'gender', 'blood_group')
    search_fields = ('user__username', 'language__name', 'blood_group')
    list_filter = ('gender', 'marital_status', 'blood_group')

@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ('doctor', 'patient', 'rating', 'date_created')
    search_fields = ('doctor__user__username', 'patient__user__username', 'rating')
    list_filter = ('rating', 'date_created')

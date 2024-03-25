from django.contrib import admin
from django import forms



# Register your models here.
from .models import Speciality, Qualification, Language, DoctorLanguageProficiency, Doctor, DoctorQualification, Patient,PatientLanguageProficiency, Review, Address

admin.site.register(Speciality)
admin.site.register(Qualification)
admin.site.register(Language)
admin.site.register(DoctorLanguageProficiency)

class DoctorLanguageProficiencyInline(admin.TabularInline):
    """
    Inline form for Doctor's language proficiency.
    """
    
    model = DoctorLanguageProficiency
    extra = 1
class PatientLanguageProficiencyInline(admin.TabularInline):
    """
    Inline form for Patient's language proficiency.
    """
    
    model = PatientLanguageProficiency
    extra = 1
    
class DoctorQualificationInline(admin.TabularInline):
    """
    Inline form for Doctor's qualifications.
    """
    
    model = DoctorQualification
    extra = 1
    
    
# Address form
class DoctorAdminForm(forms.ModelForm):
    """
    Custom admin form for Doctor model including address details.
    """
    
    # Add fields for address details
    street = forms.CharField(max_length=255, required=False)
    city = forms.CharField(max_length=100, required=False)
    state = forms.CharField(max_length=100, required=False)
    postal_code = forms.CharField(max_length=20, required=False)
    country = forms.CharField(max_length=50, required=False)

    class Meta:
        model = Doctor
        fields = '__all__'

    def save(self, commit=True):
        """
        Custom save method to handle saving address details separately.
        """
        
        # Create a new address if address details are provided
        if any([self.cleaned_data.get(field) for field in ['street', 'city', 'state', 'postal_code', 'country']]):
            address = Address.objects.create(
                street=self.cleaned_data.get('street', ''),
                city=self.cleaned_data.get('city', ''),
                state=self.cleaned_data.get('state', ''),
                postal_code=self.cleaned_data.get('postal_code', ''),
                country=self.cleaned_data.get('country', '')
            )
            self.instance.hospital_address = address
        return super().save(commit=commit)


@admin.register(Doctor)
class DoctorAdmin(admin.ModelAdmin):
    """
    Admin interface for Doctor model.
    """
    
    form = DoctorAdminForm
    list_display = ('user', 'average_rating_admin', 'phone', 'hospital_address', 'experience', 'cost', 'currency')
    search_fields = ('user__username', 'specialties__name', 'qualifications__name')
    list_filter = ('specialties', 'qualifications', 'languages')
    inlines = [DoctorLanguageProficiencyInline, DoctorQualificationInline]
    
    def average_rating_admin(self, obj):
        """
        Display average rating in admin interface.
        """        
        return obj.average_rating()
    average_rating_admin.short_description = 'Average Rating'


@admin.register(Patient)
class PatientAdmin(admin.ModelAdmin):
    """
    Admin interface for Patient model.
    """    
    list_display = ('user', 'phone', 'dob', 'gender', 'blood_group')
    search_fields = ('user__username', 'language__name', 'blood_group')
    list_filter = ('gender', 'marital_status', 'blood_group')
    inlines = [PatientLanguageProficiencyInline]


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    """
    Admin interface for Review model.
    """    
    list_display = ('doctor', 'patient', 'rating', 'date_created')
    search_fields = ('doctor__user__username', 'patient__user__username', 'rating')
    list_filter = ('rating', 'date_created')



from django_filters import rest_framework as filters, Filter, BaseInFilter, CharFilter, NumberFilter
from django.db.models import Q
from .models import Doctor, Speciality, Qualification


class ListFilter(BaseInFilter, CharFilter):
    """
    Filter for lists.
    """
    
    pass


class DoctorFilter(filters.FilterSet):
    """
    Filter set for Doctor model.
    """
    
    doctor_name = filters.CharFilter(method='filter_doctor_name')
    location = filters.CharFilter(method='filter_location')
    experience = filters.RangeFilter()
    cost = filters.RangeFilter()
    speciality = filters.CharFilter(method='filter_speciality')
    availability = filters.CharFilter(method='filter_availability')
    qualification = ListFilter(method='filter_qualification')
    language = ListFilter(method='filter_language')


    class Meta:
        model = Doctor
        fields = []

    def filter_doctor_name(self, queryset, name, value):
        """
        Custom method to filter doctors by their first name, last name, or a combination of both.
        """
        # Split the search term into words
        name_parts = value.split()

        # Start with an empty query
        name_query = Q()

        # Add a query condition for each part of the name
        for part in name_parts:
            name_query |= Q(user__first_name__icontains=part) | Q(user__last_name__icontains=part)

        # Filter the queryset with the combined query
        return queryset.filter(name_query)


    def filter_location(self, queryset, name, value):
        """
        Custom method to filter doctors by location.
        """
        
        return queryset.filter(
            Q(hospital_address__street__icontains=value) |
            Q(hospital_address__city__icontains=value) |
            Q(hospital_address__state__icontains=value) |
            Q(hospital_address__postal_code__icontains=value) |
            Q(hospital_address__country__icontains=value)
        ).distinct()
        
    
    def filter_availability(self, queryset, name, value):
        """
        Custom method to filter doctors by availability.
        """
        
        availability_values = value.split(',')
        return queryset.filter(availability__in=availability_values).distinct()
    
    def filter_speciality(self, queryset, name, value):
        """
        Custom method to filter doctors by speciality.
        """
        
        return queryset.filter(specialties__name__iexact=value).distinct()
        
    def filter_languages(self, queryset, name, value):
        """
        Custom method to filter doctors by language proficiency.
        """
        
        return queryset.filter(languages__name__iexact=value).distinct()
    
    def filter_qualification(self, queryset, name, value):
        """
        Custom method to filter doctors by qualification.
        """
        
        if not value:
            return queryset
        return queryset.filter(qualifications__name__in=value).distinct()

    def filter_language(self, queryset, name, value):
        """
        Custom method to filter doctors by language.
        """
        
        if not value:
            return queryset
        return queryset.filter(languages__name__in=value).distinct()

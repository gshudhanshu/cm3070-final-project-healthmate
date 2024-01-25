from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD, or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the object.
        return obj.user == request.user

class IsDoctorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow doctors to view patient profiles.
    """
    
    def has_permission(self, request, view):
        # Allow viewing patient profiles for any request
        # if not trying to write (POST, PUT, PATCH, DELETE).
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated and hasattr(request.user, 'doctor_profile')
        
        # Write permissions are only allowed to the owner of the patient profile.
        return False
    
    
class IsReadOnlyOrIsNew(permissions.BasePermission):
    """
    Custom permission to only allow read-only operations on an existing object,
    but allow creation of new objects.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed if the object is new (not in the database yet)
        return not obj.pk  # obj.pk is None if the object is not in the database yet
    
from rest_framework import permissions

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # Always allow GET, HEAD, or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner of the object.
        return obj.user == request.user

class IsDoctorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow doctors to view and edit patient profiles,
    but also allow patients to view and edit their own profiles.
    """
    def has_permission(self, request, view):
        # Allow viewing for any safe method requests (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True

        # Allow write operations if the user is a doctor
        user = request.user
        if user.is_authenticated and user.account_type == 'doctor':
            return True

        # Allow patients to make write operations on their own profile
        if user.is_authenticated and user.account_type == 'patient':
            return hasattr(view, 'kwargs') and view.kwargs.get('user__username') == user.username

        return False

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed for any request,
        # Allow GET, HEAD, or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Allow write operations if the user is a doctor
        if request.user.account_type == 'doctor':
            return True

        # Allow write operations if the patient is updating their own profile
        return obj.user == request.user
    
    
class IsReadOnlyOrIsNew(permissions.BasePermission):
    """
    Custom permission to only allow read-only operations on an existing object,
    but allow creation of new objects.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # Always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed if the object is new (not in the database yet)
        return not obj.pk  # obj.pk is None if the object is not in the database yet
    
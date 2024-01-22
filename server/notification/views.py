from rest_framework import viewsets
from .models import Notification
from .serializers import NotificationSerializer
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import AnonymousUser


class NotificationViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing notification instances.
    """
    serializer_class = NotificationSerializer
    queryset = Notification.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        Optionally restricts the returned notifications to those for the current user,
        by filtering against a `username` query parameter in the URL.
        """
        user = self.request.user
        if isinstance(user, AnonymousUser):
            # Handle the anonymous user case
            return Notification.objects.none()  # or handle as appropriate
        return Notification.objects.filter(recipient=user)

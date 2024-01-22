from rest_framework import viewsets
from .models import Notification
from .serializers import NotificationSerializer
from rest_framework.permissions import IsAuthenticated

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
        queryset = Notification.objects.filter(recipient=self.request.user)
        return queryset

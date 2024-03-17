from rest_framework import viewsets
from .models import Notification
from .serializers import NotificationSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status



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
        return Notification.objects.filter(recipient=user)


    @action(detail=False, methods=['patch'], permission_classes=[IsAuthenticated])
    def mark_all_as_read(self, request):
        """
        A custom action to mark all notifications as read for the authenticated user.
        """
        user = request.user
        notifications = Notification.objects.filter(recipient=user, is_read=False)
        notifications.update(is_read=True)
        return Response({'status': 'notifications marked as read'}, status=status.HTTP_200_OK)

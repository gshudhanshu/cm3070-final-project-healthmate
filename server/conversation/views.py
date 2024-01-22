from rest_framework import viewsets
from .models import Conversation, Message, Call
from .serializers import ConversationSerializer, MessageSerializer, CallSerializer
from rest_framework.permissions import IsAuthenticated

class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    queryset = Conversation.objects.all()
    permission_classes = [IsAuthenticated]

class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    queryset = Message.objects.all()
    permission_classes = [IsAuthenticated]

class CallViewSet(viewsets.ModelViewSet):
    serializer_class = CallSerializer
    queryset = Call.objects.all()
    permission_classes = [IsAuthenticated]

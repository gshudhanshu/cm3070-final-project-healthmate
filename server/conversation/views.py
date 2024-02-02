from itertools import chain
from django.core.exceptions import ValidationError
from rest_framework import viewsets
from .models import Conversation, Message, Call,Attachment
from .serializers import ConversationSerializer, MessageSerializer, CallSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db import models
from rest_framework.exceptions import NotFound
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.core.cache import cache




class ConversationViewSet(viewsets.ModelViewSet):
    serializer_class = ConversationSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        """
        This view should return a list of all conversations
        where the current user is either the patient or the doctor.
        """
        user = self.request.user
        return Conversation.objects.filter(models.Q(patient=user) | models.Q(doctor=user))


class MessageViewSet(viewsets.ModelViewSet):
    serializer_class = MessageSerializer
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    
    def get_queryset(self):
        user = self.request.user
        conversation_id = self.kwargs.get('conversation_id')

        if not conversation_id:
            raise NotFound("Conversation ID not provided")

        # Ensure the user is part of the conversation
        if not Conversation.objects.filter(
                models.Q(patient=user) | models.Q(doctor=user),
                id=conversation_id
            ).exists():
            raise NotFound("Conversation not found")

        # Fetch messages and calls
        messages = Message.objects.filter(conversation_id=conversation_id)
        calls = Call.objects.filter(conversation_id=conversation_id)

        # Combine and sort by timestamp
        combined = sorted(
            chain(messages, calls), 
            key=lambda instance: instance.timestamp
        )

        return combined
    

    def perform_create(self, serializer):
        user = self.request.user
        conversation_id = self.kwargs.get('conversation_id')

        if not Conversation.objects.filter(
                models.Q(patient=user) | models.Q(doctor=user),
                id=conversation_id
            ).exists():
            raise ValidationError("You do not have permission to add a message to this conversation.")

        message = serializer.save(sender=user, conversation=Conversation.objects.get(id=conversation_id))
        attachments_data = self.request.FILES
        for file in attachments_data.getlist('file'):
            Attachment.objects.create(message=message, file=file)


    def to_representation(self, instance):
        """
        Custom representation for handling different types of instances (Message or Call)
        and adding a 'type' field to the serialized data.
        """
        if isinstance(instance, Message):
            representation = MessageSerializer(instance).data
            representation['type'] = 'message'
            return representation
        elif isinstance(instance, Call):
            representation = CallSerializer(instance).data
            representation['type'] = 'call'
            return representation
        else:
            return super(MessageViewSet, self).to_representation(instance)
        

    
class CallViewSet(viewsets.ModelViewSet):
    serializer_class = CallSerializer
    queryset = Call.objects.all()
    permission_classes = [IsAuthenticated]

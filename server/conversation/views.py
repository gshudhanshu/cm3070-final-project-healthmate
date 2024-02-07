from itertools import chain
from django.core.exceptions import ValidationError
from rest_framework import viewsets, status
from .models import Conversation, Message, Call,Attachment
from .serializers import ConversationSerializer, MessageSerializer, CallSerializer, AttachmentSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db import models
from rest_framework.exceptions import NotFound
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.views import APIView
from rest_framework.response import Response

from django.shortcuts import get_object_or_404
from django.utils import timezone



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
            key=lambda instance: instance.timestamp if isinstance(instance, Message) else instance.start_time
        )
        
        return combined
    
    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()  # This returns combined Message and Call instances

        # Serialize each object with the appropriate serializer
        serialized_data = []
        for item in queryset:
            if isinstance(item, Message):
                serializer = MessageSerializer(item)
            elif isinstance(item, Call):
                serializer = CallSerializer(item)
            else:
                continue  # Skip if the object is neither Message nor Call
            serialized_data.append(serializer.data)

        return Response(serialized_data)

    
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
          

class FileUploadView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request, format=None):
        file_serializer = AttachmentSerializer(data=request.data)
        if file_serializer.is_valid():
            file_serializer.save()
            return Response(file_serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(file_serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CallViewSet(viewsets.ModelViewSet):
    serializer_class = CallSerializer
    queryset = Call.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        """
        This view should return a list of all calls
        where the current user is either the caller or the receiver.
        """
        user = self.request.user
        return Call.objects.filter(models.Q(caller=user) | models.Q(receiver=user))
    
    def create(self, request, *args, **kwargs):
        conversation_id = request.data.get('conversationId')
        # Get the conversation instance
        conversation = get_object_or_404(Conversation, id=conversation_id)

        # Determine caller and receiver
        caller = request.user
        receiver = conversation.doctor if caller == conversation.patient else conversation.patient

        # Create the call record
        call = Call.objects.create(
            conversation=conversation,
            caller=caller,
            receiver=receiver
        )

        # Serialize and return the new call record
        serializer = self.get_serializer(call)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


    def partial_update(self, request, *args, **kwargs):
        """
        Updates call status, such as marking it as 'completed' or 'missed'.
        """
        call = self.get_object()
        serializer = self.get_serializer(call, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        user = self.request.user
        
        if (call.caller == user or call.receiver == user):
            # Update and save the call record
            serializer.save(end_time=timezone.now())
            return Response(serializer.data)
        
        return Response({'detail': 'User not part of this call'}, status=status.HTTP_403_FORBIDDEN)
    
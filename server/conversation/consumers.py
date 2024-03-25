import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.conf import settings

from .models import Conversation, Message, Attachment
from django.contrib.auth import get_user_model
from .models import Conversation, Message, Attachment
from djoser.conf import settings as djoser_settings
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import AttachmentSerializer, SimpleProfileSerializer
from user_profile.models import Doctor, Patient

User = get_user_model()

# Common utilities for both Consumers
class ConsumerUtilities:
    @staticmethod
    @database_sync_to_async
    def get_user_from_token(token):
        """
        Retrieve user from JWT token.
        """
        if not token:
            return None
        try:
            jwt_authentication = JWTAuthentication()
            validated_token = jwt_authentication.get_validated_token(token)
            user = jwt_authentication.get_user(validated_token)
            return user
        except (InvalidToken, TokenError):
            return None

    @staticmethod
    def get_token_from_query_string(query_string):
        """
        Extract token from query string.
        """        
        token = None
        for param in query_string.split('&'):
            if 'token=' in param:
                token = param.split('=')[1]
                break
        return token
    
    # Helper method to serialize the user
    @staticmethod
    def serialize_user(self, user):
        """
        Serialize user data.
        """        
        profile_pic_url = None
        if user.account_type == 'patient':
            profile_pic_url = Patient.objects.get(user=user).profile_pic.url if Patient.objects.get(user=user).profile_pic else None
        elif user.account_type == 'doctor':
            profile_pic_url = Doctor.objects.get(user=user).profile_pic.url if Doctor.objects.get(user=user).profile_pic else None
            
        return {
            'id': user.id, 'username': user.username,
            'first_name': user.first_name, 'last_name': user.last_name,
            'email': user.email, 'account_type': user.account_type,
            'profile_pic': f"{settings.BASE_URL}{profile_pic_url}"
        }


class ChatConsumer(AsyncWebsocketConsumer):
    """
    Websocket consumer for handling chat messages.
    """    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_group_name = None  # Initialize with None
        self.conversation_id = None

    async def connect(self):
        """
        Connect to websocket.
        """        
        token = ConsumerUtilities.get_token_from_query_string(self.scope['query_string'].decode('utf-8'))
        self.user = await ConsumerUtilities.get_user_from_token(token)
        if not self.user:
            await self.close(code=4001)  # Authentication error
            return
        
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'chat_{self.conversation_id}'

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        """
        Disconnect from websocket.
        """        
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        """
        Receive data from websocket.
        """        
        data = json.loads(text_data)
                        
        if data.get('action') == 'chat_message':
            await self.handle_chat_message(data)
        elif data.get('action') == 'call_message':
            await self.handle_call_message(data)

    # Receive message from room group
    async def chat_message(self, event):
        """
        Receive chat message from room group.
        """        
        message = event['message']
        await self.send(text_data=json.dumps({'message': message, 'type': 'new_message'}))
        
    async def call_message(self, event):
        """
        Receive call message from room group.
        """        
        print(event)
        call = event['call']
        await self.send(text_data=json.dumps({'call': call, 'type': 'new_call'}))
        
    
    async def handle_chat_message(self, data):
        """
        Handle incoming chat messages.
        """        
        # Extract chat message data
        text = data.get('text', '')
        sender_id = data.get('sender', None)
        attachments = data.get('attachments', [])

        # Save the chat message and its attachments to the database
        message, sender_data = await self.save_message(sender_id, text)
        if message:
            # Link attachments to the message if any
            await self.link_attachments_to_message(message, attachments)
            # Fetch attachment data for sending in the broadcast
            attachment_data = await self.get_attachments(message)

            # Prepare the message data for broadcast
            message_data = {
                'id': message.id,
                'text': message.text,
                'sender': sender_data,
                'timestamp': str(message.timestamp),
                'attachments': attachment_data,
                'conversation': self.conversation_id,
                'type': 'message'
            }

            # Send message to room group
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    'type': 'chat_message',
                    'message': message_data
                }
            )
        else:
            print("Message not saved.")
            
            
    async def handle_call_message(self, data):
        """
        Handle incoming call messages.
        """        
        call = data.get('callData', {})
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'call_message',
                'call': call
            }
        )
            
        
     
    # Helper method to save message
    @database_sync_to_async
    def save_message(self, sender_id, text):
        """
        Save chat message to database.
        """        
        if sender_id:
            sender = User.objects.get(id=sender_id)
            conversation = Conversation.objects.get(id=self.conversation_id)
            message = Message.objects.create(sender=sender, conversation=conversation, text=text)
            sender_data = ConsumerUtilities.serialize_user(self, user=sender)
            # sender_data = SimpleProfileSerializer(sender).data
            return message, sender_data
        return None, None


    # Helper method to save attachments
    @database_sync_to_async
    def save_attachment(self, message, attachment):
        """
        Save attachment to database.
        """        
        if message:
            return Attachment.objects.create(
                message=message,
                file=attachment['content'] 
            )
        

    @database_sync_to_async
    def link_attachments_to_message(self, message, attachments):
        """
        Link attachments to message.
        """        
        for attachment_to_link in attachments:
            print(attachment_to_link)
            try:
                attachment = Attachment.objects.get(id=attachment_to_link['id'])
                attachment.message = message
                attachment.save()
            except Attachment.DoesNotExist:
                pass
            
    @database_sync_to_async
    def get_attachments(self, message):
        """
        Retrieve attachments for message.
        """        
        # Fetch and serialize attachment data
        attachments = Attachment.objects.filter(message=message)
        return AttachmentSerializer(attachments, many=True, read_only=True).data
    


class CallConsumer(AsyncWebsocketConsumer):
    """
    Websocket consumer for handling call messages.
    """    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.room_group_name = None  # Initialize with None
        self.conversation_id = None

    async def connect(self):
        """
        Connect to websocket.
        """        
        token = ConsumerUtilities.get_token_from_query_string(self.scope['query_string'].decode('utf-8'))
        self.user = await ConsumerUtilities.get_user_from_token(token)
        if not self.user:
            await self.close(code=4001)  # Authentication error
            return

        self.call_id = self.scope['url_route']['kwargs']['call_id']
        self.room_group_name = f'call_{self.call_id}'

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        """
        Disconnect from websocket.
        """        
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        """
        Receive data from websocket.
        """
        data = json.loads(text_data)
        
        # Check the type of message
        message_type = data.get('action')
        self.conversation_id = data.get('conversationId')
        
        if message_type == 'webrtc_offer':
            await self.handle_webrtc_offer(data)
        elif message_type == 'webrtc_answer':
            await self.handle_webrtc_answer(data)
        elif message_type == 'webrtc_ice_candidate':
            await self.handle_webrtc_ice_candidate(data)

        
    async def handle_webrtc_offer(self, data):
        """
        Handle WebRTC offer.
        """
        
        offer = data.get('offer')
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'webrtc_offer_message',
                'offer': offer,
                'conversation_id': self.conversation_id,
                'sender': self.user.username,
                'sender_channel_name': self.channel_name
            }
        )

    async def handle_webrtc_answer(self, data):
        """
        Handle WebRTC answer.
        """        
        answer = data.get('answer')
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'webrtc_answer_message',
                'answer': answer,
                'sender': self.user.username,
                'sender_channel_name': self.channel_name
            }
        )

    async def handle_webrtc_ice_candidate(self, data):
        """
        Handle WebRTC ICE candidate.
        """
        
        candidate = data.get('candidate')
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'webrtc_ice_candidate_message',
                'candidate': candidate,
                'sender': self.user.username,
                'sender_channel_name': self.channel_name
            }
        )

    async def webrtc_offer_message(self, event):
        """
        Send WebRTC offer message.
        """

        await self.notify_chat_about_call()
        if self.channel_name != event['sender_channel_name']:
            await self.send(text_data=json.dumps({
                'type': 'webrtc_offer',
                'offer': event['offer'],
                'sender': event['sender']
            }))

    async def webrtc_answer_message(self, event):
        """
        Send WebRTC answer message.
        """

        if self.channel_name != event['sender_channel_name']:
            await self.send(text_data=json.dumps({
                'type': 'webrtc_answer',
                'answer': event['answer'],
                'sender': event['sender']
            }))

    async def webrtc_ice_candidate_message(self, event):
        """
        Send WebRTC ICE candidate message.
        """

        if self.channel_name != event['sender_channel_name']:
            await self.send(text_data=json.dumps({
                'type': 'webrtc_ice_candidate',
                'candidate': event['candidate'],
                'sender': event['sender']
            }))
            
    
    @database_sync_to_async
    def notify_chat_about_call(self):
        """
        Notify chat about incoming call.
        """
        conversation_id = self.conversation_id
        print(f"***Notifying chat about call in conversation {conversation_id}")
        user_details = ConsumerUtilities.serialize_user(self, self.user)
        message_data = {
            'type': 'call_notification',
            'caller_details': user_details,
            'call_id': self.call_id,
        }
        self.channel_layer.group_send(
            f'chat_{conversation_id}',
            {
                'type': 'chat_message',
                'message': message_data
            }
        )

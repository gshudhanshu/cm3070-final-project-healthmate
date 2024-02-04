import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Conversation, Message, Attachment
from django.contrib.auth import get_user_model
from .models import Conversation, Message, Attachment
from djoser.conf import settings as djoser_settings
from rest_framework_simplejwt.exceptions import InvalidToken, TokenError
from rest_framework_simplejwt.authentication import JWTAuthentication

from user_profile.models import Doctor, Patient

User = get_user_model()


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        # Extract token from query string
        query_string = self.scope['query_string'].decode('utf-8')
        token = self.get_token_from_query_string(query_string)

        # Verify token and get user
        user = await self.get_user_from_token(token)
        if user is None:
            await self.close(code=4001)  # Custom close code for authentication error
            return

        self.user = user
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'chat_{self.conversation_id}'

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        # Leave room group
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        print(f"Received text data: {text_data}")

        # Extract data
        text = data.get('text', '')
        sender_id = data.get('sender', None)
        attachments = data.get('attachments', [])

        # Save message and attachments to the database
        message, sender_data = await self.save_message(sender_id, text)
        
        if message:
            # Process and save attachments
            for attachment in attachments:
                await self.save_attachment(message, attachment)

            # Fetch attachments URLs asynchronously
            attachment_urls = await self.get_attachment_urls(message)

            # Prepare the message data for broadcast
            message_data = {
                'id': message.id,
                'text': message.text,
                'sender': sender_data,
                'timestamp': str(message.timestamp),
                'attachments': attachment_urls,
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

    # Helper method to serialize the sender
    def serialize_user(self, user):
        # Adjust the fields as per your User model
        if(user.account_type == 'patient'):
            profile_pic = Patient.objects.get(user=user).profile_pic.url
        elif(user.account_type == 'doctor'):
            profile_pic = Doctor.objects.get(user=user).profile_pic.url
        else :
            profile_pic = None
        return {
            'id': user.id,
            'username': user.username,
            'first_name': user.first_name,
            'last_name': user.last_name,
            'email': user.email,
            'account_type': user.account_type,
            'profile_pic': profile_pic
        }
        
    @database_sync_to_async
    def get_attachment_urls(self, message):
        return [attachment.file.url for attachment in message.attachments.all()]

    # Helper method to save message
    @database_sync_to_async
    def save_message(self, sender_id, text):
        if sender_id:
            sender = User.objects.get(id=sender_id)
            conversation = Conversation.objects.get(id=self.conversation_id)
            message = Message.objects.create(sender=sender, conversation=conversation, text=text)
            sender_data = self.serialize_user(sender)
            return message, sender_data
        return None, None


    # Helper method to save attachments
    @database_sync_to_async
    def save_attachment(self, message, attachment):
        if message:
            return Attachment.objects.create(
                message=message,
                file=attachment['content']  # Assuming 'content' is the file data
            )


    # Receive message from room group
    async def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message,
            'type': 'new_message'
        }))


    # Helper method to extract token from query string
    def get_token_from_query_string(self, query_string):
        token = None
        for param in query_string.split('&'):
            if 'token=' in param:
                token = param.split('=')[1]
                break
        return token


    # Helper method to authenticate user from token
    @database_sync_to_async
    def get_user_from_token(self, token):
        if not token:
            return None

        # Use Djoser's JWT Authentication to verify the token
        try:
            jwt_authentication = JWTAuthentication()
            validated_token = jwt_authentication.get_validated_token(token)
            user = jwt_authentication.get_user(validated_token)
            return user
        except (InvalidToken, TokenError):
            return None
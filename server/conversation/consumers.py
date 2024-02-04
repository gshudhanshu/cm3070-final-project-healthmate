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
        # Extract and verify token, then set user and room details
        token = self.get_token_from_query_string(self.scope['query_string'].decode('utf-8'))
        user = await self.get_user_from_token(token)
        if not user:
            await self.close(code=4001)  # Authentication error
            return

        self.user = user
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'chat_{self.conversation_id}'

        # Join room group
        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        text = data.get('text', '')
        sender_id = data.get('sender', None)
        attachments = data.get('attachments', [])

        message, sender_data = await self.save_message(sender_id, text)
        if message:
            await self.link_attachments_to_message(message, attachments)
            attachment_urls = await self.get_attachment_urls(message)

            message_data = {
                'id': message.id, 'text': message.text, 'sender': sender_data,
                'timestamp': str(message.timestamp), 'attachments': attachment_urls,
                'conversation': self.conversation_id, 'type': 'message'
            }
            await self.channel_layer.group_send(self.room_group_name, {'type': 'chat_message', 'message': message_data})
        else:
            print("Message not saved.")

    # Helper method to serialize the sender
    def serialize_user(self, user):
        profile_pic_url = None
        if user.account_type == 'patient':
            profile_pic_url = Patient.objects.get(user=user).profile_pic.url if Patient.objects.get(user=user).profile_pic else None
        elif user.account_type == 'doctor':
            profile_pic_url = Doctor.objects.get(user=user).profile_pic.url if Doctor.objects.get(user=user).profile_pic else None

        return {
            'id': user.id, 'username': user.username, 'first_name': user.first_name,
            'last_name': user.last_name, 'email': user.email, 'account_type': user.account_type,
            'profile_pic': profile_pic_url
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
        await self.send(text_data=json.dumps({'message': message, 'type': 'new_message'}))



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
        

    @database_sync_to_async
    def link_attachments_to_message(self, message, attachments):
        for attachment_to_upload in attachments:
            print(attachment_to_upload)
            try:
                attachment = Attachment.objects.get(id=attachment_to_upload['id'])
                attachment.message = message
                attachment.save()
            except Attachment.DoesNotExist:
                pass

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Conversation, Message, Attachment
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
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

    # Receive message from WebSocket
    async def receive(self, text_data):
        data = json.loads(text_data)

        # Extract data
        text = data.get('text', '')
        sender_id = data.get('sender', None)
        attachments = data.get('attachments', [])

        # Save message and attachments to the database
        message = await self.save_message(sender_id, text)

        # Process and save attachments
        for attachment in attachments:
            await self.save_attachment(message, attachment)

        # Prepare the message data for broadcast
        message_data = {
            'id': message.id,
            'text': message.text,
            'sender': message.sender_id,
            'timestamp': str(message.timestamp),
            'attachments': [attachment.file.url for attachment in message.attachments.all()]
        }

        # Send message to room group
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message_data
            }
        )


    # Helper method to save message
    @database_sync_to_async
    def save_message(self, sender_id, text):
        if sender_id:
            sender = User.objects.get(id=sender_id)
            conversation = Conversation.objects.get(id=self.conversation_id)
            return Message.objects.create(sender=sender, conversation=conversation, text=text)
        return None

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
            'message': message
        }))

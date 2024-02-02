from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('socket.io/conversation/<int:conversation_id>/', consumers.ChatConsumer.as_asgi()),
]

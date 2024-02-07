from django.urls import path
from . import consumers

websocket_urlpatterns = [
    path('conversation/<int:conversation_id>/', consumers.ChatConsumer.as_asgi()),
    path('call/<int:conversation_id>/', consumers.ChatConsumer.as_asgi()),
    
]

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConversationViewSet, MessageViewSet, CallViewSet, FileUploadView

router = DefaultRouter()
# router.register(r'messages', MessageViewSet, basename='message')
router.register(r'calls', CallViewSet, basename='call')
router.register(r'', ConversationViewSet, basename='conversation')

urlpatterns = [
    path('', include(router.urls)),
    path('<int:conversation_id>/messages/', MessageViewSet.as_view({'get': 'list', 'post': 'create'}), name='conversation-messages'),
    path('upload_attachment/', FileUploadView.as_view, name='upload_attachment'),
]

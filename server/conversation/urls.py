from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ConversationViewSet, MessageViewSet, CallViewSet

router = DefaultRouter()
router.register(r'', ConversationViewSet)
router.register(r'messages', MessageViewSet)
router.register(r'calls', CallViewSet)

urlpatterns = [
    path('', include(router.urls)),
]

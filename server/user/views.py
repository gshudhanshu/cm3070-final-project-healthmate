from .models import CustomUser
from rest_framework import generics
from rest_framework.permissions import AllowAny
from .serializers import RegisterSerializer
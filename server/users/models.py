from django.db import models
from django.contrib.auth.models import _AnyUser, AbstractUser

# Create your models here.
class CustomUser(AbstractUser):
    user_type = {
        "P": "Patient",
        "D": "Doctor",
        "A": "Admin",
    }
    type = models.CharField(max_length=1, choices=user_type.items(), default="P")
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    dob = models.DateField()
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=50)
    profile_pic = models.ImageField(upload_to='profile_pic/', null=True, blank=True )
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    USERNAME_FIELD = 'username'
    REQUIRED_FIELDS = ['email', 'is_admin', 'first_name', 'last_name', 'dob', 'password', 'type']
    
    def __str__(self):
        return self.username
    
    def get_full_name(self) -> str:
        return f"{self.first_name} {self.last_name}"

from django.test import TestCase
from django.contrib.auth import get_user_model
from .models import CustomUser
from .serializers import UserSerializer

class CustomUserTestCase(TestCase):
    """
    Test case for the CustomUser model.
    """
    
    def setUp(self):
        """
        Set up test data.
        """
        
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword',
            'account_type': 'patient',
            'first_name': 'John',
            'last_name': 'Doe'
        }

    def test_create_user(self):
        """
        Test creating a user.
        """
        
        User = get_user_model()
        user = User.objects.create_user(**self.user_data)
        self.assertEqual(user.username, self.user_data['username'])
        self.assertEqual(user.email, self.user_data['email'])
        self.assertTrue(user.check_password(self.user_data['password']))
        self.assertEqual(user.account_type, self.user_data['account_type'])
        self.assertEqual(user.first_name, self.user_data['first_name'])
        self.assertEqual(user.last_name, self.user_data['last_name'])
        self.assertFalse(user.is_staff)
        self.assertFalse(user.is_superuser)

    def test_create_superuser(self):
        """
        Test creating a superuser.
        """
        
        User = get_user_model()
        superuser = User.objects.create_superuser(**self.user_data)
        self.assertTrue(superuser.is_staff)
        self.assertTrue(superuser.is_superuser)

class UserSerializerTestCase(TestCase):
    """
    Test case for the UserSerializer.
    """
    def setUp(self):
        """
        Set up test data.
        """
        self.user_data = {
            'username': 'testuser',
            'email': 'test@example.com',
            'password': 'testpassword',
            'account_type': 'patient',
            'first_name': 'John',
            'last_name': 'Doe',
            'timezone': 'UTC'
        }
        self.serializer = UserSerializer(data=self.user_data)

    def test_serializer_valid(self):
        """
        Test if the serializer is valid.
        """
        self.assertTrue(self.serializer.is_valid())

    def test_serializer_save(self):
        """
        Test saving the serializer.
        """
        self.assertTrue(self.serializer.is_valid())
        self.serializer.save()
        self.assertEqual(CustomUser.objects.count(), 1)

    def test_timezone_field(self):
        """
        Test the presence of the timezone field in the serializer.
        """        
        self.assertIn('timezone', self.serializer.fields)

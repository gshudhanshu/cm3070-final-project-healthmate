import os
import sys
import django

# Set the Django settings module to your project's settings module.
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "server.settings")

# Initialize Django
django.setup()

from django.contrib.auth.models import User

def create_superuser():
    try:
        # Get superuser credentials from environment variables
        username = os.environ.get('DJANGO_SUPERUSER_USERNAME')
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL')
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD')

        print(username, email, password)
        if not username or not email or not password:
            print("Please set all required environment variables: DJANGO_SUPERUSER_USERNAME, DJANGO_SUPERUSER_EMAIL, and DJANGO_SUPERUSER_PASSWORD")
            return

        # Check if a superuser with the given username already exists
        if not User.objects.filter(username=username).exists():
            # Create a new superuser
            User.objects.create_superuser(username, email, password)
            print('Superuser created successfully.')
        else:
            print('Superuser already exists.')

    except Exception as e:
        print('An error occurred:', str(e))

if __name__ == '__main__':
    create_superuser()

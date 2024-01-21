from django.contrib import admin

# Register your models here.
from .models import Conversation, Message, Call

admin.site.register(Conversation)
admin.site.register(Message)
admin.site.register(Call)

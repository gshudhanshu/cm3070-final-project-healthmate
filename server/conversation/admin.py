from django.contrib import admin
from django import forms


# Register your models here.
from .models import Conversation, Message, Call, Attachment
from django.contrib.auth import get_user_model

# Get the User model
User = get_user_model()

# Define a custom form for Conversation admin
class ConversationAdminForm(forms.ModelForm):
    class Meta:
        model = Conversation
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(ConversationAdminForm, self).__init__(*args, **kwargs)
        # Filter the queryset for patients and doctors based on their account type
        self.fields['patient'].queryset = User.objects.filter(account_type='patient')
        self.fields['doctor'].queryset = User.objects.filter(account_type='doctor')


# Register models and customize admin interface
admin.site.register(Attachment)
admin.site.register(Call)


# Define AttachmentInline class for Message admin
class AttachmentInline(admin.TabularInline):
    model = Attachment
    extra = 1  
    
# Register MessageAdmin to customize its display in admin panel
@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['text', 'sender', 'timestamp', 'conversation']  
    inlines = [AttachmentInline]

# Register ConversationAdmin to customize its form using ConversationAdminForm
@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    form = ConversationAdminForm

from django.contrib import admin
from django import forms


# Register your models here.
from .models import Conversation, Message, Call, Attachment
from django.contrib.auth import get_user_model
User = get_user_model()


class ConversationAdminForm(forms.ModelForm):
    class Meta:
        model = Conversation
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super(ConversationAdminForm, self).__init__(*args, **kwargs)
        self.fields['patient'].queryset = User.objects.filter(account_type='patient')
        self.fields['doctor'].queryset = User.objects.filter(account_type='doctor')


admin.site.register(Attachment)
admin.site.register(Call)

class AttachmentInline(admin.TabularInline):
    model = Attachment
    extra = 1  

@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):
    list_display = ['text', 'sender', 'timestamp', 'conversation']  
    inlines = [AttachmentInline]


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):
    form = ConversationAdminForm

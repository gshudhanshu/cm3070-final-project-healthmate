"""
URL configuration for server project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.urls import include, path, re_path
from django.contrib import admin
from rest_framework import permissions
# from drf_yasg.views import get_schema_view
# from drf_yasg import openapi
from drf_spectacular.views import SpectacularAPIView, SpectacularRedocView, SpectacularSwaggerView

from django.conf import settings
from django.conf.urls.static import static



# schema_view = get_schema_view(
#    openapi.Info(
#       title="Server API",
#       default_version='v1',
#       description="API Explorer for Server",
#       terms_of_service="https://www.google.com/policies/terms/",
#       contact=openapi.Contact(email="google@google.com"),
#       license=openapi.License(name="BSD License"),
#    ),
#    public=True,
#    permission_classes=(permissions.AllowAny,),
# )

# urlpatterns = [
#    re_path(r'^swagger(?P<format>\.json|\.yaml)$', schema_view.without_ui(cache_timeout=0), name='schema-json'),  # Updated URL pattern
#    re_path(r'^swagger/$', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),  # Updated URL pattern
#    re_path(r'^redoc/$', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),  # Updated URL pattern
# ]

urlpatterns = [
    # YOUR PATTERNS
    path('swagger/schema/', SpectacularAPIView.as_view(), name='schema'),
    # Optional UI:
    path('swagger/schema/swagger-ui/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('swagger/schema/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),
]


urlpatterns += [
    path('api/user_profile/', include('user_profile.urls')),
    path('api/appointments/', include('appointment.urls')),
    path('api/conversations/', include('conversation.urls')),
    path('api/medical_records/', include('medical_record.urls')),
    path('api/notifications/', include('notification.urls')),
    # Admin endpoint
    path('admin/', admin.site.urls),
    # Auth endpoints
    re_path(r'^api/auth/', include('djoser.urls')),
    re_path(r'^api/auth/', include('djoser.urls.jwt')),
]

# Media files 
urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

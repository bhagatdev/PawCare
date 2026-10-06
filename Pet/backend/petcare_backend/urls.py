from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),
    
    # Authentication endpoints
    path('api/auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    # Feature Modules
    path('api/accounts/', include('apps.accounts.urls')),
    path('api/appointments/', include('apps.appointments.urls')),
    path('api/pharmacy/', include('apps.pharmacy.urls')),
    path('api/community/', include('apps.community.urls')),
    path('', include('apps.core_petcare.urls')),
    path('', include('apps.symptom_checker.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

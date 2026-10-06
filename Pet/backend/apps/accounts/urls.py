from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    CustomLoginView,
    RegisterView,
    ProfileView,
)

urlpatterns = [
    path('login/', CustomLoginView.as_view(), name='custom_jwt_login'),
    path('register/', RegisterView.as_view(), name='custom_register'),
    path('me/', ProfileView.as_view(), name='user_profile'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]

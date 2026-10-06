from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from .models import User
from .serializers import (
    CustomTokenObtainPairSerializer,
    UserRegistrationSerializer,
    UserProfileSerializer,
)

class CustomLoginView(TokenObtainPairView):
    """
    POST /api/auth/login/
    Accepts: { "email": "...", "password": "..." }
    Returns: { "access": "...", "refresh": "...", "user": { "role": "PET_OWNER", ... } }
    """
    serializer_class = CustomTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    """
    POST /api/accounts/register/
    Accepts customized fields based on role:
    - PET_OWNER: email, password, first_name, last_name, phone_number, city
    - VETERINARIAN: + vci_registration_number, clinic_name
    - PHARMACY_ADMIN: + gstin_number, pharmacy_name
    """
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Generate tokens directly upon registration so the user is logged in immediately
        token_serializer = CustomTokenObtainPairSerializer()
        token = token_serializer.get_token(user)

        return Response({
            "message": "Account created and verified successfully.",
            "access": str(token.access_token),
            "refresh": str(token),
            "user": {
                "id": user.id,
                "email": user.email,
                "full_name": user.get_full_name() or user.username,
                "role": user.role,
                "phone_number": user.phone_number,
                "city": user.city,
                "is_verified": user.is_verified,
            }
        }, status=status.HTTP_201_CREATED)


class ProfileView(generics.RetrieveUpdateAPIView):
    """
    GET /api/accounts/me/
    PUT /api/accounts/me/
    """
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = UserProfileSerializer

    def get_object(self):
        return self.request.user

from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from .models import User, Pet, HealthRecord

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    """
    Custom JWT Serializer returning JWT tokens along with role and localized profile details.
    """
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        # Add custom claims to the JWT payload
        token['role'] = user.role
        token['email'] = user.email
        token['full_name'] = user.get_full_name() or user.username
        token['phone_number'] = user.phone_number
        token['is_verified'] = user.is_verified
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'email': self.user.email,
            'full_name': self.user.get_full_name() or self.user.username,
            'role': self.user.role,
            'phone_number': self.user.phone_number,
            'city': self.user.city,
            'is_verified': self.user.is_verified,
            'clinic_name': self.user.clinic_name,
            'pharmacy_name': self.user.pharmacy_name,
        }
        return data


class UserRegistrationSerializer(serializers.ModelSerializer):
    """
    Registration serializer for Indian Pet Parents, Doctors, and Pharmacy Admins.
    """
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = (
            'id', 'email', 'username', 'password', 'first_name', 'last_name',
            'role', 'phone_number', 'city', 'vci_registration_number',
            'clinic_name', 'gstin_number', 'pharmacy_name'
        )

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("An account with this email address is already registered.")
        return value.lower()

    def create(self, validated_data):
        username = validated_data.get('username') or validated_data['email'].split('@')[0]
        user = User.objects.create_user(
            username=username,
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=validated_data.get('role', 'PET_OWNER'),
            phone_number=validated_data.get('phone_number', ''),
            city=validated_data.get('city', 'Bengaluru'),
            vci_registration_number=validated_data.get('vci_registration_number', ''),
            clinic_name=validated_data.get('clinic_name', ''),
            gstin_number=validated_data.get('gstin_number', ''),
            pharmacy_name=validated_data.get('pharmacy_name', ''),
            is_verified=True
        )
        return user


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = (
            'id', 'email', 'username', 'first_name', 'last_name',
            'role', 'phone_number', 'city', 'vci_registration_number',
            'clinic_name', 'gstin_number', 'pharmacy_name', 'is_verified', 'created_at'
        )
        read_only_fields = ('id', 'email', 'is_verified', 'created_at')


class HealthRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = HealthRecord
        fields = '__all__'
        read_only_fields = ('id', 'created_at')


class PetSerializer(serializers.ModelSerializer):
    health_records = HealthRecordSerializer(many=True, read_only=True)
    owner_name = serializers.CharField(source='owner.get_full_name', read_only=True)

    class Meta:
        model = Pet
        fields = (
            'id', 'owner', 'owner_name', 'name', 'species', 'breed',
            'birth_date', 'gender', 'weight_kg', 'microchip_id',
            'allergies', 'photo', 'health_records', 'created_at'
        )
        read_only_fields = ('id', 'owner', 'created_at')

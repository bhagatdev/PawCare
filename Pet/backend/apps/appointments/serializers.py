from rest_framework import serializers
from .models import VeterinarianProfile, AvailabilitySlot, Appointment
from apps.accounts.serializers import UserProfileSerializer, PetSerializer

class AvailabilitySlotSerializer(serializers.ModelSerializer):
    class Meta:
        model = AvailabilitySlot
        fields = '__all__'


class VeterinarianProfileSerializer(serializers.ModelSerializer):
    doctor_name = serializers.CharField(source='user.get_full_name', read_only=True)
    doctor_email = serializers.EmailField(source='user.email', read_only=True)
    doctor_phone = serializers.CharField(source='user.phone', read_only=True)
    doctor_avatar = serializers.ImageField(source='user.avatar', read_only=True)
    available_slots = serializers.SerializerMethodField()

    class Meta:
        model = VeterinarianProfile
        fields = (
            'id', 'user', 'doctor_name', 'doctor_email', 'doctor_phone', 'doctor_avatar',
            'license_number', 'specialization', 'clinic_name', 'clinic_address',
            'experience_years', 'consultation_fee', 'rating', 'total_reviews',
            'bio', 'is_verified', 'available_for_virtual', 'available_for_in_person',
            'available_slots'
        )

    def get_available_slots(self, obj):
        open_slots = obj.availability_slots.filter(is_booked=False)
        return AvailabilitySlotSerializer(open_slots, many=True).data


class AppointmentSerializer(serializers.ModelSerializer):
    pet_details = PetSerializer(source='pet', read_only=True)
    vet_name = serializers.CharField(source='veterinarian.user.get_full_name', read_only=True)
    clinic_name = serializers.CharField(source='veterinarian.clinic_name', read_only=True)

    class Meta:
        model = Appointment
        fields = '__all__'
        read_only_fields = ('id', 'pet_owner', 'status', 'created_at', 'video_call_link', 'diagnosis_notes')

    def create(self, validated_data):
        slot = validated_data.get('slot')
        if slot:
            if slot.is_booked:
                raise serializers.ValidationError({"slot": "This slot is already booked."})
            slot.is_booked = True
            slot.save()
            
        validated_data['pet_owner'] = self.context['request'].user
        validated_data['fee_amount'] = validated_data['veterinarian'].consultation_fee
        return super().create(validated_data)

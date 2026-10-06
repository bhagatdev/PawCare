from rest_framework import serializers
from .models import PetProfile, Medicine, Appointment, UploadedPrescription, Order, OrderItem

class PetProfileSerializer(serializers.ModelSerializer):
    owner_username = serializers.ReadOnlyField(source='owner.username')
    owner_email = serializers.ReadOnlyField(source='owner.email')

    class Meta:
        model = PetProfile
        fields = [
            'id',
            'owner',
            'owner_name',
            'owner_username',
            'owner_email',
            'pet_name',
            'species',
            'breed',
            'age',
            'weight_kg',
            'next_vaccination_date',
            'image_url',
            'created_at',
        ]


class MedicineSerializer(serializers.ModelSerializer):
    price = serializers.DecimalField(source='price_inr', max_digits=10, decimal_places=2, read_only=True)
    stock_quantity = serializers.IntegerField(source='stock', read_only=True)

    class Meta:
        model = Medicine
        fields = [
            'id',
            'name',
            'brand',
            'price_inr',
            'price',
            'stock',
            'stock_quantity',
            'category',
            'image_url',
            'description',
            'created_at',
        ]


class AppointmentSerializer(serializers.ModelSerializer):
    pet_name = serializers.ReadOnlyField(source='pet.pet_name')
    pet_species = serializers.ReadOnlyField(source='pet.species')
    pet_breed = serializers.ReadOnlyField(source='pet.breed')
    owner_name = serializers.ReadOnlyField(source='pet.owner_name')
    vet_display = serializers.SerializerMethodField()

    class Meta:
        model = Appointment
        fields = [
            'id',
            'pet',
            'pet_name',
            'pet_species',
            'pet_breed',
            'owner_name',
            'vet',
            'vet_name',
            'vet_display',
            'date',
            'time',
            'reason_for_visit',
            'status',
            'video_url',
            'created_at',
        ]

    def get_vet_display(self, obj):
        if obj.vet:
            return f"Dr. {obj.vet.get_full_name() or obj.vet.username}"
        return obj.vet_name


class UploadedPrescriptionSerializer(serializers.ModelSerializer):
    user_name = serializers.ReadOnlyField(source='user.get_full_name')

    class Meta:
        model = UploadedPrescription
        fields = [
            'id',
            'user',
            'user_name',
            'prescription_file',
            'pet_name',
            'doctor_name',
            'status',
            'admin_notes',
            'uploaded_at',
        ]
        read_only_fields = ['id', 'user', 'uploaded_at']


class OrderItemSerializer(serializers.ModelSerializer):
    medicine_name = serializers.ReadOnlyField(source='medicine.name')
    medicine_image = serializers.ReadOnlyField(source='medicine.image_url')

    class Meta:
        model = OrderItem
        fields = ['id', 'medicine', 'medicine_name', 'medicine_image', 'quantity', 'price_at_purchase']


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user_name = serializers.ReadOnlyField(source='user.get_full_name')

    class Meta:
        model = Order
        fields = [
            'id',
            'user',
            'user_name',
            'status',
            'payment_status',
            'total_amount_inr',
            'delivery_zone',
            'shipping_address',
            'razorpay_order_id',
            'razorpay_payment_id',
            'items',
            'created_at',
        ]
        read_only_fields = ['id', 'user', 'created_at']

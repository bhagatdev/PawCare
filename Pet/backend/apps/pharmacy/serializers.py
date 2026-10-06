from rest_framework import serializers
from .models import ProductCategory, Product, Prescription, Order, OrderItem

class ProductCategorySerializer(serializers.ModelSerializer):
    product_count = serializers.IntegerField(source='products.count', read_only=True)

    class Meta:
        model = ProductCategory
        fields = '__all__'


class ProductSerializer(serializers.ModelSerializer):
    category_name = serializers.CharField(source='category.name', read_only=True)

    class Meta:
        model = Product
        fields = '__all__'


class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = '__all__'
        read_only_fields = ('id', 'user', 'status', 'verification_notes', 'uploaded_at')


class OrderItemSerializer(serializers.ModelSerializer):
    product_name = serializers.CharField(source='product.name', read_only=True)
    product_image = serializers.ImageField(source='product.image', read_only=True)

    class Meta:
        model = OrderItem
        fields = ('id', 'product', 'product_name', 'product_image', 'quantity', 'price_at_purchase')


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    order_items_data = serializers.ListField(
        child=serializers.DictField(), write_only=True, required=True
    )

    class Meta:
        model = Order
        fields = (
            'id', 'user', 'prescription', 'status', 'payment_status',
            'total_amount', 'shipping_address', 'shipping_city',
            'shipping_postal_code', 'tracking_number', 'created_at',
            'items', 'order_items_data'
        )
        read_only_fields = ('id', 'user', 'status', 'payment_status', 'created_at', 'tracking_number')

    def create(self, validated_data):
        items_data = validated_data.pop('order_items_data')
        user = self.context['request'].user
        validated_data['user'] = user

        # Calculate or verify total amount
        calculated_total = 0
        order_items_to_create = []

        for item_info in items_data:
            product = Product.objects.get(id=item_info['product_id'])
            quantity = int(item_info.get('quantity', 1))
            price = product.discount_price if product.discount_price else product.price
            calculated_total += (price * quantity)
            order_items_to_create.append({
                'product': product,
                'quantity': quantity,
                'price_at_purchase': price
            })

        validated_data['total_amount'] = calculated_total
        order = Order.objects.create(**validated_data)

        for item in order_items_to_create:
            OrderItem.objects.create(
                order=order,
                product=item['product'],
                quantity=item['quantity'],
                price_at_purchase=item['price_at_purchase']
            )

        return order

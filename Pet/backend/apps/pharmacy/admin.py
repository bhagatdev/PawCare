from django.contrib import admin
from .models import ProductCategory, Product, Prescription, Order, OrderItem

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(ProductCategory)
class ProductCategoryAdmin(admin.ModelAdmin):
    list_display = ('name', 'slug')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ('name', 'category', 'price', 'discount_price', 'stock_quantity', 'requires_prescription', 'rating', 'is_active')
    list_filter = ('category', 'requires_prescription', 'is_active')
    search_fields = ('name', 'brand', 'description')
    prepopulated_fields = {'slug': ('name',)}

@admin.register(Prescription)
class PrescriptionAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'pet', 'vet_name', 'status', 'uploaded_at')
    list_filter = ('status', 'uploaded_at')
    search_fields = ('user__email', 'vet_name')

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ('id', 'user', 'status', 'payment_status', 'total_amount', 'created_at')
    list_filter = ('status', 'payment_status', 'created_at')
    search_fields = ('user__email', 'shipping_address', 'tracking_number')
    inlines = [OrderItemInline]

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User, Pet, HealthRecord

@admin.register(User)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('PetCare Info', {'fields': ('role', 'phone', 'avatar', 'address', 'city')}),
    )
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_superuser')

@admin.register(Pet)
class PetAdmin(admin.ModelAdmin):
    list_display = ('name', 'species', 'breed', 'owner', 'gender', 'weight_kg', 'created_at')
    list_filter = ('species', 'gender')
    search_fields = ('name', 'breed', 'owner__username', 'owner__email')

@admin.register(HealthRecord)
class HealthRecordAdmin(admin.ModelAdmin):
    list_display = ('pet', 'record_type', 'title', 'vet_name', 'record_date')
    list_filter = ('record_type', 'record_date')
    search_fields = ('title', 'diagnosis', 'pet__name')

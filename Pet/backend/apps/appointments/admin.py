from django.contrib import admin
from .models import VeterinarianProfile, AvailabilitySlot, Appointment

@admin.register(VeterinarianProfile)
class VeterinarianProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'specialization', 'clinic_name', 'experience_years', 'consultation_fee', 'rating', 'is_verified')
    list_filter = ('is_verified', 'available_for_virtual', 'available_for_in_person')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'specialization', 'clinic_name')

@admin.register(AvailabilitySlot)
class AvailabilitySlotAdmin(admin.ModelAdmin):
    list_display = ('veterinarian', 'date', 'start_time', 'end_time', 'is_booked')
    list_filter = ('date', 'is_booked')

@admin.register(Appointment)
class AppointmentAdmin(admin.ModelAdmin):
    list_display = ('id', 'pet', 'pet_owner', 'veterinarian', 'appointment_type', 'status', 'scheduled_date', 'scheduled_time', 'is_paid')
    list_filter = ('status', 'appointment_type', 'is_paid', 'scheduled_date')
    search_fields = ('pet__name', 'pet_owner__email', 'veterinarian__user__last_name')

from django.db import models
from django.conf import settings
from apps.accounts.models import Pet

class VeterinarianProfile(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='vet_profile')
    license_number = models.CharField(max_length=50, unique=True)
    specialization = models.CharField(max_length=150, help_text="e.g., Canine Surgery, Feline Dermatology, General Wellness")
    clinic_name = models.CharField(max_length=150)
    clinic_address = models.TextField()
    experience_years = models.PositiveIntegerField(default=1)
    consultation_fee = models.DecimalField(max_digits=8, decimal_places=2, default=50.00)
    rating = models.DecimalField(max_digits=3, decimal_places=2, default=5.00)
    total_reviews = models.PositiveIntegerField(default=0)
    bio = models.TextField(blank=True)
    is_verified = models.BooleanField(default=False)
    available_for_virtual = models.BooleanField(default=True)
    available_for_in_person = models.BooleanField(default=True)

    def __str__(self):
        return f"Dr. {self.user.get_full_name() or self.user.username} - {self.specialization}"


class AvailabilitySlot(models.Model):
    veterinarian = models.ForeignKey(VeterinarianProfile, on_delete=models.CASCADE, related_name='availability_slots')
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    is_booked = models.BooleanField(default=False)

    class Meta:
        ordering = ['date', 'start_time']
        unique_together = ('veterinarian', 'date', 'start_time')

    def __str__(self):
        return f"{self.veterinarian.clinic_name} | {self.date} {self.start_time} - {self.end_time} ({'Booked' if self.is_booked else 'Open'})"


class Appointment(models.Model):
    TYPE_CHOICES = (
        ('virtual', 'Virtual Tele-consultation'),
        ('in_person', 'In-Person Clinic Visit'),
    )
    STATUS_CHOICES = (
        ('pending', 'Pending Confirmation'),
        ('confirmed', 'Confirmed'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    pet_owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='booked_appointments')
    veterinarian = models.ForeignKey(VeterinarianProfile, on_delete=models.CASCADE, related_name='appointments')
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='appointments')
    slot = models.OneToOneField(AvailabilitySlot, on_delete=models.SET_NULL, null=True, blank=True, related_name='appointment')
    appointment_type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='virtual')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    scheduled_date = models.DateField()
    scheduled_time = models.TimeField()
    reason_for_visit = models.TextField()
    video_call_link = models.URLField(blank=True, null=True)
    diagnosis_notes = models.TextField(blank=True)
    fee_amount = models.DecimalField(max_digits=8, decimal_places=2)
    is_paid = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Appointment for {self.pet.name} with {self.veterinarian.user.get_full_name()} on {self.scheduled_date}"

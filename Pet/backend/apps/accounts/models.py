from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import RegexValidator

# Indian 10-digit mobile number validator (starts with 6, 7, 8, or 9)
indian_phone_validator = RegexValidator(
    regex=r'^[6-9]\d{9}$',
    message="Enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9."
)

class User(AbstractUser):
    """
    Custom User Model for Indian Pet Healthcare & Pharmacy Platform.
    Supports 4 distinct roles, Indian mobile verification, and statutory IDs (VCI, GSTIN).
    """
    ROLE_CHOICES = (
        ('PET_OWNER', 'Pet Owner / Pet Parent'),
        ('VETERINARIAN', 'Licensed Veterinarian (Doctor)'),
        ('PHARMACY_ADMIN', 'Pharmacy Retailer / Dispensary Admin'),
        ('SYSTEM_ADMIN', 'System Administrator / Superuser'),
    )

    email = models.EmailField(unique=True, error_messages={'unique': 'An account with this email already exists.'})
    role = models.CharField(max_length=25, choices=ROLE_CHOICES, default='PET_OWNER')
    phone_number = models.CharField(
        max_length=10,
        validators=[indian_phone_validator],
        help_text="10-digit Indian mobile number (e.g., 9876543210)",
        blank=True,
        null=True
    )
    is_verified = models.BooleanField(default=False, help_text="Mobile OTP / VCI statutory credential verified")

    # Statutory fields for Indian Veterinarians
    vci_registration_number = models.CharField(
        max_length=50,
        blank=True,
        null=True,
        help_text="Veterinary Council of India (VCI) / State Vet Council Reg No."
    )
    clinic_name = models.CharField(max_length=200, blank=True, null=True, help_text="Clinic / Hospital Name")

    # Statutory fields for Indian Pharmacies
    gstin_number = models.CharField(
        max_length=15,
        blank=True,
        null=True,
        help_text="15-digit GSTIN (Goods & Services Tax Identification Number)"
    )
    pharmacy_name = models.CharField(max_length=200, blank=True, null=True, help_text="Registered Medical Store Name")

    city = models.CharField(max_length=100, blank=True, default='Bengaluru', help_text="e.g. Bengaluru, Mumbai, Delhi-NCR, Pune, Hyderabad")
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.get_full_name() or self.username} [{self.get_role_display()}] - +91 {self.phone_number or 'N/A'}"


class Pet(models.Model):
    SPECIES_CHOICES = (
        ('dog', 'Dog'),
        ('cat', 'Cat'),
        ('bird', 'Bird'),
        ('rabbit', 'Rabbit'),
        ('other', 'Other'),
    )
    GENDER_CHOICES = (
        ('male', 'Male'),
        ('female', 'Female'),
    )
    owner = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pets')
    name = models.CharField(max_length=100)
    species = models.CharField(max_length=20, choices=SPECIES_CHOICES, default='dog')
    breed = models.CharField(max_length=100, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=10, choices=GENDER_CHOICES, default='male')
    weight_kg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    microchip_id = models.CharField(max_length=100, blank=True, null=True)
    allergies = models.TextField(blank=True, default='')
    photo = models.ImageField(upload_to='pets/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.breed} - {self.owner.username})"


class HealthRecord(models.Model):
    RECORD_TYPES = (
        ('vaccination', 'Vaccination'),
        ('surgery', 'Surgery'),
        ('medication', 'Medication'),
        ('allergy', 'Allergy Record'),
        ('general', 'General Checkup'),
    )
    pet = models.ForeignKey(Pet, on_delete=models.CASCADE, related_name='health_records')
    record_type = models.CharField(max_length=30, choices=RECORD_TYPES, default='general')
    title = models.CharField(max_length=200)
    diagnosis = models.TextField(blank=True)
    treatment = models.TextField(blank=True)
    vet_name = models.CharField(max_length=150, blank=True)
    record_date = models.DateField()
    attachment = models.FileField(upload_to='health_records/', blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.pet.name} - {self.title} ({self.record_date})"

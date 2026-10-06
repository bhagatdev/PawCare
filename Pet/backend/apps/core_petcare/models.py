from django.db import models
from django.conf import settings
from apps.accounts.models import User as CustomUser

class PetProfile(models.Model):
    """
    Pet Profile model storing pet identity and linking to the Pet Owner (User).
    """
    SPECIES_CHOICES = (
        ('Dog', 'Dog'),
        ('Cat', 'Cat'),
        ('Bird', 'Bird'),
        ('Other', 'Other'),
    )

    owner = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='pet_profiles',
        null=True,
        blank=True,
        help_text="Linked Pet Owner Account"
    )
    owner_name = models.CharField(max_length=150, blank=True, help_text="Pet Parent Name")
    pet_name = models.CharField(max_length=100)
    species = models.CharField(max_length=50, choices=SPECIES_CHOICES, default='Dog')
    breed = models.CharField(max_length=100, blank=True)
    age = models.PositiveIntegerField(help_text="Age in years", default=1)
    weight_kg = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    next_vaccination_date = models.DateField(null=True, blank=True, help_text="Upcoming vaccination date")
    image_url = models.URLField(max_length=500, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.owner and not self.owner_name:
            self.owner_name = self.owner.get_full_name() or self.owner.username
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.pet_name} ({self.species} - {self.breed}) - Parent: {self.owner_name}"


class Medicine(models.Model):
    """
    Medicine catalog item storing name, brand, price in INR (₹), stock, category, image, and description.
    """
    CATEGORY_CHOICES = (
        ('Supplements', 'Supplements'),
        ('First Aid', 'First Aid'),
        ('Antibiotics', 'Antibiotics'),
        ('Grooming', 'Grooming'),
        ('Nutrition', 'Nutrition & Diet'),
        ('General', 'General'),
    )

    name = models.CharField(max_length=250)
    brand = models.CharField(max_length=150, blank=True, default='Himalaya Animal Health', help_text="Pharmaceutical Manufacturer")
    price_inr = models.DecimalField(max_digits=10, decimal_places=2, default=0.00, help_text="Price in INR (₹)")
    stock = models.PositiveIntegerField(default=0, help_text="Available inventory units")
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES, default='General')
    image_url = models.URLField(max_length=500, blank=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def price(self):
        return self.price_inr

    @property
    def stock_quantity(self):
        return self.stock

    def __str__(self):
        return f"{self.name} ({self.category}) - ₹{self.price_inr} [Stock: {self.stock}]"


class Appointment(models.Model):
    """
    Veterinary consultation appointment linking Pet, Vet Doctor, Date/Time, Status, and Video_URL.
    """
    STATUS_CHOICES = (
        ('Waiting', 'Waiting'),
        ('In Consultation', 'In Consultation'),
        ('Completed', 'Completed'),
        ('Cancelled', 'Cancelled'),
        ('Pending', 'Pending'),
        ('Confirmed', 'Confirmed'),
    )

    pet = models.ForeignKey(PetProfile, on_delete=models.CASCADE, related_name='appointments')
    vet = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='doctor_appointments',
        help_text="Assigned Veterinarian"
    )
    vet_name = models.CharField(
        max_length=150,
        blank=True,
        default='Dr. Anjali Sharma (B.V.Sc & A.H)',
        help_text="Doctor Display Name"
    )
    date = models.DateField()
    time = models.TimeField()
    reason_for_visit = models.TextField(blank=True)
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Waiting')
    video_url = models.URLField(
        max_length=500,
        blank=True,
        null=True,
        help_text="Encrypted WebRTC Telehealth Room URL"
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if self.vet and not self.vet_name:
            self.vet_name = f"Dr. {self.vet.get_full_name() or self.vet.username}"
        if not self.video_url and self.id:
            self.video_url = f"https://telehealth.pawcare.in/room/vet-jsr-{self.id}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Appointment for {self.pet.pet_name} with {self.vet_name} on {self.date} at {self.time} ({self.status})"


class UploadedPrescription(models.Model):
    """
    External prescriptions uploaded by users (PDF/JPG) for pharmacy verification and dispatch.
    """
    STATUS_CHOICES = (
        ('Pending Verification', 'Pending Verification'),
        ('Verified by Pharmacist', 'Verified by Pharmacist'),
        ('Medicines Dispatched', 'Medicines Dispatched'),
        ('Rejected', 'Rejected / Invalid Rx'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='uploaded_prescriptions'
    )
    prescription_file = models.FileField(upload_to='prescriptions/', blank=True, null=True)
    pet_name = models.CharField(max_length=100, blank=True, default='')
    doctor_name = models.CharField(max_length=150, blank=True, default='')
    status = models.CharField(max_length=35, choices=STATUS_CHOICES, default='Pending Verification')
    admin_notes = models.TextField(blank=True, default='')
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Prescription #{self.id} for {self.user.username} - {self.status}"


class Order(models.Model):
    """
    E-commerce order tracking for veterinary medicines dispatched across Jamshedpur zones.
    """
    STATUS_CHOICES = (
        ('Placed', 'Order Placed'),
        ('Processing', 'Pharmacy Dispense & Cold-Box Packing'),
        ('Dispatched', 'Out for Delivery'),
        ('Delivered', 'Delivered to Doorstep'),
        ('Cancelled', 'Cancelled'),
    )
    PAYMENT_CHOICES = (
        ('Pending', 'Pending'),
        ('Paid', 'Paid via Razorpay'),
        ('COD', 'Cash on Delivery'),
        ('Failed', 'Failed'),
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='petcare_orders'
    )
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='Placed')
    payment_status = models.CharField(max_length=20, choices=PAYMENT_CHOICES, default='Paid')
    total_amount_inr = models.DecimalField(max_digits=10, decimal_places=2, help_text="Total in INR (₹)")
    delivery_zone = models.CharField(
        max_length=150,
        default='Bistupur Hub -> Sakchi Market',
        help_text="Jamshedpur Delivery Zone"
    )
    shipping_address = models.TextField(default='Main Road, Bistupur, Jamshedpur, Jharkhand')
    razorpay_order_id = models.CharField(max_length=100, blank=True, null=True)
    razorpay_payment_id = models.CharField(max_length=100, blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Order #{self.id} ({self.status}) - ₹{self.total_amount_inr} [{self.delivery_zone}]"


class OrderItem(models.Model):
    """
    Individual medicine item line in an Order.
    """
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='items')
    medicine = models.ForeignKey(Medicine, on_delete=models.CASCADE, related_name='order_items')
    quantity = models.PositiveIntegerField(default=1)
    price_at_purchase = models.DecimalField(max_digits=10, decimal_places=2, help_text="Price in INR (₹) at checkout")

    def __str__(self):
        return f"{self.quantity}x {self.medicine.name} @ ₹{self.price_at_purchase}"

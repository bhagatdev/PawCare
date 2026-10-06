import os
import json
from rest_framework import viewsets, permissions, filters, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from .models import PetProfile, Medicine, Appointment, UploadedPrescription, Order, OrderItem
from .serializers import (
    PetProfileSerializer,
    MedicineSerializer,
    AppointmentSerializer,
    UploadedPrescriptionSerializer,
    OrderSerializer,
)
from .filters import MedicineFilter


class PetProfileViewSet(viewsets.ModelViewSet):
    queryset = PetProfile.objects.all().order_by('-created_at')
    serializer_class = PetProfileSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def perform_create(self, serializer):
        if self.request.user.is_authenticated:
            serializer.save(
                owner=self.request.user,
                owner_name=self.request.user.get_full_name() or self.request.user.username
            )
        else:
            serializer.save()


class MedicineViewSet(viewsets.ModelViewSet):
    queryset = Medicine.objects.all().order_by('name')
    serializer_class = MedicineSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = MedicineFilter
    search_fields = ['name', 'category', 'description']
    ordering_fields = ['price_inr', 'name', 'stock', 'created_at']
    ordering = ['name']


class AppointmentViewSet(viewsets.ModelViewSet):
    queryset = Appointment.objects.all().select_related('pet', 'vet').order_by('-date', '-time')
    serializer_class = AppointmentSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'date', 'pet', 'vet']
    search_fields = ['pet__pet_name', 'vet_name', 'reason_for_visit']
    ordering_fields = ['date', 'time', 'status', 'created_at']


class UploadedPrescriptionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for handling external prescription uploads (PDF/JPG) using MultiPartParser.
    """
    queryset = UploadedPrescription.objects.all().select_related('user').order_by('-uploaded_at')
    serializer_class = UploadedPrescriptionSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'user']
    search_fields = ['pet_name', 'doctor_name', 'admin_notes']

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        if not user:
            from apps.accounts.models import User
            user = User.objects.filter(role='PET_OWNER').first() or User.objects.first()
        serializer.save(user=user)


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all().prefetch_related('items__medicine').order_by('-created_at')
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['status', 'payment_status', 'delivery_zone']
    search_fields = ['id', 'delivery_zone', 'shipping_address', 'razorpay_order_id']

    def perform_create(self, serializer):
        user = self.request.user if self.request.user.is_authenticated else None
        if not user:
            from apps.accounts.models import User
            user = User.objects.filter(role='PET_OWNER').first() or User.objects.first()
        serializer.save(user=user)


class MLPredictiveSymptomTriageView(APIView):
    """
    Predictive ML Symptom Triage Endpoint.
    Analyzes pet symptoms using clinical heuristics and natural language parsing.
    Returns triage level, red flags, mandatory Indian clinical disclaimer, and 'Book Vet Now' CTA.
    """
    permission_classes = [permissions.AllowAny]

    MANDATORY_DISCLAIMER = (
        "⚠️ MANDATORY MEDICAL DISCLAIMER: This AI/ML veterinary triage advice provides "
        "preliminary informational triage only and does not constitute a formal diagnosis or "
        "prescription under the Veterinary Council of India (VCI) regulations. Always consult a "
        "licensed veterinary surgeon immediately for physical evaluation."
    )

    def post(self, request):
        user_message = request.data.get('message', '').strip()
        pet_species = request.data.get('pet_species', 'Dog')
        pet_name = request.data.get('pet_name', 'your pet')

        if not user_message:
            return Response(
                {"error": "Please describe the symptoms your pet is experiencing."},
                status=status.HTTP_400_BAD_REQUEST
            )

        lower_msg = user_message.lower()

        urgency_score = 0
        red_flags = []
        possible_conditions = []

        if any(w in lower_msg for w in ['blood', 'cannot breathe', 'choking', 'pale gum', 'seizure', 'unresponsive', 'collapse', 'poison']):
            urgency_score += 90
            red_flags.append("Suspected Acute Emergency: Respiratory or systemic critical state.")
            triage_level = "CRITICAL / EMERGENCY"
            possible_conditions.extend(["Acute Anaphylaxis / Toxicity", "Severe Hypovolemia", "Upper Airway Obstruction"])
        elif any(w in lower_msg for w in ['vomit', 'diarrhea', 'loose motion', 'yellow bile', 'not eating', 'refusing food']):
            urgency_score += 60
            triage_level = "URGENT / VET VISIT RECOMMENDED"
            possible_conditions.extend(["Canine / Feline Gastroenteritis", "Dietary Indiscretion", "Potential Pancreatitis"])
            if 'blood' in lower_msg:
                red_flags.append("Hemorrhagic Gastroenteritis (Parvovirus risk in unvaccinated canines).")
        elif any(w in lower_msg for w in ['limp', 'paw', 'cannot walk', 'crying', 'whining', 'swollen']):
            urgency_score += 45
            triage_level = "MODERATE / MONITOR & EXAMINE"
            possible_conditions.extend(["Cruciate Ligament / Tendon Strain", "Foreign Body in Paw Pad", "Osteoarthritis Flare"])
        elif any(w in lower_msg for w in ['scratch', 'itch', 'ear shake', 'foul smell', 'red skin', 'tick', 'flea']):
            urgency_score += 30
            triage_level = "ROUTINE / CLINIC CONSULTATION"
            possible_conditions.extend(["Otitis Externa (Ear Infection)", "Allergic Dermatitis / Flea Bite Hypersensitivity"])
        else:
            urgency_score += 15
            triage_level = "MILD / GENERAL OBSERVATION"
            possible_conditions.extend(["Sub-clinical Malaise", "Mild Stress / Environmental Shift"])

        triage_report = {
            "pet_name": pet_name,
            "pet_species": pet_species,
            "symptom_summary": user_message,
            "triage_level": triage_level,
            "urgency_score": urgency_score,
            "possible_conditions": possible_conditions,
            "red_flags": red_flags if red_flags else ["None immediately detected, but continuous vital monitoring required."],
            "recommended_action": "Schedule a video consult with Dr. Anjali Sharma immediately." if urgency_score >= 45 else "Monitor hydration and book next available clinic slot.",
            "cta_button": {
                "text": "Book Vet Now with Dr. Anjali Sharma (Bistupur Hub)",
                "action": "open_telehealth_booking",
                "clinic_contact": "+91 657 242 1100"
            },
            "disclaimer": self.MANDATORY_DISCLAIMER
        }

        return Response(triage_report, status=status.HTTP_200_OK)

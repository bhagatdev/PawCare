from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    PetProfileViewSet,
    MedicineViewSet,
    AppointmentViewSet,
    UploadedPrescriptionViewSet,
    OrderViewSet,
    MLPredictiveSymptomTriageView,
)

router = DefaultRouter()
router.register(r'pets', PetProfileViewSet, basename='pet')
router.register(r'medicines', MedicineViewSet, basename='medicine')
router.register(r'appointments', AppointmentViewSet, basename='appointment')
router.register(r'prescriptions', UploadedPrescriptionViewSet, basename='prescription')
router.register(r'orders', OrderViewSet, basename='order')

urlpatterns = [
    path('api/', include(router.urls)),
    path('api/ml/symptom-triage/', MLPredictiveSymptomTriageView.as_view(), name='ml_symptom_triage'),
    path('api/ai-triage/', MLPredictiveSymptomTriageView.as_view(), name='ai_triage'),
]

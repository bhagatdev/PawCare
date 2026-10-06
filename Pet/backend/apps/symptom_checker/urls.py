from django.urls import path
from .views import SymptomCheckView

urlpatterns = [
    path('api/symptom_check/', SymptomCheckView.as_view(), name='symptom_check'),
]

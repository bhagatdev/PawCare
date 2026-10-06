from django.urls import path
from .views import (
    VeterinarianListView,
    VeterinarianDetailView,
    AppointmentListCreateView,
    AppointmentDetailView,
)

urlpatterns = [
    path('vets/', VeterinarianListView.as_view(), name='vet_list'),
    path('vets/<int:pk>/', VeterinarianDetailView.as_view(), name='vet_detail'),
    path('bookings/', AppointmentListCreateView.as_view(), name='appointment_list_create'),
    path('bookings/<int:pk>/', AppointmentDetailView.as_view(), name='appointment_detail'),
]

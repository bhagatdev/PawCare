from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from .models import VeterinarianProfile, AvailabilitySlot, Appointment
from .serializers import VeterinarianProfileSerializer, AvailabilitySlotSerializer, AppointmentSerializer

class VeterinarianListView(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = VeterinarianProfileSerializer

    def get_queryset(self):
        queryset = VeterinarianProfile.objects.all().select_related('user').prefetch_related('availability_slots')
        specialization = self.request.query_params.get('specialization')
        virtual = self.request.query_params.get('virtual')
        in_person = self.request.query_params.get('in_person')

        if specialization:
            queryset = queryset.filter(specialization__icontains=specialization)
        if virtual is not None:
            queryset = queryset.filter(available_for_virtual=True)
        if in_person is not None:
            queryset = queryset.filter(available_for_in_person=True)
        return queryset


class VeterinarianDetailView(generics.RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = VeterinarianProfileSerializer
    queryset = VeterinarianProfile.objects.all().select_related('user').prefetch_related('availability_slots')


class AppointmentListCreateView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'veterinarian' and hasattr(user, 'vet_profile'):
            return Appointment.objects.filter(veterinarian=user.vet_profile)
        return Appointment.objects.filter(pet_owner=user).select_related('veterinarian__user', 'pet')


class AppointmentDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = AppointmentSerializer

    def get_queryset(self):
        user = self.request.user
        if user.role == 'veterinarian' and hasattr(user, 'vet_profile'):
            return Appointment.objects.filter(veterinarian=user.vet_profile)
        return Appointment.objects.filter(pet_owner=user)

from rest_framework import generics, permissions, filters, status
from rest_framework.response import Response
from .models import ProductCategory, Product, Prescription, Order
from .serializers import (
    ProductCategorySerializer,
    ProductSerializer,
    PrescriptionSerializer,
    OrderSerializer,
)

class ProductCategoryListView(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer


class ProductListView(generics.ListAPIView):
    permission_classes = (permissions.AllowAny,)
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True).select_related('category')
        category_slug = self.request.query_params.get('category')
        search = self.request.query_params.get('search')
        prescription_only = self.request.query_params.get('rx')

        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        if search:
            queryset = queryset.filter(name__icontains=search) | queryset.filter(description__icontains=search)
        if prescription_only is not None:
            queryset = queryset.filter(requires_prescription=True)
        return queryset


class ProductDetailView(generics.RetrieveAPIView):
    permission_classes = (permissions.AllowAny,)
    queryset = Product.objects.filter(is_active=True).select_related('category')
    serializer_class = ProductSerializer


class PrescriptionListCreateView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = PrescriptionSerializer

    def get_queryset(self):
        return Prescription.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class OrderListCreateView(generics.ListCreateAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items__product')


class OrderDetailView(generics.RetrieveAPIView):
    permission_classes = (permissions.IsAuthenticated,)
    serializer_class = OrderSerializer

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related('items__product')

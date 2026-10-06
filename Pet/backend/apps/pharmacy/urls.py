from django.urls import path
from .views import (
    ProductCategoryListView,
    ProductListView,
    ProductDetailView,
    PrescriptionListCreateView,
    OrderListCreateView,
    OrderDetailView,
)

urlpatterns = [
    path('categories/', ProductCategoryListView.as_view(), name='category_list'),
    path('products/', ProductListView.as_view(), name='product_list'),
    path('products/<int:pk>/', ProductDetailView.as_view(), name='product_detail'),
    path('prescriptions/', PrescriptionListCreateView.as_view(), name='prescription_list_create'),
    path('orders/', OrderListCreateView.as_view(), name='order_list_create'),
    path('orders/<int:pk>/', OrderDetailView.as_view(), name='order_detail'),
]

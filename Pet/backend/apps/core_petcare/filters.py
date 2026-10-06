import django_filters
from .models import Medicine

class MedicineFilter(django_filters.FilterSet):
    """
    Custom FilterSet for Medicine catalog queries.
    Supports:
    - Exact/case-insensitive category filtering: ?category=Antibiotics
    - Price range filtering in INR: ?min_price=100&max_price=1500
    - Stock availability: ?in_stock=true
    """
    category = django_filters.CharFilter(field_name='category', lookup_expr='iexact')
    min_price = django_filters.NumberFilter(field_name='price_inr', lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name='price_inr', lookup_expr='lte')
    in_stock = django_filters.BooleanFilter(method='filter_in_stock')

    class Meta:
        model = Medicine
        fields = ['category', 'min_price', 'max_price', 'in_stock']

    def filter_in_stock(self, queryset, name, value):
        if value:
            return queryset.filter(stock__gt=0)
        return queryset

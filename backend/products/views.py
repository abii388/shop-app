from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Product
# from .permission import IsAdminOrReadOnly
from .serializers import ProductSerializer


@api_view(["GET"])
# @permission_classes([IsAdminOrReadOnly])
def product_list(request):
    products = Product.objects.all()
    search = request.query_params.get("search", "").strip()
    if search:
        products = products.filter(name__icontains=search)
    return Response(ProductSerializer(products, many=True).data)


@api_view(["GET"])
# @permission_classes([IsAdminOrReadOnly])
def product_detail(request, pk):
    product = get_object_or_404(Product, pk=pk)
    return Response(ProductSerializer(product).data)
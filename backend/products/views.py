from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response

from .models import Product
from .permissions import IsAdmin
from .serializers import ProductSerializer


@api_view(["GET"])
def product_list(request):
    products = Product.objects.all()
    search = request.query_params.get("search", "").strip()
    if search:
        products = products.filter(name__icontains=search)
    return Response(ProductSerializer(products, many=True).data)


@api_view(["GET"])
def product_detail(request, pk):
    product = get_object_or_404(Product, pk=pk)
    return Response(ProductSerializer(product).data)


@api_view(["POST"])
@permission_classes([IsAdmin])
def product_create(request):
    serializer = ProductSerializer(data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(["PUT"])
@permission_classes([IsAdmin])
def product_update(request, pk):
    product = get_object_or_404(Product, pk=pk)
    serializer = ProductSerializer(product, data=request.data)
    serializer.is_valid(raise_exception=True)
    serializer.save()
    return Response(serializer.data)


@api_view(["DELETE"])
@permission_classes([IsAdmin])
def product_delete(request, pk):
    product = get_object_or_404(Product, pk=pk)
    product.delete()
    return Response(status=status.HTTP_204_NO_CONTENT)
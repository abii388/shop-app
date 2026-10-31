from decimal import Decimal

from django.shortcuts import get_object_or_404
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from products.models import Product
from .models import CartItem
from .serializers import CartItemSerializer


def cart_data(user):
    items = CartItem.objects.filter(user=user).select_related("product").order_by("id")
    total = sum((i.product.price * i.quantity for i in items), Decimal("0"))
    return {
        "items": CartItemSerializer(items, many=True).data,
        "total": str(total),
        "count": sum(i.quantity for i in items),
    }


@api_view(["GET"])
def cart_list(request):
    return Response(cart_data(request.user))


@api_view(["POST"])
def cart_add(request):
    product_id = request.data.get("product_id")
    if not product_id:
        return Response(
            {"detail": "product_id is required."}, status=status.HTTP_400_BAD_REQUEST
        )
    try:
        quantity = int(request.data.get("quantity", 1))
    except (TypeError, ValueError):
        quantity = 0
    if quantity < 1:
        return Response(
            {"detail": "Quantity must be at least 1."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    product = get_object_or_404(Product, pk=product_id)
    item, created = CartItem.objects.get_or_create(
        user=request.user, product=product, defaults={"quantity": quantity}
    )
    if not created:
        item.quantity += quantity
        item.save()
    return Response(cart_data(request.user), status=status.HTTP_201_CREATED)


@api_view(["DELETE"])
def cart_remove(request, item_id):
    # Filtering by user means nobody can remove another user's item
    item = get_object_or_404(CartItem, pk=item_id, user=request.user)
    item.delete()
    return Response(cart_data(request.user))
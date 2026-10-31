from django.urls import path
from . import views

urlpatterns = [
    path("", views.cart_list),
    path("add/", views.cart_add),
    path("remove/<int:item_id>/", views.cart_remove),
]
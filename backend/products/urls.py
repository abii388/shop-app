from django.urls import path
from . import views

urlpatterns = [
    path("", views.product_list),
    path("create/", views.product_create),
    path("<int:pk>/", views.product_detail),
    path("<int:pk>/update/", views.product_update),
    path("<int:pk>/delete/", views.product_delete),
]
from django.core.management.base import BaseCommand
from products.models import Product

PRODUCTS = [
    ("iPhone 15 Smartphone", 69999, "6.1-inch display smartphone with a 48MP camera, A16 chip and all-day battery life."),
    ("Samsung Galaxy Phone", 54999, "AMOLED display smartphone with a triple camera setup and 5G support."),
    ("Fast Charger 65W", 1499, "65W USB-C fast charger with overheat and short-circuit protection."),
    ("Wireless Charger Pad", 1299, "15W Qi wireless charging pad with a non-slip surface and LED indicator."),
    ("Bluetooth Earbuds", 2499, "True wireless earbuds with noise reduction and 24-hour battery with case."),
    ("Power Bank 20000mAh", 1999, "High-capacity power bank with dual USB output and USB-C input."),
    ("Smart Watch", 3999, "Fitness smartwatch with heart rate monitor and 7-day battery life."),
    ("USB-C Cable 1m", 399, "Braided 1 metre USB-C cable supporting fast charging and data transfer."),
]


class Command(BaseCommand):
    help = "Add sample products"

    def handle(self, *args, **options):
        for name, price, description in PRODUCTS:
            Product.objects.get_or_create(
                name=name, defaults={"price": price, "description": description}
            )
        self.stdout.write(self.style.SUCCESS("Sample products ready"))
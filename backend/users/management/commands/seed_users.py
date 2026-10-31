from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand

USERS = [
    ("admin@shop.com", "admin123", True),
    ("user@shop.com", "user123", False),
]


class Command(BaseCommand):
    """Seed the database with initial users."""
    

    def handle(self, *args, **options):
        User = get_user_model()
        for email, password, is_admin in USERS:
            user, _ = User.objects.get_or_create(
                email=email, defaults={"username": email}
            )
            user.is_admin = is_admin
            user.is_staff = is_admin
            user.set_password(password) 
            user.save()
            self.stdout.write(f"User ready: {email}")
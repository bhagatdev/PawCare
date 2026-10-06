import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'petcare_backend.settings')
django.setup()

from apps.core_petcare.management.commands.seed_medicines import seed_database

if __name__ == '__main__':
    seed_database()

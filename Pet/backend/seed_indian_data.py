import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'petcare_backend.settings')
django.setup()

from apps.accounts.models import User
from apps.core_petcare.models import PetProfile, Medicine, Appointment
from datetime import date, time

def run_seed():
    print("[*] Seeding authentic Indian Pet Healthcare & Pharmacy data...")

    # 1. Users
    owner, _ = User.objects.get_or_create(
        email='pooja@example.com',
        defaults={
            'username': 'pooja_sharma',
            'first_name': 'Pooja',
            'last_name': 'Sharma',
            'role': 'PET_OWNER',
            'phone_number': '9876543210',
            'city': 'Jamshedpur',
            'is_verified': True
        }
    )
    owner.set_password('Password123!')
    owner.save()

    vet, _ = User.objects.get_or_create(
        email='anjali.vet@example.com',
        defaults={
            'username': 'dr_anjali',
            'first_name': 'Dr. Anjali',
            'last_name': 'Sharma',
            'role': 'VETERINARIAN',
            'phone_number': '9835190211',
            'city': 'Jamshedpur',
            'clinic_name': 'Bistupur Companion Animal Clinic',
            'vci_registration_number': 'JH-VCI-2018-4491',
            'is_verified': True
        }
    )
    vet.set_password('Password123!')
    vet.save()

    pharma, _ = User.objects.get_or_create(
        email='apollo.pharma@example.com',
        defaults={
            'username': 'apollovat_bistupur',
            'first_name': 'ApolloVet',
            'last_name': 'Dispensary',
            'role': 'PHARMACY_ADMIN',
            'phone_number': '9771234567',
            'city': 'Jamshedpur',
            'pharmacy_name': 'ApolloVet Pharmacy & Logistics Hub',
            'gstin_number': '20AABCP1330F1Z5',
            'is_verified': True
        }
    )
    pharma.set_password('Password123!')
    pharma.save()

    # 2. Pets
    pets_data = [
        {
            'pet_name': 'Sheru',
            'species': 'Dog',
            'breed': 'Indie / Desi Dog',
            'age': 3,
            'weight_kg': 18.5,
            'owner': owner,
            'owner_name': 'Pooja Sharma',
            'image_url': 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&q=80&w=400',
        },
        {
            'pet_name': 'Bruno',
            'species': 'Dog',
            'breed': 'Golden Retriever',
            'age': 4,
            'weight_kg': 31.2,
            'owner': owner,
            'owner_name': 'Pooja Sharma',
            'image_url': 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=400',
        },
        {
            'pet_name': 'Rani',
            'species': 'Cat',
            'breed': 'Indian Domestic Shorthair',
            'age': 2,
            'weight_kg': 3.8,
            'owner': owner,
            'owner_name': 'Pooja Sharma',
            'image_url': 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&q=80&w=400',
        },
        {
            'pet_name': 'Milo',
            'species': 'Dog',
            'breed': 'Beagle',
            'age': 2,
            'weight_kg': 12.0,
            'owner': owner,
            'owner_name': 'Pooja Sharma',
            'image_url': 'https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&q=80&w=400',
        }
    ]

    created_pets = []
    for pd in pets_data:
        p, _ = PetProfile.objects.update_or_create(
            pet_name=pd['pet_name'],
            owner=pd['owner'],
            defaults=pd
        )
        created_pets.append(p)

    # 3. Authentic Indian Veterinary Medicines
    meds_data = [
        {
            'name': 'Melonex Pet Oral Suspension (Meloxicam 1.5mg/ml)',
            'price_inr': 145.00,
            'stock': 42,
            'category': 'First Aid',
            'image_url': 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&q=80&w=400',
            'description': 'Intas Pharmaceuticals. Fast-acting anti-inflammatory and pain relief oral suspension for acute musculoskeletal conditions in dogs.'
        },
        {
            'name': 'Savavet Kiwof Plus Broad Spectrum Dewormer',
            'price_inr': 210.00,
            'stock': 35,
            'category': 'Antibiotics',
            'image_url': 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?auto=format&fit=crop&q=80&w=400',
            'description': 'Sava Healthcare. Praziquantel, Pyrantel embonate & Febantel oral tablets targeting tapeworms, hookworms, and roundworms.'
        },
        {
            'name': 'Bravecto Chewable Fluralaner Tablet (10-20 kg)',
            'price_inr': 1850.00,
            'stock': 18,
            'category': 'Supplements',
            'image_url': 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?auto=format&fit=crop&q=80&w=400',
            'description': 'MSD Animal Health. Single chewable veterinary treatment providing 12 weeks of sustained protection against ticks and fleas.'
        },
        {
            'name': 'Pet Derm Medicated Chlorhexidine & Ketoconazole Shampoo',
            'price_inr': 395.00,
            'stock': 24,
            'category': 'Grooming',
            'image_url': 'https://images.unsplash.com/photo-1527799820374-dcf8d9d4a388?auto=format&fit=crop&q=80&w=400',
            'description': 'Zoetis India. Broad-spectrum antibacterial and antifungal therapeutic cleansing wash (200ml).'
        },
        {
            'name': 'Himalaya Liv.52 Pet Liver Support Tonic (110ml)',
            'price_inr': 175.00,
            'stock': 60,
            'category': 'Supplements',
            'image_url': 'https://images.unsplash.com/photo-1550572017-ed200f5e6343?auto=format&fit=crop&q=80&w=400',
            'description': 'Himalaya Wellness Herbal Healthcare. Natural herbal hepatoprotective supplement promoting hepatic regeneration and appetite.'
        },
        {
            'name': 'Ceff Pet (Cephalexin 300mg Tablets Strip of 6)',
            'price_inr': 240.00,
            'stock': 28,
            'category': 'Antibiotics',
            'image_url': 'https://images.unsplash.com/photo-1576602976047-174e57a47881?auto=format&fit=crop&q=80&w=400',
            'description': 'Lupin Animal Health. First-generation cephalosporin antibiotic indicated for skin, soft tissue, and urinary tract infections.'
        },
        {
            'name': 'EarKleen Otic Cleanser with Tea Tree Oil (50ml)',
            'price_inr': 280.00,
            'stock': 15,
            'category': 'First Aid',
            'image_url': 'https://images.unsplash.com/photo-1585435557343-3b092031a831?auto=format&fit=crop&q=80&w=400',
            'description': 'Virbac India. Soothing non-irritant ear drops dissolving excess cerumen, ear wax, and deodorizing ear canals.'
        },
        {
            'name': 'Vivaldis Samolin Gut Probiotics Sachets (Pack of 10)',
            'price_inr': 360.00,
            'stock': 8,
            'category': 'Nutrition',
            'image_url': 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?auto=format&fit=crop&q=80&w=400',
            'description': 'Vivaldis Health. High-potency live synbiotic formulation for rapid gut restoration during antibiotic therapy or loose stool.'
        },
        {
            'name': 'Beaphar WomiStop Puppy Deworming Syrup (15ml)',
            'price_inr': 195.00,
            'stock': 4,
            'category': 'First Aid',
            'image_url': 'https://images.unsplash.com/photo-1512069772995-ec65ed45afd6?auto=format&fit=crop&q=80&w=400',
            'description': 'Beaphar India. Gentle pediatric deworming syrup for puppies and kittens from 2 weeks of age.'
        }
    ]

    for md in meds_data:
        Medicine.objects.update_or_create(
            name=md['name'],
            defaults=md
        )

    # 4. Appointments
    if len(created_pets) >= 3:
        Appointment.objects.update_or_create(
            pet=created_pets[0],
            date=date.today(),
            time=time(10, 30),
            defaults={
                'vet': vet,
                'vet_name': 'Dr. Anjali Sharma (B.V.Sc & A.H)',
                'reason_for_visit': 'Loss of appetite since 2 days, mild dry cough and lethargy.',
                'status': 'Waiting'
            }
        )

        Appointment.objects.update_or_create(
            pet=created_pets[1],
            date=date.today(),
            time=time(11, 15),
            defaults={
                'vet': vet,
                'vet_name': 'Dr. Anjali Sharma (B.V.Sc & A.H)',
                'reason_for_visit': 'Frequent ear scratching, head shaking and foul odor from right ear.',
                'status': 'In Consultation'
            }
        )

        Appointment.objects.update_or_create(
            pet=created_pets[2],
            date=date.today(),
            time=time(9, 30),
            defaults={
                'vet': vet,
                'vet_name': 'Dr. Anjali Sharma (B.V.Sc & A.H)',
                'reason_for_visit': 'Routine deworming, annual rabies vaccination booster administered.',
                'status': 'Completed'
            }
        )

    print("[SUCCESS] Seed completed successfully with authentic Indian Pet Care data!")

if __name__ == '__main__':
    run_seed()

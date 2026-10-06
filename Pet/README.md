# 🐾 PawCare Hub — Full-Stack Pet Healthcare, Pharmacy & Community

A modern, high-performance web platform built with **React 19 + Tailwind CSS + Framer Motion** on the frontend, and **Django + Django REST Framework + MySQL** on the backend.

---

## 🏗️ Architecture & Project Structure

```
Pet/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── .env.example
│   ├── petcare_backend/
│   │   ├── __init__.py           # PyMySQL fallback for Windows MySQL compatibility
│   │   ├── settings.py           # MySQL, SimpleJWT, CORS, Media, REST Framework
│   │   ├── urls.py               # Main API routes & JWT Auth
│   │   ├── wsgi.py
│   │   └── asgi.py
│   └── apps/
│       ├── accounts/             # Custom User (Roles), Pet, HealthRecord
│       ├── appointments/         # VeterinarianProfile, AvailabilitySlot, Appointment
│       ├── pharmacy/             # ProductCategory, Product, Prescription, Order, OrderItem
│       └── community/            # Post, Comment, Like
└── frontend/
    ├── package.json
    ├── vite.config.js            # React + @tailwindcss/vite
    ├── index.html                # Plus Jakarta Sans + Outfit Typography
    └── src/
        ├── App.jsx               # Orchestrates navigation, cart state, notifications
        ├── index.css             # Tailwind v4, glassmorphism, custom styling
        ├── data/
        │   └── mockData.js       # Rich initial data for immediate standalone preview
        └── components/
            ├── Navbar.jsx        # Navigation, active tab status, cart trigger
            ├── Hero.jsx          # Animated hero with trust stats & live doctor cards
            ├── VetBookingSection.jsx # Doctor profiles, telehealth filters, booking modal
            ├── PharmacySection.jsx   # Medicine catalog, Rx requirement indicator, Cart actions
            ├── CommunitySection.jsx  # Social feed, likes, comments, story modal
            ├── PetHealthDashboard.jsx # Pet profiles, vitals, vaccination timeline
            ├── CartDrawer.jsx    # Slide-over cart, Rx validation, checkout simulation
            ├── PrescriptionUploadModal.jsx # Rx document upload & verification flow
            └── Footer.jsx        # 24/7 pet emergency hotline & compliance links
```

---

## 🚀 Getting Started

### 1. Backend Setup (Django & MySQL)

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Activate your Python environment:
   ```bash
   # Windows PowerShell
   .\venv\Scripts\Activate.ps1
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   > **Note on MySQL:** `requirements.txt` contains both `mysqlclient` and `PyMySQL`. `petcare_backend/__init__.py` automatically patches PyMySQL as MySQLdb if needed on Windows.
4. Setup MySQL Database:
   - Create a database in MySQL:
     ```sql
     CREATE DATABASE petcare_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
     ```
   - Copy `.env.example` to `.env` and set your MySQL credentials (`DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`).
   - Alternatively, toggle `DB_ENGINE=sqlite` for quick local testing without MySQL.
5. Run migrations & create admin:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   python manage.py createsuperuser
   ```
6. Start Django API server:
   ```bash
   python manage.py runserver 8000
   ```
   - API Root: `http://localhost:8000/api/`
   - Admin Panel: `http://localhost:8000/admin/`

---

### 2. Frontend Setup (React + Tailwind + Framer Motion)

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Start the Vite development server:
   ```bash
   npm run dev
   ```
3. Open `http://localhost:5173` in your browser.

---

## 📡 API Reference Overview

| Module | Endpoint | Method | Description |
|---|---|---|---|
| **Auth** | `/api/auth/token/` | POST | Obtain JWT access & refresh tokens |
| **Auth** | `/api/auth/token/refresh/` | POST | Refresh JWT access token |
| **Accounts** | `/api/accounts/register/` | POST | Register pet owner or vet |
| **Accounts** | `/api/accounts/me/` | GET/PUT | Authenticated user profile |
| **Accounts** | `/api/accounts/pets/` | GET/POST | List or register user pets |
| **Accounts** | `/api/accounts/pets/<id>/records/` | GET/POST | Vaccination & health logs |
| **Appointments** | `/api/appointments/vets/` | GET | List licensed veterinarians & slots |
| **Appointments** | `/api/appointments/bookings/` | GET/POST | Book telehealth or clinic appointment |
| **Pharmacy** | `/api/pharmacy/products/` | GET | Filter pet medicines & supplements |
| **Pharmacy** | `/api/pharmacy/prescriptions/` | GET/POST | Upload doctor's script for verification |
| **Pharmacy** | `/api/pharmacy/orders/` | GET/POST | Place prescription / OTC medication order |
| **Community** | `/api/community/posts/` | GET/POST | Pet recovery & nutrition feed |
| **Community** | `/api/community/posts/<id>/like/` | POST | Toggle like reaction |
| **Community** | `/api/community/posts/<id>/comments/` | POST | Post encouragement comment |

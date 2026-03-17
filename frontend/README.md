# தமிழ்நாடு புகார் தளம் | Tamil Nadu Grievance Portal 🇮🇳

A production-ready Government Grievance Management System with Tamil/English bilingual support, login-protected admin/minister panels, DMK government theme, and Chief Minister's Schemes (Muthalvarin Mugavari) section.

## 🚀 Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

> **Note**: jsPDF is already included in package.json for PDF receipt generation.

## 🔐 Login Credentials

| Role | Username | Password | Route |
|---|---|---|---|
| Admin | `admin` | `admin123` | `/admin` |
| Minister | `minister` | `tnmin123` | `/dashboard` |

> Admin can access both `/admin` and `/dashboard`. Minister can only access `/dashboard`.

## 🌐 Language Support

Click the language toggle button (தமிழ் / English) in the navbar to switch between Tamil and English. Language preference is saved in localStorage.

## 📄 Pages

| Route | Access | Description |
|---|---|---|
| `/` | Public | Home with hero, stats, schemes, how-it-works |
| `/submit` | Public | Submit grievance (with optional file upload) |
| `/track` | Public | Track by token |
| `/forgot-token` | Public | Find token by mobile |
| `/login?role=admin` | Public | Admin login |
| `/login?role=minister` | Public | Minister login |
| `/dashboard` | Minister + Admin | Grievance analytics dashboard |
| `/admin` | Admin only | Update statuses, assign officers |

## ✨ Key Features

### File Upload
- Optional attachment support (PDF, images, documents)
- Max file size: 5MB
- Supported formats: JPG, PNG, PDF, DOC, DOCX
- Client-side validation before submission

### PDF Receipt Generation
- Automatic PDF receipt after grievance submission
- Professional Tamil Nadu government branding
- Three options: Download PDF, Print Receipt, Copy Token
- Filename format: `grievance_[TOKEN].pdf`
- Uses jsPDF library for client-side generation

## 🎨 Design Theme

DMK (Dravida Munnetra Kazhagam) inspired color palette:
- **Primary Red**: `#b91c1c`
- **Black**: `#1a1a1a`  
- **Gradient**: Black → Dark Red → Red
- **Accent**: Warm gold `#f59e0b`

## 🏛️ Schemes Section (Muthalvarin Mugavari)

Showcases 6 major Tamil Nadu government welfare schemes:
1. Kalaignar Veedu Vaazhga (Free Housing)
2. Pudhumai Penn Thittam (Girls Scholarship)
3. Free Bus Travel for Women
4. Innuyir Kaakka Thittam (Free Dialysis)
5. Free Electricity Units
6. Uzhavar Pasanam (Farmer Support)

## 🎯 Demo Data

- **Track**: Token `GRV25DEMO01` or `GRV25DEMO04`
- **Forgot Token**: Mobile `9876543210`

## 📦 Build

```bash
npm run build
```

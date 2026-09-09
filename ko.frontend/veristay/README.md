# VeriStay

A student accommodation platform connecting students with landlords, built with Next.js.

## 🚀 Features

- Property listings with search and application flow
- Landlord dashboard (properties, tenancies, announcements, payments)
- Student/tenant dashboard (tenancy details, housemates, maintenance requests, payments, community)
- Admin dashboard (landlord/property approvals, disputes, complaints, user and report management)
- Role-based access control (Student, Landlord, Admin)

## 📁 Project Structure

```
/app
├── (auth)/                  # Login, registration (student & landlord), password reset
├── (landing)/                # Public marketing/landing page
├── (platform)/
│   ├── dashboard/            # Role-based dashboard (student, landlord, admin)
│   ├── listing/               # Listing search and detail pages
├── listings/                  # Public listing routes
├── errors/                   # RTK Query API slices (auth, listings, files, errors)
├── store/                    # Redux store
└── api/                      # Shared API models/DTOs
```

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm

### Setup

1. Install dependencies

```bash
npm install
```

2. Run the development server

```bash
npm run dev
```

## 📦 Deployment

1. Build the application

```bash
npm run build
```

2. Start the production server

```bash
npm start
```

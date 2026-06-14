# 🏠 EasyRent

**EasyRent** is a full-stack house & flat rental management platform built for the Bangladeshi market. It features a modern, immersive UI with fluid art backgrounds, glassmorphism cards, and full dark/light mode support.

Built with the **PERN** stack — PostgreSQL, Express, React (Vite), Node.js.

---

## ✨ Features

### 🔐 Authentication & Roles
- JWT-based stateless authentication with Bcrypt password hashing
- Three distinct roles — **Admin**, **Property Owner**, and **Tenant** — each with their own dashboard and access controls

### 🏡 Property Management
- Owners can submit new property listings with image uploads (via Multer)
- Admins review and approve/reject submissions before they go live
- Full CRUD — edit and delete listings at any time

### 🔍 Smart Search & Filtering
- Filter properties by **location**, **type** (House/Flat), **number of rooms**, and **rent budget range**
- Results update instantly without page reloads

### ❤️ Favorites
- Tenants can save and unsave their favourite properties with a single click

### 💬 Inquiry System
- Tenants can submit inquiries on property listings
- Owners and Admins can track all incoming inquiries from the dashboard

### 🌙 Dark / Light Mode
- Fluid art animated backgrounds (glowing colour blobs) that adapt to the theme
- Full Bootstrap override ensures zero white bleed in dark mode

---

## 🎨 UI / Design

The interface features a premium, modern aesthetic:

- **Fluid Art Backgrounds** — Large, blurred, animated radial gradient "blobs" give the page a vivid painting-like feel
- **Glassmorphism** — All cards, the navbar, sidebars, and search panels use `backdrop-filter: blur()` for a frosted glass look
- **Typography** — [Outfit](https://fonts.google.com/specimen/Outfit) font for a clean, modern feel across all text
- **Dark Mode** — Pitch black canvas with Electric Cyan + Emerald glowing blobs; strong, masculine, and easy on the eyes
- **Light Mode** — Crisp white canvas with Azure Blue + Amber blobs; clean and bright

---

## 📂 Project Structure

```
EasyRent/
├── backend/                  # Express.js REST API
│   ├── config/               # PostgreSQL pool configuration
│   ├── controllers/          # Route handlers (auth, properties, inquiries)
│   ├── middleware/            # JWT auth guard & role-based access
│   ├── routes/               # API endpoint definitions
│   ├── uploads/              # Uploaded property images (served statically)
│   ├── database.sql          # Full PostgreSQL schema
│   ├── seed.js               # DB seeder — creates tables & inserts demo data
│   └── server.js             # Express app entry point (port 5000)
│
└── frontend/                 # Vite + React SPA
    ├── src/
    │   ├── components/       # Header, Footer, Sidebar
    │   ├── context/          # AuthContext (JWT) & ThemeContext (dark/light)
    │   ├── pages/            # Home, Login, Register, Dashboard, PropertyDetails, EditProperty
    │   ├── App.jsx           # React Router v6 route definitions
    │   ├── index.css         # Full custom CSS design system (glassmorphism + fluid art)
    │   └── App.css           # App-level overrides
    └── index.html
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL 14+
- npm

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/asnayem1122/EasyRent.git
cd EasyRent
```

---

### Step 2 — Database Setup

Open PostgreSQL and create the database:

```sql
CREATE DATABASE house_rental_db;
```

---

### Step 3 — Configure Environment Variables

```bash
cd backend
cp .env.example .env
```

Edit `.env` with your local PostgreSQL credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=house_rental_db
JWT_SECRET=your_jwt_secret_key
```

---

### Step 4 — Seed the Database

```bash
# From the backend/ directory
npm run seed
```

This creates all tables and inserts demo accounts with pre-hashed passwords.

---

### Step 5 — Install Dependencies & Run

From the **project root**, install all dependencies and start both servers together:

```bash
# Install root dependencies
npm install

# Start backend + frontend concurrently
npm start
```

Or run them separately:

```bash
# Terminal 1 — Backend (http://localhost:5000)
cd backend && npm run dev

# Terminal 2 — Frontend (http://localhost:5173)
cd frontend && npm run dev
```

---

## 🔑 Demo Accounts

After seeding, log in with these test credentials:

| Role | Email | Password |
|------|-------|----------|
| 🔴 Admin | `admin@easyrent.com` | `admin123` |
| 🔵 Owner | `owner@easyrent.com` | `owner123` |
| 🟢 Tenant | `tenant@easyrent.com` | `tenant123` |

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18, Vite, React Router v6, Axios |
| **Styling** | Vanilla CSS, Glassmorphism, FontAwesome 6, Google Fonts (Outfit) |
| **Backend** | Node.js, Express.js, Multer |
| **Database** | PostgreSQL, `pg` connection pool |
| **Auth** | JSON Web Tokens (JWT), Bcrypt |
| **Dev Tools** | Nodemon, Concurrently |

---

## 📸 Pages Overview

| Page | Description |
|------|-------------|
| **Home** | Property listing grid with hero section and advanced search/filter panel |
| **Login / Register** | Glassmorphic auth cards with role selection |
| **Property Details** | Full property info, image gallery, and inquiry form |
| **Dashboard (Admin)** | Approve/reject listings, manage users, view all inquiries |
| **Dashboard (Owner)** | Add new listings, manage own properties, track inquiries |
| **Dashboard (Tenant)** | View favourite properties and submitted inquiries |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

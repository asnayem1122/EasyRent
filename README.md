# 🏠 EasyRent

**EasyRent** is a modern full-stack house & flat rental management platform built for the Bangladeshi market. It features a modern, immersive UI with fluid art backgrounds, glassmorphism cards, dark/light mode support, and automated GitHub Pages deployment.

🌐 **Live Demo**: [https://asnayem1122.github.io/EasyRent/](https://asnayem1122.github.io/EasyRent/)

Built with the **PERN** stack — PostgreSQL, Express, React (Vite), Node.js.

---

## ✨ Features

### 🌐 Live Demo & GitHub Pages CI/CD
- **Automated Deployment**: Single-branch (`master`) deployment via GitHub Actions (`.github/workflows/deploy.yml`).
- **SPA Routing Support**: Client-side single-page application routing with `404.html` redirection fallback so direct route links (`/login`, `/dashboard`) work seamlessly on GitHub Pages.
- **Offline / Demo Dataset**: Built-in mock dataset allowing visitors to test all features live online without requiring a local database.

### 🔐 Authentication & Roles
- JWT-based stateless authentication with Bcrypt password hashing
- Three distinct roles — **Admin**, **Property Owner**, and **Tenant** — each with tailored dashboards and permission controls.
- **Quick Login**: One-click demo credentials for instant testing as Admin, Owner, or Tenant.

### 🏡 Property Management
- Owners can submit new property listings with image uploads (via Multer)
- Admins review and approve/reject submissions before they go live
- Full CRUD — edit, update, and delete listings at any time

### 🔍 Smart Search & Filtering
- Filter properties by **location**, **type** (House/Flat), **number of rooms**, and **rent budget range**
- Real-time search updating instantly without full-page reloads

### ❤️ Favorites & Inquiries
- Tenants can save favourite properties with a single click
- Send inquiry messages directly to property owners from the details page

### 🌙 Dark / Light Mode
- Fluid art animated backgrounds (glowing color blobs) that adapt to the active theme
- Bootstrap overrides ensuring clean contrast in dark mode

---

## 🎨 UI / Design System

The interface features a premium, modern aesthetic:

- **Fluid Art Backgrounds** — Animated radial gradient blobs giving the page a vivid painting-like feel
- **Glassmorphism** — Navbar, cards, and search panels use `backdrop-filter: blur(10px)` frosted glass styling
- **Typography** — Google Fonts ([Outfit](https://fonts.google.com/specimen/Outfit)) for modern, readable UI text
- **Dark Mode** — Charcoal canvas with Electric Cyan + Emerald glowing accents
- **Light Mode** — Clean white canvas with Azure Blue + Amber accents

---

## 📂 Project Structure

```
EasyRent/
├── .github/
│   └── workflows/
│       └── deploy.yml        # GitHub Actions automated deployment to GitHub Pages
│
├── backend/                  # Express.js REST API
│   ├── config/               # PostgreSQL pool configuration
│   ├── controllers/          # Route handlers (auth, properties, inquiries)
│   ├── middleware/           # JWT auth guard & role-based access
│   ├── routes/               # API endpoint definitions
│   ├── uploads/              # Uploaded property images (served statically)
│   ├── database.sql          # Full PostgreSQL schema
│   ├── seed.js               # DB seeder — creates tables & inserts demo data
│   └── server.js             # Express app entry point (port 5000)
│
└── frontend/                 # Vite + React SPA
    ├── public/
    │   └── 404.html          # SPA route restoration fallback for GitHub Pages
    ├── src/
    │   ├── components/       # Header, Footer, Sidebar
    │   ├── context/          # AuthContext (JWT & demo auth) & ThemeContext
    │   ├── mockData.js       # Demo dataset for static online hosting
    │   ├── pages/            # Home, Login, Register, Dashboard, PropertyDetails, EditProperty
    │   ├── App.jsx           # React Router route definitions (with basename support)
    │   ├── config.js         # API URL normalization
    │   └── index.css         # Custom CSS design system
    ├── index.html
    └── vite.config.js        # Vite base path configuration (/EasyRent/)
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL 14+ (for full local PERN stack running)
- npm

---

### Step 1 — Clone the Repository

```bash
git clone https://github.com/asnayem1122/EasyRent.git
cd EasyRent
```

---

### Step 2 — Database Setup (For Full Stack Local Development)

Make sure PostgreSQL is running, then create the database:

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

### Step 4 — Install & Seed

From the **project root**, a single command installs dependencies and seeds demo data:

```bash
npm install     # Installs root + backend + frontend dependencies
npm run seed    # Creates DB tables & inserts demo data
```

---

### Step 5 — Run Locally

```bash
npm start       # Starts backend (port 5000) + frontend (port 5173) concurrently
```

Or run frontend only:

```bash
cd frontend
npm run dev
```

---

## 🔑 Demo Accounts

Log in with these test credentials on the live site or local build:

| Role | Email | Password |
|------|-------|----------|
| 🔴 **Admin** | `admin@easyrent.com` | `admin123` |
| 🔵 **Owner** | `owner@easyrent.com` | `owner123` |
| 🟢 **Tenant** | `tenant@easyrent.com` | `tenant123` |

---

## ⚙️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 19, Vite 8, React Router v7, Axios |
| **Styling** | Vanilla CSS, Glassmorphism, FontAwesome 6, Google Fonts (Outfit) |
| **Deployment** | GitHub Actions, GitHub Pages, SPA Redirects |
| **Backend** | Node.js, Express.js, Multer |
| **Database** | PostgreSQL, `pg` connection pool |
| **Auth** | JSON Web Tokens (JWT), Bcrypt |

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

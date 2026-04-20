# Verity

A web-based prototype for trust-engineered peer-to-peer service exchange among verified students at Aston University.

Verity addresses the lack of identity assurance and reliable quality signals in informal student marketplaces (WhatsApp groups, Instagram pages, noticeboards) by combining **identity verification**, **structured attribute-based feedback**, and **visual trust indicators** into a single platform.

---

## Research Focus

This project is guided by three research questions:

- **RQ1 (Verification):** How does restricting access to verified university identities influence perceived trust and safety in a student P2P marketplace?
- **RQ2 (Visual Trust Cues):** How effective are visual trust indicators in reducing user uncertainty during service selection?
- **RQ3 (Structured Reviews):** Do structured, attribute-based reviews improve the reliability and comparability of evaluations compared to unstructured feedback?

---

## Tech Stack

- **Frontend:** React 19, Vite, Tailwind CSS v4
- **Backend:** Supabase (Auth, PostgreSQL, Row-Level Security)
- **Routing:** React Router v7
- **Icons:** Font Awesome 6

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/itsjayn3/Verity.git
cd Verity
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env` file in the project root:
```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the development server
```bash
npm run dev
```

---

## Features

- 🔐 **Verified access** — restricted to `@aston.ac.uk` email accounts
- 🔍 **Campus Feed** — browse and filter student services by location zone
- 👤 **Trust Profile** — structured reputation built from attribute-based reviews
- 🔮 **Trust Orb** — visual aggregated trust indicator (punctuality, quality, communication)
- ⭐ **Structured Reviews** — replaces free-text feedback with comparable attribute ratings

---

## Project Structure

```
src/
├── components/
│   ├── auth/          # ProtectedRoute
│   ├── layout/        # Header, Footer
│   ├── profile/       # ProfileCard
│   └── services/      # SearchBar, FilterTabs, ServiceCard, ServiceGrid
├── pages/             # AuthPage, LandingPage, SearchPage, ProfilePage, etc.
├── supabaseClient.js
└── main.jsx
```

---

## Notes

- This is a **research prototype**, not a production application
- No in-app messaging or booking — contact happens off-platform via social links
- Evaluation conducted via survey with 20 University students

---

*Final Year Project — Aston University, 2025*
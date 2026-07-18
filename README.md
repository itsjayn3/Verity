# Verity
### Campus services, built on trust.

A web-based prototype for trust-engineered peer-to-peer service exchange among verified students at Aston University.

<img width="1893" height="924" alt="Verity Landing Page" src="https://github.com/user-attachments/assets/c7cb0818-4bad-4de2-9343-80fb54c10133" />

🔗 **Live Demo:** https://verityproject.netlify.app/ &nbsp;|&nbsp; 👤 **Guest Access:** `assessor@aston.ac.uk` / `Verity123!`

---

## The Problem

Students have always exchanged services informally through WhatsApp groups, Instagram DMs, and Facebook posts — tutoring, haircuts, design work, nail appointments. But informal channels come with no accountability, no verified identity, and no reliable way to assess quality.

Verity addresses this by combining identity verification, structured attribute-based feedback, and visual trust indicators into a single platform built specifically for university students.

---

## Demo

https://github.com/user-attachments/assets/14f3e73e-3187-4e2e-841e-710bd0d18104

---

## How It Works

**1. Verified Access**
Every account is tied to a real `@aston.ac.uk` identity — no anonymous accounts, no strangers.

**2. Browse the Campus Feed**
Search and filter student services by category and location zone. Every listing shows the provider's verification status and reputation score at a glance.

<img width="1919" height="913" alt="Campus Feed" src="https://github.com/user-attachments/assets/18882bf7-998f-480c-9149-a88f6e910903" />

**3. Trust Profile & Trust Orb**
Each provider has a Trust Profile built from structured, attribute-based reviews. The Trust Orb visualises reputation across punctuality, quality, and communication — not a vague single star score.

<img width="1882" height="952" alt="Trust Orb" src="https://github.com/user-attachments/assets/a0db4627-9904-4f57-af1b-6af2b8ab89f8" />

**4. Structured Reviews**
Reviews capture specific attribute ratings rather than free text, reducing social bias and making providers easier to compare.

---

## Research Focus

This project is guided by three research questions:

- **RQ1 (Verification):** How does restricting access to verified university identities influence perceived trust and safety in a student P2P marketplace?
- **RQ2 (Visual Trust Cues):** How effective are visual trust indicators in reducing user uncertainty during service selection?
- **RQ3 (Structured Reviews):** Do structured, attribute-based reviews improve the reliability and comparability of evaluations compared to unstructured feedback?

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, Tailwind CSS v4 |
| Backend | Supabase (Auth, PostgreSQL, Row-Level Security) |
| Routing | React Router v7 |
| Icons | Font Awesome 6 |
| Deployment | Netlify |

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

- This is a research prototype, not a production application
- Access is restricted to `@aston.ac.uk` accounts by design — use the guest credentials above to explore
- No in-app messaging or booking — contact happens off-platform via social links
- Evaluated via wireframe survey with 20 university students
- Awarded **80%** as part of CS3IP Final Year Project — Aston University, 2026

---

*Built by Jayne-Danielle | BSc Computer Science | Aston University 2026*

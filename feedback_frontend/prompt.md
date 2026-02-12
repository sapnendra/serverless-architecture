# 🚀 AI Prompt – Production-Grade Frontend (Next.js + TypeScript)

## Role & Mindset

You are a **Senior Frontend Engineer and UI/UX Architect** working on a **production-grade web application**.  
Your task is to design and implement a **clean, scalable, extensible frontend** that will be **publicly deployed and tested**.

This is **not a demo or tutorial project**.  
It is the foundation of a **real product** that will evolve over time.

---

## 📌 Project Context

I am building a **Serverless Feedback Platform**.

### Core Concept
- Public users can:
  - Submit feedback
  - View approved feedback
- Admin can:
  - Review pending feedback
  - Approve or reject feedback

### Backend (Already Built)
- Cloudflare Workers
- Hono
- D1 (SQLite)
- Admin APIs secured via API Key

This frontend will consume the backend via HTTP APIs.

I am currently in a **learning + building phase**, so:
- The UI should look **professional but not over-polished**
- Clean, calm, and trustworthy
- Like an **early-stage SaaS or internal tool**
- Not flashy, not experimental

---

## 🧱 Tech Stack (STRICT – Do Not Change)

Use **only** the following:

- **Next.js (App Router)**
- **TypeScript (strict mode)**
- **Tailwind CSS**
- **shadcn/ui**
- Modern React patterns
- Server Components where appropriate

---

## 🎯 Core Engineering Requirements

### 1. Architecture & Code Quality
- Use **Next.js App Router**
- Use **feature-based folder structure**
- Create **reusable, composable components**
- Separate concerns clearly:
  - UI components
  - Data fetching
  - Types
  - Utilities
- Centralize API calls in a `lib/` layer
- Use shared TypeScript types
- Design with **future incremental features** in mind

> ⚠️ IMPORTANT  
> More features will be added later (pagination, auth, analytics, roles).  
> Design components and structure so they are **easy to extend**, not hard-coded.

---

### 2. Pages to Implement

#### 🌐 Public Area
- `/` (Home / Feedback Page)
  - Feedback submission form
  - List of approved feedback
  - Proper loading states
  - Empty states
  - Graceful error handling
  - Good spacing and readability

#### 🔐 Admin Area
- `/admin`
  - View pending feedback
  - Approve / reject actions
  - Clean table-based UI
  - Server-side data fetching
  - No API keys exposed to client-side JS

---

## 🎨 UI / UX Principles (VERY IMPORTANT)

Design with these principles:

- Minimalist
- Calm
- Professional
- Accessible
- Readable typography
- Clear visual hierarchy
- Subtle spacing and borders
- No flashy animations
- No neon or gradient-heavy designs

### Color Guidelines
- Neutral base colors (gray / zinc / slate)
- One primary accent color only
- Soft background shades
- Use shadcn/ui defaults where possible
- Maintain high contrast and accessibility

The UI should feel like:
> “This could be shipped publicly by a serious developer.”

---

## 🧩 Component Design Philosophy

Create reusable components such as:
- `FeedbackForm`
- `FeedbackCard`
- `FeedbackList`
- `AdminTable`
- `StatusBadge`
- `EmptyState`
- `LoadingState`
- `PageHeader`
- `Container`

Component rules:
- No hard-coded business logic
- Accept props
- Easy to reuse
- Easy to extend later
- Clean TypeScript props

---

## 🔄 Data Fetching & State Management

- Prefer **Server Components** for data fetching
- Use **Client Components** only for interactivity
- Use `fetch()` with proper cache control
- Handle:
  - Loading states
  - Empty states
  - Error states
- Do not over-engineer state management

---

## 📂 Suggested Folder Structure

```txt
src/
├── app/
│   ├── page.tsx
│   ├── admin/
│   │   └── page.tsx
│   └── layout.tsx
├── components/
│   ├── feedback/
│   ├── admin/
│   ├── ui/
│   └── common/
├── lib/
│   └── api.ts
├── types/
│   └── feedback.ts
├── styles/
└── config/

- You may improve this structure if necessary, but it must remain scalable and clean.

🧪 Production Mindset

This project will:

Be deployed publicly

Be tested by real users

Evolve incrementally

Therefore:

Do NOT generate toy code

Do NOT treat this as a tutorial

Do NOT over-engineer prematurely

Write clean, maintainable code


📌 Output Expectations

Generate a complete frontend implementation

Clean and readable code

Proper use of shadcn/ui components

Professional-looking UI on first load

Easy to extend for future features

🚀 Final Instruction

Build this frontend as if you are creating the foundation of a long-term product, not a one-off demo.

Think like a senior engineer shipping v1 of a real SaaS.
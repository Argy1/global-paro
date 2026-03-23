# Global PARO - Technical Documentation

**Live URL:** https://globalparo.com 
**Platform:** React + Supabase

---

## Table of Contents

1. [Tech Stack](#tech-stack)
2. [Development Setup](#development-setup)
3. [Project Structure](#project-structure)
4. [Database Schema](#database-schema)
5. [Authentication and Roles](#authentication-and-roles)
6. [Edge Functions (API)](#edge-functions-api)
7. [i18n / Translations](#i18n--translations)
8. [Environment Variables](#environment-variables)
9. [Deployment](#deployment)
10. [API Documentation](#api-documentation)

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 5 |
| Styling | Tailwind CSS 3.4 + shadcn/ui |
| Routing | React Router DOM v6 |
| Data Fetching | TanStack React Query v5 |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Icons | Lucide React |
| Backend | Supabase (PostgreSQL 14 + Auth + Storage + Edge Functions) |
| Edge Runtime | Deno (TypeScript) |
| AI Model | Google Gemini 3 Flash |
| Deployment | Hostinger |

---

## Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Argy1/global-paro.git
cd global-paro

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

The app will be available at `http://localhost:8080`.

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server with HMR |
| `npm run build` | Production build |
| `npm run build:dev` | Development build (with source maps) |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run ESLint |
| `npm run test` | Run Vitest unit tests |
| `npm run test:watch` | Run tests in watch mode |

---

## Project Structure

```text
/
|- public/                   # Static assets (favicon, robots.txt, sitemap)
|- src/
|  |- assets/                # Images, icons, and static media
|  |- components/
|  |  |- ui/                 # shadcn/ui base components
|  |  |- layout/             # Navbar, Footer, Layout wrappers, ChatWidget
|  |  |- campaign/           # Landing page sections
|  |  |- admin/              # Admin dashboard components
|  |  |- portal/             # Candidate portal components
|  |  |- about/              # About page sections
|  |  |- home/               # Home page components
|  |  `- whatwedo/           # What We Do page components
|  |- hooks/                 # Custom React hooks
|  |- i18n/                  # Translation files
|  |- integrations/supabase/ # Supabase client + types
|  |- lib/                   # Utility helpers
|  |- pages/                 # Route-level pages
|  |- App.tsx                # Root routing configuration
|  |- main.tsx               # React entry point
|  `- index.css              # Global CSS + design tokens
|- supabase/
|  |- functions/chat/index.ts # AI chat edge function (Deno)
|  `- config.toml             # Supabase project configuration
|- tailwind.config.ts
`- vite.config.ts
```

---

## Database Schema

All tables live in the `public` schema with Row Level Security (RLS) enabled.

### Core Tables

#### `candidates`
Stores all nurse/candidate registrations.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Auto-generated |
| `user_id` | uuid | Links to `auth.users` (nullable) |
| `full_name` | text | Required |
| `whatsapp_number` | text | Required |
| `email` | text | Optional |
| `journey_stage` | enum | New -> Contacted -> Screening -> Preparing -> Ready -> Placed -> Closed |
| `pipeline_status` | enum | new -> contacted -> screened -> qualified -> in_process -> placed -> closed |
| `profession` | enum | Nurse / Midwife / Other |
| `education_level` | enum | Diploma / Bachelor / Master / Other |
| `english_level` | enum | IELTS / OET / Basic / Intermediate / Advanced / Not Yet |
| `target_countries` | text[] | Array of target destination countries |
| `created_at` | timestamptz | Auto |

#### `employer_inquiries`
Hospital/clinic inquiries from the Employer page.

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid (PK) | Auto-generated |
| `institution_name` | text | Hospital/clinic name |
| `contact_name` | text | Contact person |
| `institutional_email` | text | Official email |
| `nurses_needed` | int | Number of nurses required |
| `employer_status` | enum | New / Contacted / Meeting Booked / Closed |
| `created_at` | timestamptz | Auto |

#### `webinars`
Webinar events managed by admins.

#### `chat_conversations` and `conversation_messages`
AI chat session history, linked to `user_identifier`.

#### `chat_escalation_tickets`
Human escalation tickets created when user types "talk to human".

#### `content` and `content_items`
CMS tables for News and Success Stories.

#### `profiles`
Extended user profile data linked to `auth.users`.

#### `user_roles`
Role assignments separate from profiles.

#### `site_settings`, `social_links`, `whatsapp_groups`, `pathways`, `quickstart_chapters`, `faq_items`, `candidate_documents`
Operational content/configuration tables used by admin features.

---

## Authentication and Roles

Authentication is handled by Supabase Auth with email/password.

Roles are stored in a separate `user_roles` table to prevent privilege escalation.

```sql
-- Available roles
'admin' | 'moderator' | 'user' | 'editor' | 'support_agent'
```

---

## Edge Functions (API)

Deployed as Deno serverless functions on Supabase Edge Functions.

### `POST /functions/v1/chat`

AI chat endpoint using Google Gemini 3 Flash via Lovable AI Gateway.

**Request body:**

```json
{
  "messages": [{ "role": "user", "content": "How do I register?" }],
  "lang": "en"
}
```

**Response:** `text/event-stream` (SSE/streaming)

Supported languages: `en` (English) and `id` (Bahasa Indonesia)

---

## i18n / Translations

The app supports English and Bahasa Indonesia.

- `src/i18n/en.ts` - English (default)
- `src/i18n/id.ts` - Bahasa Indonesia

Language preference is saved in `localStorage` with key `gp_lang`.

---

## Environment Variables

The `.env` file is auto-generated. It contains:

```env
VITE_SUPABASE_URL=https://<project-id>.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=<anon-key>
VITE_SUPABASE_PROJECT_ID=<project-id>
```

Important: do not edit `.env` manually because it is managed by the platform.

---

## Deployment

### Manual Deployment (via GitHub)

1. Push changes to GitHub repository.
2. Hostinger detects changes and rebuilds automatically.

---

## API Documentation

Interactive API docs are available in the app at:

```text
/docs
```

---


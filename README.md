## ResumeChecker – AI Interview Prep & Resume Tool

ResumeChecker is a full‑stack project that helps candidates prepare for job interviews using AI.  
You paste a **job description**, provide your **resume or a quick self‑description**, and the app generates:

- **Match score** against the role  
- **Technical & behavioral questions** with intentions and model answers  
- A **day‑wise preparation roadmap**  
- An **AI‑tailored resume PDF** you can download

The stack is:

- **Backend**: Node.js, Express, MongoDB, Google GenAI, Puppeteer, PDF parsing, JWT + cookie auth  
- **Frontend**: React (Vite), React Router, Axios, modern dark UI with SCSS

---

## Features

- **Authentication**
  - Register / login with JWT stored in http‑only cookies
  - Protected routes (`/` and `/interview/:id`) using a `Protected` wrapper
  - Logout endpoint with **token blacklist** to invalidate sessions

- **Interview plan generation**
  - Upload a **PDF resume** (3MB limit, in‑memory upload via Multer)
  - Optionally add a **self description** if you don’t have a resume
  - Paste a detailed **job description**
  - Backend parses the resume and calls **Google GenAI** with a strict Zod schema to generate:
    - Match score
    - Technical questions (with intention and model answer)
    - Behavioral questions (with intention and model answer)
    - Skill gaps (with severity)
    - Multi‑day preparation plan

- **Dashboard & interview view**
  - Home:
    - Hero card where you enter job description + upload resume / self description
    - “Generate my interview strategy” CTA that creates a report and navigates to `/interview/:id`
    - “My recent interview plans” section (cards for each stored report)
  - Interview page:
    - Left nav: **Technical / Behavioral / Road Map**
    - Center: expandable Q&A cards and a vertical timeline for the prep plan
    - Right sidebar: match score ring and skill‑gap tags
    - Button to **Download Resume** as a generated PDF

- **AI‑generated resume PDF**
  - Google GenAI generates HTML for a tailored resume
  - Backend converts HTML → PDF using Puppeteer and streams it to the client

---

## Project structure

```text
ResumeChecker/
  backend/        # Express API, MongoDB models, AI integration
  frontend/       # React SPA (Vite) – UI and client logic
```

### Backend

- Entry: `backend/server.js`
- Auth:
  - Routes: `backend/routes/auth.routes.js`
  - Controllers: `backend/controllers/auth.controller.js`
  - Middleware: `backend/middlewares/auth.middleware.js` (JWT + blacklist)
  - Models: `backend/models/user.model.js`, `backend/models/blacklist.model.js`
- Interview:
  - Routes: `backend/routes/interview.routes.js`
  - Controllers: `backend/controllers/interview.controller.js`
  - Models: `backend/models/interviewReport.model.js`
  - File upload: `backend/middlewares/file.middleware.js` (Multer in‑memory, PDF only)
  - AI service: `backend/services/ai.service.js` (Google GenAI + Puppeteer)
- Database:
  - `backend/config/database.js` – connects to MongoDB using `MONGO_URI`

### Frontend

- Entry: `frontend/src/main.jsx`, `frontend/src/App.jsx`
- Routing: `frontend/src/app.routes.jsx` (`/login`, `/register`, `/`, `/interview/:interviewId`)
- Auth:
  - Context: `frontend/src/features/auth/auth.context.jsx`
  - Hook: `frontend/src/features/auth/hooks/useAuth.js`
  - API: `frontend/src/features/auth/services/auth.api.js`
  - Pages: `frontend/src/features/auth/pages/Login.jsx`, `Register.jsx`
  - Protected wrapper: `frontend/src/features/auth/components/Protected.jsx`
- Interview:
  - Context: `frontend/src/features/interview/interview.context.jsx`
  - Hook: `frontend/src/features/interview/hooks/useInterview.js`
  - API: `frontend/src/features/interview/services/interview.api.js`
  - Pages: `frontend/src/features/interview/pages/Home.jsx`, `Interview.jsx`
- Shared UI:
  - Header with logout & back button: `frontend/src/features/auth/components/AppHeader.jsx`
  - Styles: `frontend/src/style.scss`, `frontend/src/style/button.scss`, feature‑specific SCSS

---

## Prerequisites

- **Node.js** 18+ (recommended)
- **MongoDB** running locally (or a MongoDB URI)
- A **Google GenAI API key** (for `@google/genai`)

---

## Installation & running locally

Clone the repo and install dependencies for both backend and frontend.

```bash
git clone <your-repo-url>.git
cd ResumeChecker
```

### 1. Backend

```bash
cd backend
npm install
npm run dev
```

By default the backend runs on `http://localhost:3000` and exposes:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET  /api/auth/logout`
- `GET  /api/auth/get-me`
- `POST /api/interview/` (multipart form: `resume`, `jobDescription`, `selfDescription`)
- `GET  /api/interview/report/:interviewId`
- `GET  /api/interview/`
- `POST /api/interview/resume/pdf/:interviewReportId`

### 2. Frontend

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend Vite dev server typically runs on `http://localhost:5173`.

The frontend is configured to call the backend at `http://localhost:3000` and sends cookies via:

- `axios.create({ baseURL: "http://localhost:3000", withCredentials: true })`

Make sure **both** servers are running.

---

## Usage

1. **Register & log in**
   - Open `http://localhost:5173`
   - Create an account, then log in

2. **Generate an interview plan**
   - On the home page:
     - Paste the target **job description**
     - Upload your **resume (PDF)** or write a **quick self description**
     - Click **“Generate My Interview Strategy”**
   - You’ll be redirected to `/interview/:id` once the AI report is saved

3. **Explore your interview plan**
   - Switch between **Technical**, **Behavioral**, and **Road Map** sections
   - Review the **match score** and **skill gaps**
   - Re‑open any previous plan from the **“My Recent Interview Plans”** list on the home page

4. **Download tailored resume**
   - On the interview page, click **“Download Resume”**
   - The browser downloads a PDF generated by Google GenAI + Puppeteer

5. **Logout**
   - Use the **Logout** button in the header (adds token to blacklist and clears cookie)

---

## Tech highlights / talking points

- **Strong separation of concerns**:
  - React front‑end with hooks + contexts for auth and interview domain
  - Express backend with clear routing, controllers, middleware and models
- **Schema‑driven AI responses**:
  - Uses **Zod** to define strict types for the interview report and resume HTML
  - Converts them to JSON Schema (`zod-to-json-schema`) for `@google/genai` so AI responses are **structured and validated**
- **Secure auth flow**:
  - JWT stored in http‑only cookies
  - **Blacklist model** to invalidate tokens on logout
- **File handling & parsing**:
  - Multer in‑memory upload + `pdf-parse` to extract resume content
- **PDF generation pipeline**:
  - AI returns HTML → Puppeteer renders HTML → PDF streamed as a binary response

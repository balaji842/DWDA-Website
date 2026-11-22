# Department for Welfare of the Differently Abled — Government of Tamil Nadu

A bilingual (English / தமிழ்), accessible web portal: schemes, online applications with document upload, application tracking, district offices, Acts & policies, news, and an admin dashboard for officials.

- **Frontend:** React 18, React Router, Vite, plain CSS, Axios, Lucide icons
- **Backend:** Node.js, Express, REST API
- **Database:** MongoDB with Mongoose

---

## 1. What you need

| Tool | Version | Check |
|---|---|---|
| Node.js | 18 or newer (20 LTS recommended) | `node -v` |
| npm | comes with Node | `npm -v` |
| MongoDB | 6 or newer, running locally — or a MongoDB Atlas connection string | `mongosh` |

**MongoDB options:**
- Install MongoDB Community Server (https://www.mongodb.com/try/download/community) and start it, or
- With Docker: `docker run -d --name tn-dwda-mongo -p 27017:27017 mongo:7`, or
- Use a free MongoDB Atlas cluster and put its connection string in `backend/.env`.

## 2. Run it (first time)

Open the folder in VS Code, then open a terminal (**Terminal → New Terminal**):

```bash
# 1. install everything (root, backend, frontend)
npm run install:all

# 2. start the API and the website together
#    (backend/.env is included with local defaults; if it is missing: cp backend/.env.example backend/.env)
npm run dev
```

- Website: **http://localhost:5173**
- API: **http://localhost:5000/api** (health check: http://localhost:5000/api/health)
- Admin: **http://localhost:5173/admin/login** — email `admin@example.gov.in`, password `ChangeMe@123` (from `backend/.env`). Change these before using it anywhere real.

On the first start the API fills the database with the reference data described in section 5.

**Run the two parts separately** (two terminals) if you prefer:
```bash
cd backend  && npm run dev      # API on :5000 (restarts on file changes)
cd frontend && npm run dev      # website on :5173 (proxies /api to :5000)
```

## 3. Configuration — `backend/.env`

| Variable | Meaning |
|---|---|
| `PORT` | API port (default 5000) |
| `MONGODB_URI` | MongoDB connection string |
| `CLIENT_ORIGIN` | Website address(es) allowed to call the API, comma separated |
| `JWT_SECRET` | Long random secret for admin sign-in tokens — **must be changed for production** (the API refuses to start in production with the sample value) |
| `JWT_EXPIRES_IN` | Admin session length, e.g. `8h` |
| `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME` | The first Super Admin, created only when no admin exists |
| `MAX_UPLOAD_MB` | Largest applicant document, per file (default 5) |

Frontend: `frontend/.env.example` → `VITE_API_URL` is only needed in production when the API is on a different domain.

## 4. Pages

| Public | Path |
|---|---|
| Home (matches the reference design) | `/` |
| All schemes (search, topic filter, "Start here" filter) | `/schemes`, `/schemes?q=…`, `/schemes?for=person\|parent` |
| Scheme details | `/schemes/:slug` |
| Apply for a scheme | `/apply` |
| Track application | `/track` |
| ID card / UDID | `/id-card` |
| Institutions | `/institutions` |
| District offices (all 38) | `/district-offices` |
| Acts & policies | `/acts-policies` |
| News & announcements | `/news`, `/news/:slug` |
| Contact | `/contact` |
| Accessibility statement | `/accessibility` |
| History & mandate, RTI, Screen reader access, Sitemap | `/about`, `/rti`, `/screen-reader-access`, `/sitemap` |

| Admin (signed in) | Path | Who |
|---|---|---|
| Overview (totals, pending, approved, rejected) | `/admin` | all |
| Applications: search, filters, pagination, detail, verify documents, change status with remarks | `/admin/applications` | all (district admins: own district only) |
| Schemes | `/admin/schemes` | Super Admin edits; others view |
| News & announcements | `/admin/news` | Super Admin |
| District offices | `/admin/districts` | Super Admin all; district admin own office |
| Acts & documents (PDF upload) | `/admin/documents` | Super Admin |
| Institutions | `/admin/institutions` | all (district admins: own district) |
| Site settings (helpline, head office, At a glance figures) | `/admin/settings` | Super Admin |
| Admin users | `/admin/users` | Super Admin |

## 5. Official information and sample data

Nothing official is invented. On first start the database gets:

- **12 schemes** — titles and one-line summaries from the design brief, with Tamil translations. *Who can apply*, benefits, documents and *how to apply* are **empty**; the public page says "not yet published, ask your district office" until an admin fills them in and ticks **Verified**.
- **38 district offices** — names only. Address, phone, email, hours and map stay "Not yet added" until entered; the map link shows only when the office is marked Verified.
- **Acts & policies** — the RPwD Act 2016, PwD Act 1995, State Policy 1994 and G.O.s, **without files**. The public sees "Official copy to be added" until an admin uploads the official PDF or adds an official https link.
- **Helpline, head office address/email/phone and the At a glance figures** — empty; the site shows `[number]`, `[figure]` etc. as in the reference, until set in *Site settings*.
- **3 news items and 4 institutions** marked **Sample** (labelled on the site). Delete or replace them in the admin.

The Tamil text was machine-prepared — have the department review it. Replace the dashed **State emblem** placeholder (`frontend/src/components/SiteHeader.jsx → Emblem`) with the official emblem image.

`npm run seed` adds any missing reference data. `npm --prefix backend run seed -- --reset` reloads schemes and removes sample items (refused once applications exist).

## 6. Accessibility

Built to WCAG 2.2 AA and tested with axe-core (0 violations on every public page):

- Skip link, landmarks, one `h1` per page, focus moves to the new page heading on navigation
- Everything works with the keyboard; visible focus outline; dialogs trap focus, close with Escape and return focus
- Text size A− / A / A+ (scales the whole page), high-contrast mode (yellow on black), reduce-motion switch, and `prefers-reduced-motion` respected — all saved on the device
- English / Tamil switch on every page, `lang` attribute updated, Noto Sans Tamil font
- Forms: labels, hints and errors linked with `aria-describedby`; error summary with links to each field; errors announced
- Touch targets ≥ 44 px; responsive from 320 px phones to wide screens

## 7. Security

- Admin passwords hashed with bcrypt (cost 12); JWT sign-in; roles **Super Admin** and **District Admin** enforced on the server for every admin route
- Rate limits on sign-in, applications and tracking; Helmet security headers; CORS restricted to `CLIENT_ORIGIN`; input validation and length limits on every field
- Uploads: PDF/JPG/PNG only, size limit, **file contents checked** (not just the name), random file names, stored in `backend/uploads/` which is **not** served publicly. Applicant documents can be opened only by signed-in officials of that district; files from rejected submissions are deleted
- Tracking needs **both** the reference number and the registered mobile, returns the same message for either mismatch, masks the name and mobile, and never shows internal notes

## 8. SMS

The site says "We text you at every stage". The code calls `backend/services/smsService.js` on submission and on every status change; it currently **logs** the message (`[sms:not-sent]`). Connect the department's approved SMS gateway there.

## 9. API reference

Base URL: `/api`. JSON in and out; errors are `{ "message": "...", "errors": { "field": "message" } }`. Admin routes need `Authorization: Bearer <token>`.

### Public
| Method | Path | Notes |
|---|---|---|
| GET | `/health` | Status check |
| GET | `/schemes?q=&category=&audience=` | `category`: identity, children, education, employment, devices, care, social-security, awards. `audience`: person, parent, institution. Search matches every word, English or Tamil |
| GET | `/schemes/:slug` | One scheme |
| POST | `/applications` | `multipart/form-data`: applicantName, dateOfBirth, gender (female, male, transgender, prefer-not-to-say), mobile, email?, district, address, disabilityCategory, disabilityPercentage, udidNumber?, scheme (slug), consent=true, `documents` (1–5 files) + matching `documentLabels`. Returns `201 { referenceNo, scheme, submittedAt, applicantName(masked) }` |
| POST | `/tracking` | `{ referenceNo, mobile }` → masked status and public timeline |
| GET | `/districts`, `/districts/:district` | Offices |
| GET | `/news?page=&limit=`, `/news/:slug` | Published announcements |
| GET | `/documents`, `/documents/:id/file` | Acts & policies; file when uploaded |
| GET | `/institutions?district=&type=` | Directory |
| GET | `/settings` | Helpline, head office, figures |
| GET | `/meta` | Districts, scheme categories, disability categories |

### Auth
| Method | Path | Notes |
|---|---|---|
| POST | `/auth/login` | `{ email, password }` → `{ token, admin }` |
| GET | `/auth/me` | Current admin |
| POST | `/auth/change-password` | `{ currentPassword, newPassword }` (10+ chars, letters and numbers) |

### Admin
| Method | Path | Role |
|---|---|---|
| GET | `/admin/stats` | all (scoped) |
| GET | `/admin/applications?q=&status=&district=&scheme=&page=&limit=` | all (scoped). `status` also accepts `pending`, `granted` |
| GET | `/admin/applications/:id` | all (scoped) |
| PATCH | `/admin/applications/:id/status` | `{ status, remark, internalNote }` — allowed moves: submitted → under-verification / documents-required / rejected; under-verification → documents-required / approved / rejected; documents-required → under-verification / rejected; approved → completed. Remark required for documents-required and rejected |
| PATCH | `/admin/applications/:id/documents/:docId` | `{ verified }` |
| GET | `/admin/applications/:id/documents/:docId/file` | View an applicant document |
| GET / POST / PUT / DELETE | `/admin/schemes[/:id]` | read: all; write: Super Admin |
| GET / POST / PUT / DELETE | `/admin/news[/:id]` | read: all; write: Super Admin |
| GET / PUT | `/admin/districts[/:id]` | Super Admin; district admin own office |
| GET / POST / PUT / DELETE | `/admin/documents[/:id]` | Super Admin; `multipart` with optional `file` (PDF) |
| GET / POST / PUT / DELETE | `/admin/institutions[/:id]` | all (scoped) |
| PUT | `/admin/settings` | Super Admin |
| GET / POST / PATCH | `/admin/users[/:id]` | Super Admin |

## 10. Project structure

```
backend/
  config/        env, database, shared lists (districts, statuses, disability categories)
  controllers/   public, application, tracking, auth, admin
  middleware/    auth + roles, uploads, rate limits, errors
  models/        Scheme, Application, DistrictOffice, News, Document, Admin, Institution, Setting
  routes/        schemes, applications, tracking, districts, news, documents, auth, admin, misc
  services/      smsService (connect a gateway here)
  uploads/       private file storage (not served publicly)
  utils/         validation, reference numbers, privacy masking, seed data
  app.js, server.js
frontend/
  src/components/   header, top bar, navigation, footer, cards, form field, modal, states …
  src/pages/        public pages; src/pages/admin/ admin pages
  src/layouts/      site layout, admin layout
  src/context/      language, accessibility, toasts, site settings, admin auth
  src/hooks/, src/services/, src/translations/ (en.js, ta.js), src/styles/global.css
```

## 11. Production

```bash
npm run build                 # frontend → frontend/dist
cd backend && NODE_ENV=production npm start
```
Serve `frontend/dist` from your web server (any route that is not a file should return `index.html`), and proxy `/api` to the Node process. Set a real `JWT_SECRET`, the production `MONGODB_URI` and `CLIENT_ORIGIN`, use HTTPS, and back up `backend/uploads/`.

## 12. Troubleshooting

- **"The API could not start … Check that MongoDB is running"** — start MongoDB, or fix `MONGODB_URI`.
- **Website shows "We couldn't reach the server"** — the API isn't running on port 5000.
- **Port already in use** — change `PORT` in `backend/.env` and the proxy target in `frontend/vite.config.js`.
- **Forgot the admin password** — delete the admin from the `admins` collection and restart the API; it recreates the Super Admin from `.env`.

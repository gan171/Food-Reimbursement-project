# Overtime Food Reimbursement System

A full-stack automation blueprint implementation for overtime food reimbursements with:

- **Frontend:** React + Vite (modern glassmorphism UI)
- **Backend:** Node.js + Express
- **Database:** MySQL
- **Auth:** Session-based (`express-session` + MySQL session store)
- **Uploads:** Multer (bill image/pdf)
- **Email Notifications:** Nodemailer
- **PDF Exports:** jsPDF

## Workflow implemented

1. Employee submits reimbursement with bill upload.
2. Claim moves through staged approvals:
   - `ADMIN_HEAD`
   - `REPORTING_MANAGER`
   - `ACCOUNTS`
3. Accounts can set approved amount and UTR reference.
4. Notifications are sent at each stage transition.
5. Dashboard provides monthly totals and SLA breach visibility.

---

## Project Structure

- `backend/` Express API + MySQL logic.
- `frontend/` Vite React app.
- `backend/schema.sql` DB schema.

---

## Quick Start

### 1) Database setup

```sql
SOURCE backend/schema.sql;
```

Create seed users with hashed passwords (example roles: EMPLOYEE, ADMIN_HEAD, REPORTING_MANAGER, ACCOUNTS, IT_ADMIN).

### 2) Backend setup

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Suggested `.env`:

```env
PORT=4000
FRONTEND_URL=http://localhost:5173
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=food_reimbursements
SESSION_SECRET=change_me
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
MAIL_FROM=noreply@example.com
```

### 3) Frontend setup

```bash
cd frontend
npm install
npm run dev
```

Optional frontend env (`frontend/.env`):

```env
VITE_API_URL=http://localhost:4000/api
```

---

## Important Notes

- Rejection requires comment in API validation.
- Bill files are saved in `backend/src/uploads`.
- SMTP is optional in development; if not configured, stage notifications are logged.
- Dashboard route is restricted to `IT_ADMIN` and `ACCOUNTS` roles.

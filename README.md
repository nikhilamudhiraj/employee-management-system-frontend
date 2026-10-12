# WorkNest — Employee Management System (Frontend)

Modern, responsive web application for managing employees and viewing workforce analytics.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20with-Vercel-black?logo=vercel)](https://vercel.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://react.dev)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com)

## ✨ Features

- **Executive Analytics Dashboard**: Real-time KPI stats (headcount, active employees, on leave, total payroll).
- **Department Headcount**: Interactive distribution progress bars with department share.
- **Advanced Employee Directory**:
  - Instant live search (First/Last name, email, department, role).
  - Department filters (Engineering, HR, Marketing, Finance, Product, Operations).
  - Status filters (Active, On Leave, Inactive).
  - Table view & Grid Card view switcher.
  - Multi-criteria sorting (Name, Salary, Joining Date).
- **Complete CRUD Operations**:
  - Add new employee with form validation.
  - 360° Employee Dossier popup with company tenure calculation.
  - Edit employee details.
  - Safe deletion with confirmation modal.
- **Export to CSV**: Instant download of all filtered records to a formatted spreadsheet.
- **Zero-Downtime Resilience**: Seamless demo failover & status indicator while Render backend wakes up from free-tier standby.

## 🚀 Live Deployment on Vercel

1. Import this repository into [Vercel](https://vercel.com).
2. Framework Preset: **Vite**.
3. Add Environment Variable:
   - `VITE_API_BASE_URL` = `https://<YOUR_RENDER_BACKEND>.onrender.com/api`
4. Click **Deploy**!

## 💻 Local Development

```bash
# Install dependencies
npm install

# Start local development server
npm run dev
```

App runs at `http://localhost:3000`.

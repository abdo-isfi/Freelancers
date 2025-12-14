# Freelancer Management System

A full-stack application for managing freelance projects, clients, invoices, and time tracking.

## Project Overview
This project allows freelancers to:
- Track time spent on projects.
- Manage client details.
- Generate and manage professional invoices.
- View dashboard statistics including revenue and active projects.

## Tech Stack
- **Frontend**: React (Vite), Tailwind CSS, Redux Toolkit
- **Backend**: Node.js, Express, Sequelize (MySQL)
- **Database**: MySQL (Production), SQLite (Testing)

## Prerequisites
- Node.js (v18+)
- MySQL Server

## Quick Start

1. **Install Dependencies**
   ```bash
   # Backend
   cd backend
   npm install

   # Frontend
   cd ../frontend
   npm install
   ```

2. **Environment Setup**
   - Copy `.env.example` to `.env` in both `frontend` and `backend` directories.
   - Configure your MySQL credentials in `backend/.env`.

3. **Run Application**
   ```bash
   # Terminal 1: Backend
   cd backend
   npm run dev

   # Terminal 2: Frontend
   cd frontend
   npm run dev
   ```

## Testing
- **Backend**: `npm test` (Integration tests)
- **Frontend**: `npm test` (Unit tests)

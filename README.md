<!-- @format -->

# Verilabs KYC Decision Engine

A web application for VeriLabs KYC (Know Your Customer) dashboard

# Related Links

- Mobile Flutter Repo: https://github.com/mumtazalwan/VeriLabs.git
- Mobile APK: https://drive.google.com/drive/folders/1Ea4fuNCE4h4PWaFU8nK4wpRs4pSmT_Wp
- Frontend Repo: https://github.com/AlvaJufinto/verilabs
- Frontend Deployment: https://verilabs.vercel.app/
- Backend Repo: https://github.com/AlvaJufinto/vl-service

## Features

- Dukcapil Data Simulation: Fetch and display citizen data from API
- Verification Results: View, filter, and analyze verification history with grades and trends
- API integration for all data (no static/mock data)

## Tech Stack

- React + TypeScript
- Vite
- Tailwind CSS
- Zustand (state management)
- Supabase (backend, via API)

## Getting Started

1. **Clone the repository:**

   ```sh
   git clone <your-repo-url>
   cd verilabs
   ```

2. **Install dependencies:**

   ```sh
   npm install
   ```

3. **Configure environment:**
   - Copy `.env.example` to `.env` and set `VITE_API_URL` to your backend API URL.
   - Example:
     ```env
     VITE_API_URL="http://localhost:3000"
     ```

4. **Run the development server:**
   ```sh
   npm run dev
   ```
   The app will be available at `http://localhost:5173` (default Vite port).

## Project Structure

- `src/`
  - `components/` — UI components (sidebar, nav, cards, etc)
  - `pages/` — Main pages (DecisionEnginePage, DukcapilPage, etc)
  - `stores/` — Zustand stores for state management
  - `lib/` — Utilities and mock data (if any)
  - `types/` — TypeScript types

## API Endpoints

- `GET /v1/kyc/all` — List all citizen data
- `POST /v1/kyc/verify-nik` — Verify a NIK and get trust score
- `GET /v1/kyc/verification-results` — List verification results (with filters)

> The backend should be running and accessible at the URL set in `VITE_API_URL`.

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run preview` — Preview production build
- `npm run test` — Run tests (if available)

## License

MIT

---

Made with ❤️ by Verilabs Team

# SkillBridge AI(VITE)

SkillBridge AI is a next-generation platform connecting students with internships, jobs, hackathons, and certifications, powered by personalized AI career guidance.

## Architecture

This project is structured as a decoupled full-stack application:
- **Frontend**: React + Vite, Tailwind CSS v4, Framer Motion (located in `/frontend`)
- **Backend**: Node.js, Express, MongoDB, Firebase Admin (located in `/backend`)

## Prerequisites

- Node.js (v18 or higher)
- A MongoDB Atlas cluster URI
- Firebase Service Account Key JSON
- Gemini / OpenAI API Key

## Installation & Setup

1. **Clone the repository** (if you haven't already):
   ```bash
   git clone https://github.com/SUBRAHMANYA2726/SkillBridge-AI.git
   cd SkillBridge-AI
   ```

2. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
   The frontend will start at `http://localhost:5173`.

3. **Backend Setup**:
   ```bash
   cd ../backend
   npm install
   ```
   - Rename `.env.example` to `.env` and fill in your keys.
   - Place your `firebase-service-account.json` in the `backend/` folder.
   - Start the backend:
   ```bash
   npm run dev
   ```
   The backend will start at `http://localhost:5000`.

## Deployment Instructions (Vercel)

The frontend is fully optimized for Vercel deployment.

1. Create a free account at [Vercel](https://vercel.com).
2. Connect your GitHub account and import the `SkillBridge-AI` repository.
3. **Important**: When importing, set the **Root Directory** to `frontend`.
4. Vercel will automatically detect Vite and set the build commands (`npm run build`).
5. Click **Deploy**. Your stunning React app will be live within seconds!

## License
Owned by SUBRAHMANYA2726.

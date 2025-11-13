Goal Tracker (React + Vite + Firebase)

A lightweight goal-tracking app where users can create, edit, complete, and delete goals, earn points for completed goals, unlock badges, and organize everything by category (Home, Groceries, Errands, Health, Beauty, etc.). Built with React + Vite + Tailwind on the front end and Firebase (Auth, Firestore) on the back end.

✨ Features

Add, edit, delete goals

Mark goals complete/incomplete

Points & Badges: +1 point per completed goal, 1 badge every 5 points

Categories: group goals and see per-category counts

Clean, minimal UI with modal forms

Real-time sync via Firestore listeners

🧱 Tech Stack

React 18 + Vite

Tailwind CSS

Firebase (Auth, Firestore, Security Rules)

ESLint + HMR (Vite)

📂 Project Structure (key files)
src/
  components/
    GoalForm.jsx      // create/edit goal (+category)
    GoalList.jsx      // grouped by category + counts
    Modal.jsx
  hooks/
    useGoals.jsx      // Firestore CRUD + points/badges logic
    ensureUserDocs.jsx
  pages/
    Dashboard.jsx     // summary, points, badges, categories view
  App.jsx

🚀 Getting Started
1) Prereqs

Node 18+

A Firebase project with Firestore enabled

2) Install
npm install

3) Environment

Create .env.local in the project root:

VITE_FIREBASE_API_KEY=YOUR_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_DOMAIN
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET=YOUR_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_SENDER_ID
VITE_FIREBASE_APP_ID=YOUR_APP_ID

4) Run
npm run dev

🔐 Firestore Data Model
users/{uid}
  points: number            // total points
  badges_count: number      // floor(points / 5)
  createdAt, updatedAt

users/{uid}/goals/{goalId}
  title: string
  notes: string
  category: string          // e.g., "Home", "Groceries", ...
  dueDate: Timestamp|null
  completed: boolean
  createdAt: Timestamp
  updatedAt: Timestamp

Suggested Security Rules (starter)

Adjust to your needs before production.

rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, write: if request.auth != null && request.auth.uid == uid;

      match /goals/{goalId} {
        allow read, write: if request.auth != null && request.auth.uid == uid;
      }
    }
  }
}

🧮 Points & Badges Logic

Completing a goal adds +1 point; un-completing subtracts 1 (min 0).

badges_count = floor(points / 5).

Logic is handled centrally in useGoals.jsx using Firestore transactions to keep user totals consistent.

🗂 Categories

A goal has category (defaults to Uncategorized).

GoalList.jsx groups goals by category and displays Goals: N per section.

You can customize the built-in options in GoalForm.jsx (<select>).

🧪 Scripts
npm run dev       # start dev server
npm run build     # production build
npm run preview   # preview built app
npm run lint      # lint

🗺️ Roadmap

Filters (by category, due date, completed)

Search

Sort (by due date / created / title)

Leaderboard (using points)

Advanced badges (streaks, category mastery)

Offline support

🤝 Contributing

Create a feature branch: git checkout -b feat/some-feature

Commit: git commit -m "feat: add some-feature"

Push: git push origin feat/some-feature

Open a PR


# SyncBoard — Full-Stack Setup Guide

A real-time collaborative workspace app: Workspaces → Boards (Kanban tasks) + Notes (Markdown), with live sync via Socket.IO, JWT auth, role-based permissions, and file uploads.

**Stack:** React + Vite + Tailwind (frontend) · Node.js + Express + MongoDB + Socket.IO (backend)

This project was built and test-compiled already — the backend's modules all load cleanly and the frontend builds with zero errors. You just need to install dependencies and run it.

---

## 0. What you need installed first

1. **Node.js** version 18 or higher — check with `node -v`. Get it from https://nodejs.org if you don't have it.
2. **MongoDB** — you need a running MongoDB instance. Two easy options:
   - **Local:** Install MongoDB Community Server (https://www.mongodb.com/try/download/community) and make sure it's running (`mongod`).
   - **Cloud (easier, no install):** Create a free cluster at https://www.mongodb.com/cloud/atlas, and copy its connection string (looks like `mongodb+srv://user:pass@cluster.../syncboard`).
3. **VS Code** (or any editor) to open the two folders.

---

## 1. Unzip the project

Unzip `SyncBoard.zip` anywhere. You'll get two folders:

```
syncboard/
├── backend/
└── frontend/
```

Open the `syncboard` folder in VS Code (`File → Open Folder`).

---

## 2. Set up and run the backend

Open a terminal in VS Code (`` Ctrl+` ``) and run:

```bash
cd backend
npm install
cp .env.example .env
```

Now open the new `.env` file and check these values:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/syncboard
JWT_SECRET=change_this_to_a_long_random_secret
CLIENT_URL=http://localhost:5173
```

- If you're using **local MongoDB**, leave `MONGO_URI` as is.
- If you're using **MongoDB Atlas**, replace `MONGO_URI` with your Atlas connection string.
- Change `JWT_SECRET` to any long random string (this signs your login tokens).

Start the backend:

```bash
npm run dev
```

You should see:
```
MongoDB connected: mongodb://127.0.0.1:27017/syncboard
SyncBoard backend running on http://localhost:5000
```

Leave this terminal running. Test it worked by opening http://localhost:5000/api/health in a browser — you should see `{"status":"ok",...}`.

---

## 3. Set up and run the frontend

Open a **second** terminal in VS Code (click the `+` in the terminal panel) and run:

```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

You should see something like:
```
VITE ready
➜  Local:   http://localhost:5173/
```

Open **http://localhost:5173** in your browser. That's SyncBoard running.

---

## 4. Try it out

1. Click **Get Started**, register an account.
2. You'll land on the Dashboard — create your first workspace.
3. Inside the workspace, create a board (pick the "Sprint" template) and add a few tasks.
4. Open the **Notes** tab and create a note — try typing Markdown like `# Heading` or `**bold**`.
5. To test realtime sync: open the same board/note in a second browser tab (or logged in as a second user), and watch task moves and note edits appear instantly in both tabs — no refresh.
6. To test invites: register a **second account** with a different email, then from your first account go to the workspace's **Members** tab → **Invite**, and enter that second account's email.

---

## 5. Important things to know (read this before you demo it)

- **Email is stubbed, not real.** There's no SMTP/email service wired up. Accounts are auto-verified on registration (`isVerified: true`), and workspace invites require the invitee to already have a SyncBoard account (looked up by email) — there's no "pending invite" email sent. This keeps the whole thing runnable with zero external services. If you want real email flows for a production build, wire up something like Nodemailer + an SMTP provider (e.g. SendGrid, Resend) in `backend/src/controllers/authController.js` and `memberController.js`.
- **File uploads are stored locally** on disk in `backend/uploads/`, served at `http://localhost:5000/uploads/...`. Fine for local dev and demos; for real deployment, swap in S3 or Cloudinary.
- **Drag-and-drop** on the Kanban board uses plain HTML5 drag events (no extra library) — drag a task card into another column to move it.
- Both servers need to be running at the same time (backend on port 5000, frontend on port 5173) for the app to work.

---

## 6. Project structure

```
syncboard/
├── backend/
│   ├── src/
│   │   ├── config/         → MongoDB connection
│   │   ├── models/         → User, Workspace, Board, Task, Note, Notification
│   │   ├── middleware/     → JWT auth, file upload (Multer), error handling
│   │   ├── controllers/    → business logic per resource
│   │   ├── routes/         → Express route definitions
│   │   ├── sockets/        → Socket.IO real-time event handlers
│   │   ├── utils/          → JWT signing, role/permission checks
│   │   └── server.js       → app entry point
│   ├── uploads/            → uploaded files land here
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── pages/           → Landing, Login, Register, Dashboard, Workspace, Board, Settings
    │   ├── components/      → AppShell, TaskCard, modals, NotesTab, MembersTab, etc.
    │   ├── context/         → AuthContext, SocketContext
    │   ├── services/        → axios API calls
    │   └── hooks/            → useWorkspaces
    └── package.json
```

---

## 7. Deploying later (optional)

- **Backend →** Render, Railway, or Fly.io. Set the same env vars from `.env` in their dashboard, plus point `MONGO_URI` at Atlas.
- **Frontend →** Vercel or Netlify. Set `VITE_API_URL` to your deployed backend's URL (e.g. `https://syncboard-api.onrender.com/api`).
- Don't forget to update `CLIENT_URL` in the backend's env to your deployed frontend's URL, so CORS and Socket.IO allow it.

---

That's the whole thing. If `npm run dev` throws an error on either side, it's almost always one of: MongoDB not running/wrong `MONGO_URI`, or a missing `.env` file (make sure you ran the `cp .env.example .env` step in both folders).

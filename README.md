# DBMS Project

This is a full-stack DBMS project that includes:
- **Frontend**: Built with Vite, React, and Tailwind CSS
- **Backend**: Node.js + Express + PostgreSQL

## 🧩 Project Structure
```
dbms-project/
├── dbms-project-client/   # Frontend React App
└── dbms-project-server/   # Backend Express Server
```

---

## 📦 Installation & Setup

### 1. Backend (`dbms-project-server`)

#### Install dependencies
```bash
cd dbms-project-server
npm install
```

#### Create a `.env` file
Example:
```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/your_db_name
```

#### Run the backend
```bash
npm run dev
```

### 2. Frontend (`dbms-project-client`)

#### Install dependencies
```bash
cd dbms-project-client
npm install
```

#### Install Tailwind CSS
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

#### Configure Tailwind
Update `tailwind.config.js`:
```js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}
```

#### Add Tailwind to CSS
In `src/index.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### Run the frontend
```bash
npm run dev
```

---

## 🧠 Install pgAdmin 4

pgAdmin is a GUI for PostgreSQL.

### Windows
1. Download from: https://www.pgadmin.org/download/pgadmin-4-windows/
2. Install and launch

### macOS (via Homebrew)
```bash
brew install --cask pgadmin4
```

### Linux (Debian-based)
```bash
sudo apt update
sudo apt install pgadmin4
```

---

## ✅ Final Notes
- Make sure PostgreSQL is installed and running.
- Always ensure your `.env` file is not committed.
- Use pgAdmin 4 or any SQL client to manage your DB.

> Happy Hacking 🎯

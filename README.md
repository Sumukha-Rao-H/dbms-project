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

#### Run the frontend
```bash
npm start
```

---
## 🐘 Install PostgreSQL & pgAdmin 4

📥 Installing PostgreSQL
Download PostgreSQL from the official site:
👉 https://www.postgresql.org/download/

Follow the installer instructions and note the following:
- Choose a username (default is postgres)
- Set a password
- Default port is usually 5432

After installation:
- Open pgAdmin 4 to connect to your PostgreSQL instance
- Create a new database named your_db_name

⚠️ Make sure PostgreSQL service is running before you run the backend.


---

## ✅ Final Notes
- Make sure PostgreSQL is installed and running.
- Always ensure your `.env` file is not committed.
- Use pgAdmin 4 or any SQL client to manage your DB.

> Happy Hacking 🎯

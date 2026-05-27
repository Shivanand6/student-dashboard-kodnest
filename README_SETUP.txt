
# Student Management System

## Project Structure

- Frontend: React + Tailwind
- Backend: Flask (Python)

---

# Run Frontend Locally

## Step 1
Open terminal:

cd scholastic-aesthetics-main

## Step 2
Install packages:

npm install

## Step 3
Run frontend:

npm run dev

Frontend runs at:
http://localhost:3000

---

# Run Backend Locally

## Step 1
Open new terminal:

cd backend

## Step 2
Install backend packages:

pip install -r requirements.txt

## Step 3
Run backend:

python app.py

Backend runs at:
http://127.0.0.1:5000

---

# Connect Frontend + Backend

Already connected inside:
src/services/api.ts

---

# Deploy Backend on Render

## Step 1
Push backend folder to GitHub

## Step 2
Open:
https://render.com

## Step 3
Create New Web Service

## Step 4
Connect GitHub repo

## Step 5
Settings:

Build Command:
pip install -r requirements.txt

Start Command:
gunicorn app:app

## Step 6
Deploy

You will get:
https://your-backend.onrender.com

---

# Deploy Frontend on Vercel

## Step 1
Push frontend to GitHub

## Step 2
Open:
https://vercel.com

## Step 3
Import Project

## Step 4
Framework:
Vite / React

## Step 5
Deploy

---

# IMPORTANT AFTER DEPLOY

Replace API URL in:

src/services/api.ts

FROM:
http://127.0.0.1:5000

TO:
https://your-backend.onrender.com

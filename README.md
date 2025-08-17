# BidConnect Platform

## Overview
BidConnect is a **full-stack freelance project bidding platform** designed to connect **employers** who have projects with **freelancers** looking for work.  
It streamlines the process of posting projects, receiving competitive bids, and hiring the right talent — all in a secure, role-based environment.

On the **employer** side, users can create detailed project listings with clear descriptions, budgets, and timelines. Employers can then review all bids submitted by freelancers, compare offers, and make informed hiring decisions.  

On the **freelancer** side, users can browse available projects, submit tailored bids that include price, estimated delivery time, and a personalized cover letter. Freelancers can also view their own bid status for each project they’ve applied to.  

The application is built with **React** for the frontend, **Node.js + Express** for the backend, and **MongoDB Atlas** for database storage.  
Security is enforced using **JWT-based authentication** and **role-based access control (RBAC)**, ensuring that employers and freelancers have access only to the features relevant to their roles.

BidConnect’s clean and modern interface ensures ease of use, while backend validations and error handling provide a smooth and reliable user experience.  

---

## Features

### 🔹 Employer
- **Sign Up / Login / Logout**
- **Create and publish projects**
- **Edit and delete own projects**
- **View all bids for a project**

### 🔹 Freelancer
- **Sign Up / Login / Logout**
- **Browse available projects**
- **Submit bids with amount, delivery time, and cover letter**
- **View own bid status for each project**
- **Edit own bid before acceptance**

---

## Tech Stack

**Frontend:**
- React.js
- Tailwind CSS
- Axios

**Backend:**
- Node.js
- Express.js
- MongoDB Atlas

**Security:**
- JWT Authentication
- Role-Based Access Control

---

## Project Setup Instructions  

1. **Clone the repository:**  
```bash
git clone https://github.com/Ghazal-OJ/BidConnect.git
cd BidConnect
```

2. **Install dependencies for backend and frontend:**  
```bash
cd backend
npm install

cd ../frontend
npm install
```

3. **Run the application**  
```bash
# Start backend
cd backend
npm start

# Start frontend
cd ../frontend
npm start
```

---

## Public URL
http://13.210.241.10

---

## Test Accounts

**Employer**  
- Email: `ghazal98test@gmail.com`  
- Password: `Test@123`

**Freelancer**  
- Email: `gh1999test@gmail.com`  
- Password: `Test@123123`

---

## Repository Structure
```
BidConnect/
│── backend/          # Node.js + Express backend
│── frontend/         # React frontend
│── README.md         # Project documentation
│── package.json      # Project configs
```

---

## Notes
- Ensure Node.js and npm are installed.  
- Ensure MongoDB Atlas connection string is correctly set in the `.env` file.  
- Instructor can log in using the provided test accounts.  

---

## Prerequisites
Before running the application, make sure you have:

- **Node.js** → [Download & Install](https://nodejs.org/en)  
- **Git** → [Download & Install](https://git-scm.com/)  
- **VS Code** → [Download & Install](https://code.visualstudio.com/)  
- **MongoDB Atlas Account** → [Sign Up](https://account.mongodb.com/account/login)  
- **GitHub Account** → [Sign Up](https://github.com/signup)
# BidConnect Frontend

## Overview
The **frontend** of BidConnect is built with **React.js** and styled using **Tailwind CSS**.  
It provides a clean and modern user interface for both **employers** and **freelancers**, allowing them to interact with the backend APIs in a seamless way.

Employers can create and manage projects, while freelancers can browse projects and submit bids — all within a responsive web application.

---

## Features
- **Employer Side**
  - Login, Register, Logout
  - Create, edit, and delete projects
  - View all freelancer bids for a project  

- **Freelancer Side**
  - Login, Register, Logout
  - Browse projects
  - Submit and edit bids before acceptance
  - Track bid status  

- **General**
  - JWT Authentication integrated with backend
  - Role-based access UI rendering
  - Responsive design using Tailwind CSS

---

## Tech Stack
- **React.js**
- **Tailwind CSS**
- **Axios** (for backend API calls)
- **React Router DOM**

---

## Setup Instructions

1. Navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will be available at:
```
http://localhost:3000
```

---

## Backend Connection
The frontend communicates with the backend (`Node.js + Express`) through REST APIs.  
Make sure the **backend server is running** before using the frontend.  

In your `.env` file (inside `frontend/`), configure the API endpoint:
```
REACT_APP_API_URL=http://localhost:5000
```

For production (deployed version), update this URL to your EC2 public IP:
```
REACT_APP_API_URL=http://13.210.241.10
```

---

## Project Structure
```
frontend/
│── public/              # Static files
│── src/
│   ├── components/      # Reusable UI components
│   ├── pages/           # Application pages (Login, Register, Projects, etc.)
│   ├── assets/          # Images, logos
│   ├── App.js           # Root component
│   └── index.js         # Entry point
│── package.json
│── README.md            # Frontend documentation
```

---

## Test Accounts
Use these credentials to log in through the frontend UI:

### Employer
- **Email:** `ghazal98test@gmail.com`  
- **Password:** `Test@123`

### Freelancer
- **Email:** `gh1999test@gmail.com`  
- **Password:** `Test@123123`

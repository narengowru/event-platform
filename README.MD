
---

# 🎉 Event Platform – Full Stack Application

A full-stack web application that allows users to create, view, and RSVP to events with real-time capacity management.
Built as part of a technical assessment to demonstrate full-stack development skills using the **MERN stack**.

---

## 🧰 Tech Stack

### Frontend

* **React (Vite)**
* JavaScript (ES6+)
* Axios
* React Router
* CSS / Tailwind

### Backend

* **Node.js**
* **Express.js**
* **MongoDB (Mongoose)**
* JWT Authentication
* Cloudinary (Image Uploads)

---

## 📁 Project Structure

```
event-platform/
│
├── client/                 # Frontend (Vite + React)
│   ├── src/
│   └── package.json
│
├── server/                 # Backend (Node + Express)
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/narengowru/event-platform.git
cd event-platform
```

---

## 🖥️ Backend Setup

### Step 1: Install Dependencies

```bash
cd server
npm install
```

### Step 2: Create `.env` File

Inside the **server/** folder, create a `.env` file:

```env
# Server Configuration
PORT=5000
NODE_ENV=development

# MongoDB Configuration
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/?retryWrites=true&w=majority

# JWT Configuration
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=7d

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Frontend URL
CLIENT_URL=http://localhost:5173
```

> ⚠️ Never push your `.env` file to GitHub.
> Make sure `.env` is added to `.gitignore`.

---

### Step 3: Run Backend Server

```bash
node server.js
```

Backend will run on:

```
http://localhost:5000
```

---

## 🌐 Frontend Setup

### Step 1: Install Dependencies

```bash
cd client
npm install
```

### Step 2: Create `.env` File

Inside the **client/** directory:

```env
VITE_API_URL=http://localhost:5000/api
```

> ⚠️ Vite requires environment variables to start with `VITE_`.

---

### Step 3: Run Frontend

```bash
npm run dev
```

Frontend will be available at:

```
http://localhost:5173
```

---

## 🔐 Authentication Flow

* Users can **register and log in**
* JWT tokens are issued on login
* Protected routes require valid authentication
* Token is sent in request headers for API access

---

## 🧠 RSVP Capacity Handling (Core Logic)

To prevent overbooking and handle concurrent requests safely:

### Strategy Used:

* Each event has:

  * `capacity`
  * `attendeesCount`
* When a user clicks **RSVP**:

  * The backend performs an **atomic MongoDB update**
  * Only allows RSVP if `attendeesCount < capacity`

### Example Logic:

```js
await Event.findOneAndUpdate(
  { _id: eventId, attendeesCount: { $lt: capacity } },
  { $inc: { attendeesCount: 1 }, $push: { attendees: userId } }
);
```

### ✅ Result:

* Prevents race conditions
* No overbooking
* Safe concurrent access

---

## ✨ Features Implemented

* User authentication (JWT)
* Event creation & management
* RSVP system with capacity validation
* Image uploads using Cloudinary
* Secure API routes
* Clean and responsive UI
* Scalable backend architecture

---

## 📌 Notes

* Make sure MongoDB Atlas IP access allows your IP
* Restart servers after changing `.env`
* Recommended Node version: **18+**

---

## 👨‍💻 Author

**Naren Gowru**
GitHub: [https://github.com/narengowru](https://github.com/narengowru)

---

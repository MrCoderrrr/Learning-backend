# 🎥 VideoTube - Full Stack Video Sharing Platform

A production-grade video hosting and social media platform built with the MERN stack (MongoDB, Express, React, Node.js), featuring a robust backend API and a modern, responsive frontend.

---

## 🚀 Features

### **Backend (API)**
- **User Authentication:** Dual-token JWT strategy (Access & Refresh tokens) with HTTP-only cookies.
- **API Key Security:** Global API key authentication for system-level access.
- **Video Management:** Upload, publish/unpublish, edit, and delete videos with Cloudinary integration.
- **Social Interactions:** 
  - **Likes:** Polymorphic liking system for videos, comments, and tweets.
  - **Comments:** Add, edit, and delete comments on videos.
  - **Tweets:** Create and manage short text posts.
- **Subscribing:** Follow channels and track subscriber counts.
- **Playlists:** Create and manage collections of videos.
- **Dashboard:** Comprehensive channel analytics and video management.
- **Search & Pagination:** Advanced aggregation pipelines for efficient data retrieval.

### **Frontend (UI)**
- **Modern UI:** Built with React 19 and Tailwind CSS for a sleek, responsive design.
- **State Management:** Powered by TanStack Query (React Query) for efficient data fetching and caching.
- **Routing:** Client-side navigation with React Router 7.
- **Responsive Layout:** Mobile-first approach ensuring a seamless experience across devices.

---

## 🛠️ Tech Stack

### **Backend**
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Media Storage:** Cloudinary
- **Auth:** JSON Web Tokens (JWT), Bcrypt, API Key
- **File Handling:** Multer

### **Frontend**
- **Framework:** React 19 (TypeScript)
- **Build Tool:** Vite
- **Styling:** Tailwind CSS
- **Data Fetching:** Axios, TanStack Query
- **Routing:** React Router DOM

---

## 📂 Project Structure

```
project/
├── backend/            # Express API
│   ├── src/
│   │   ├── controllers/ # Business logic
│   │   ├── models/      # Mongoose schemas
│   │   ├── routes/      # API endpoints
│   │   └── middlewares/ # Auth & Security
├── frontend/           # React Application
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── pages/       # View components
│   │   └── lib/         # API utilities
└── README.md           # Root documentation
```

---

## ⚙️ Getting Started

### **Prerequisites**
- Node.js (v18+)
- MongoDB Atlas account or local instance
- Cloudinary account

### **1. Clone the repository**
```bash
git clone https://github.com/your-username/videotube.git
cd videotube
```

### **2. Setup Backend**
```bash
cd backend
npm install
cp .env.example .env # Fill in your environment variables
npm run dev
```

**Backend `.env` Requirements:**
```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_name
CLOUDINARY_API_KEY=your_key
CLOUDINARY_API_SECRET=your_secret
API_KEY=your_global_api_key_here
```

### **3. Setup Frontend**
```bash
cd ../frontend
npm install
npm run dev
```

---

## 📡 API Documentation

All API routes are prefixed with `/api/v1`.

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| POST | `/users/register` | Register a new user | No |
| POST | `/users/login` | Login user | No |
| GET | `/videos` | Get all videos (paginated) | No |
| POST | `/videos` | Upload a video | JWT |
| POST | `/comments/:videoId` | Add a comment | JWT |
| POST | `/likes/toggle/v/:videoId` | Toggle like on video | JWT |

*(For a full list of endpoints, refer to the `backend/src/routes` directory)*

---

## 👨‍💻 Author

**Vanshil Patel**
- [GitHub](https://github.com/MrCoderrrr)
- [LinkedIn](https://linkedin.com)

---

## 📄 License
This project is licensed under the ISC License.

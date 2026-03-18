<div align="center">

# 🎬 YouTube Clone — Backend API

A production-grade REST API for a video-sharing platform built with **Node.js**, **Express.js**, **MongoDB**, and **Cloudinary**.

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=flat-square&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=flat-square&logo=jsonwebtokens)](https://jwt.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?style=flat-square&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

</div>

---

## 📌 Overview

This backend replicates the core functionality of YouTube — user authentication, video management, social interactions (likes, comments, subscriptions), and channel analytics — organized across **8 modular API domains**.

---

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── controllers/     # Business logic (one file per domain)
│   ├── models/          # Mongoose schemas
│   ├── routes/          # Express routers
│   ├── middlewares/     # Auth (JWT) + Multer (file upload)
│   ├── utils/           # ApiError, ApiResponse, asyncHandler, cloudinary
│   ├── db/              # MongoDB connection
│   ├── app.js           # Express setup
│   └── index.js         # Entry point
├── public/temp/         # Temporary local storage (Multer)
└── .env.example
```

---

## ⚙️ Local Setup

```bash
# 1. Clone and navigate
git clone https://github.com/vanshilpatel/youtube-clone-backend.git
cd youtube-clone-backend/backend

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env   # Fill in all values

# 4. Start the server
npm run dev            # Runs on http://localhost:8000
```

### Environment Variables

```env
PORT=8000
CORS_ORIGIN=*
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net
ACCESS_TOKEN_SECRET=your_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## 📡 API Domains

All routes are prefixed with `/api/v1`. ✅ = requires JWT auth.

| Domain | Base Route | Key Endpoints |
|---|---|---|
| 👤 **Users** | `/users` | register, login, logout, refresh-token, update profile, avatar, watch history |
| 🎬 **Videos** | `/videos` | upload, get feed (paginated + search), update, delete, toggle publish |
| 💬 **Comments** | `/comments` | add, edit, delete, get all for a video |
| ❤️ **Likes** | `/likes` | toggle like on video / comment / tweet, get liked videos |
| 🐦 **Tweets** | `/tweets` | create, update, delete, get by user |
| 🔔 **Subscriptions** | `/subscriptions` | toggle subscribe, get subscribers, get subscribed channels |
| 📂 **Playlists** | `/playlists` | create, update, delete, add/remove videos, get by user |
| 📊 **Dashboard** | `/dashboard` | channel stats (views, subs, likes), all uploaded videos |

---

## 🔒 Auth Flow

Uses a **dual-token JWT strategy** — short-lived access tokens (1d) and long-lived refresh tokens (10d), both stored in **HTTP-only cookies** to prevent XSS attacks. Refresh tokens are persisted in the database for revocation control.

```
Login → access token (1d) + refresh token (10d) → stored in HTTP-only cookies
Token expired? → POST /refresh-token → new access token issued
Logout → tokens cleared from cookies + DB
```

---

## ☁️ Media Pipeline

```
Client (multipart/form-data)
    → Multer saves file to /public/temp/
    → Controller calls Cloudinary upload utility
    → File uploaded to Cloudinary, secure URL returned
    → Local temp file deleted (fs.unlinkSync)
    → URL stored in MongoDB
```

---

## 🛠️ Key Engineering Decisions

- **Polymorphic Like model** — a single `Like` schema handles likes on videos, comments, and tweets using optional reference fields
- **MongoDB Aggregation Pipelines** — used for channel stats, subscriber counts, watch history (nested `$lookup`), and paginated video feeds via `mongoose-aggregate-paginate-v2`
- **Utility wrappers** — `asyncHandler` removes try-catch boilerplate; `ApiResponse` and `ApiError` standardize all responses

---

## 👨‍💻 Author

**Vanshil Patel** — B.Tech ICT, PDEU University · CGPA: 9.12

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Vanshil_Patel-0A66C2?style=flat&logo=linkedin)](https://linkedin.com)
[![GitHub](https://img.shields.io/badge/GitHub-Profile-181717?style=flat&logo=github)](https://github.com)
[![LeetCode](https://img.shields.io/badge/LeetCode-170%2B_Solved-FFA116?style=flat&logo=leetcode)](https://leetcode.com)
[![Codeforces](https://img.shields.io/badge/Codeforces-1176_Rating-1F8ACB?style=flat&logo=codeforces)](https://codeforces.com)
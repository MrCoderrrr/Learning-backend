<div align="center">

# 📺 YouTube Clone — Backend API

### A production-grade REST API replicating the core backend of YouTube
Built with **Node.js · Express.js · MongoDB · JWT · Cloudinary**

[![Node.js](https://img.shields.io/badge/Node.js-18.x-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express.js-4.x-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
[![JWT](https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)](https://jwt.io/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Media-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)](https://cloudinary.com/)

</div>

---

## 🗂️ Repository Structure

```
youtube-clone-backend/
└── backend/           ← Full Node.js/Express backend application
    ├── src/
    │   ├── controllers/
    │   ├── models/
    │   ├── routes/
    │   ├── middlewares/
    │   └── utils/
    ├── .env.example
    ├── package.json
    └── README.md      ← Developer setup & API docs
```

> 📌 The entire application lives inside the [`/backend`](./backend) folder. Head there for full setup instructions, API documentation, and environment configuration.

---

## 🚀 What This Project Does

This project implements a **full-featured video-sharing platform backend** — covering everything from secure authentication to media uploads, social interactions, and analytics — across **8 well-structured API domains**.

| Domain | Responsibility |
|---|---|
| 👤 Users | Registration, login, profile, avatar/cover upload |
| 🎬 Videos | Upload, publish/unpublish, search, pagination |
| 💬 Comments | Add, edit, delete comments on videos |
| ❤️ Likes | Polymorphic likes on videos, comments & tweets |
| 🐦 Tweets | Short-form text post creation and management |
| 🔔 Subscriptions | Subscribe/unsubscribe, channel & subscriber lists |
| 📂 Playlists | Create, manage, add/remove videos |
| 📊 Dashboard | Channel stats, upload history, aggregated analytics |

---

## ✨ Key Engineering Highlights

- 🔐 **Dual-token JWT Auth** — Short-lived access tokens + long-lived refresh tokens in HTTP-only cookies (XSS-safe)
- ☁️ **Cloudinary Pipeline** — Multer handles temporary local storage; files auto-upload to Cloudinary with local cleanup
- 🔁 **Polymorphic Like System** — Single `Like` model handles likes across videos, comments, and tweets
- 📊 **Aggregation Pipelines** — MongoDB aggregations power channel stats, watch history, subscriber counts & paginated feeds
- 🧱 **Standardized API Design** — Custom `ApiResponse`, `ApiError`, and `asyncHandler` utilities for clean, consistent DX
- 📄 **Paginated Video Feed** — `mongoose-aggregate-paginate-v2` for efficient, scalable video listing

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB + Mongoose ODM |
| Authentication | JWT (Access + Refresh Tokens) |
| Media Storage | Cloudinary + Multer |
| API Testing | Postman |
| Version Control | Git + GitHub |

---

## 👨‍💻 Author

**Vanshil Patel**
B.Tech ICT @ PDEU University · Minor in Computational Data Science · CGPA: 9.12

[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=flat&logo=linkedin)](https://linkedin.com)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-181717?style=flat&logo=github)](https://github.com)
[![LeetCode](https://img.shields.io/badge/LeetCode-170%2B%20Problems-FFA116?style=flat&logo=leetcode)](https://leetcode.com)

---

<div align="center">
  <sub>⭐ If you found this useful, consider starring the repository!</sub>
</div>

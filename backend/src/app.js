import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((origin) => origin.trim())
  : [];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
import commentRouter from "./routes/comment.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import likesRouter from "./routes/likes.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import subscriptionRouter from "./routes/subscription.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import videoRouter from "./routes/video.routes.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/likes", likesRouter);
app.use("/api/v1/playlist", playlistRouter);
app.use("/api/v1/subscriptions", subscriptionRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/videos", videoRouter);

app.use((err, req, res, next) => {
  const statusCode = err?.statusCode || 500;
  const message = err?.message || "Internal server error";

  return res.status(statusCode).json({
    success: false,
    message,
    errors: err?.error || [],
  });
});

export { app };

import express from "express";
import connectDB from "./lib/connectDB.js";
import userRouter from "./routes/user.route.js";
import postRouter from "./routes/post.route.js";
import commentRouter from "./routes/comment.route.js";
import webhookRouter from "./routes/webhook.route.js";
import heroRouter from "./routes/heroRoutes.js";
import expertRouter from "./routes/expertRoutes.js";
import carouselRouter from "./routes/carousel.js";
import categoriesRouter from "./routes/categories.js";
import blogTeasersRouter from "./routes/blogTeasers.js";
import instructorCTAsRouter from "./routes/instructorCTAs.js";
import faqsRouter from "./routes/faqs.js";
import couponRouter from "./routes/Coupon.js";
import courseRouter from './routes/Course.js';
import eventRouter from "./routes/Event.js";
import talentRouter from "./routes/Talent.js";
import contactRoutes from "./routes/Contact.js";
import newsletterRouter from "./routes/Newsletter.js";
import { clerkMiddleware } from '@clerk/express';
import cors from "cors";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH']
}));
app.use(clerkMiddleware());
app.use("/webhooks", webhookRouter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Public routes
app.use("/users", userRouter);
app.use("/posts", postRouter);
app.use("/comments", commentRouter);
app.use('/api/hero', heroRouter);
app.use('/api/experts', expertRouter);
app.use('/api/carousel', carouselRouter);
app.use('/api/blogTeasers', blogTeasersRouter);
app.use('/api/instructorCTAs', instructorCTAsRouter);
app.use('/api/faqs', faqsRouter);
app.use('/api/coupons', couponRouter);
app.use('/api/events', eventRouter);
app.use('/api/talents', talentRouter);
app.use("/", contactRoutes);
app.use("/", newsletterRouter);

// Protected admin routes
app.use('/api/courses', courseRouter); // We'll protect specific routes in the router
app.use('/api/categories', categoriesRouter); // We'll protect specific routes in the router

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    message: error.message || "Something went wrong!",
    status: error.status,
    stack: error.stack,
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is running on port ${PORT}`);
});


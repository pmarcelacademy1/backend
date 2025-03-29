// routes/post.routes.js
import express from "express";
import { getPosts, getPost, createPost, deletePost, uploadAuth, featurePost, addCategory, removeCategory, getCategories } from "../controllers/post.controller.js";
import increaseVisit from "../middlewares/increaseVisit.js";
import { ClerkExpressWithAuth } from "@clerk/clerk-sdk-node";

const router = express.Router();

// Public route (no auth)
router.get("/categories", getCategories);
router.get("/upload-auth", uploadAuth);
router.get("/",getPosts);
router.get("/:slug", increaseVisit, getPost);
router.post("/", createPost);
router.delete("/:id", deletePost);
router.patch("/feature", featurePost);


// Authenticated routes
const authRouter = express.Router();
authRouter.use(ClerkExpressWithAuth());
authRouter.post("/category", addCategory);
authRouter.delete("/category/:name", removeCategory);

router.use(authRouter);

export default router;
import { Router } from "express";
import {
  getAllPosts,
  getPostById,
  createPost,
  updatePost,
  publishPost,
  deletePost,
} from "../controllers/post.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

// Public routes
router.get("/", getAllPosts);
router.get("/:id", getPostById);

// Protected routes (only AUTHORS can modify posts)
router.post("/", authenticate, authorize([Role.AUTHOR]), createPost);
router.put("/:id", authenticate, authorize([Role.AUTHOR]), updatePost);
router.patch("/:id/publish", authenticate, authorize([Role.AUTHOR]), publishPost);
router.delete("/:id", authenticate, authorize([Role.AUTHOR]), deletePost);

export default router;

import { Router } from "express";
import {
  getCommentsForPost,
  getCommentById,
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller";
import { authenticate, authorize } from "../middleware/auth.middleware";
import { Role } from "@prisma/client";

const router = Router();

// Public routes
router.get("/posts/:postId/comments", getCommentsForPost); // list all comments for a post
router.get("/:id", getCommentById); // get a single comment by ID

// Protected routes (must be logged in)
router.post("/posts/:postId/comments", authenticate, authorize([Role.USER, Role.AUTHOR]), createComment); 

// Update & delete must be by owner only (logged-in user)
router.put("/:id", authenticate, updateComment); // owner check happens inside controller
router.delete("/:id", authenticate, deleteComment); // owner check happens inside controller

export default router;

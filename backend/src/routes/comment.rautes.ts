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
router.get("/posts/:postId/comments", getCommentsForPost);
router.get("/:id", getCommentById);

// Protected routes (must be logged in)
router.post("/posts/:postId/comments", authenticate, authorize([Role.USER, Role.AUTHOR]), createComment); 

router.put("/:id", authenticate, updateComment); // 
router.delete("/:id", authenticate, deleteComment); // 

export default router;

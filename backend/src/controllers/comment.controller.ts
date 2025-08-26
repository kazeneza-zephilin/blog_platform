import { Request, Response } from "express";
import prisma from "../prisma/client";
import { AuthenticatedRequest } from "../types/customRequest";

// added customized type for id parsing error messages
const parseId = (id: string, name: string) => {
    const parsed = Number(id);
    if (isNaN(parsed)) throw new Error(`Invalid ${name} ID`);
    return parsed;
};

// GET /api/posts/:postId/comments
export const getCommentsForPost = async (req: Request, res: Response) => {
    try {
        const postId = parseId(req.params.postId, "post");

        const comments = await prisma.comment.findMany({
            where: { postId },
            include: {
                author: { select: { id: true, username: true } },
            },
            orderBy: { createdAt: "asc" },
        });

        res.json(comments);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to fetch comments" });
    }
};

// GET /api/comments/:id
export const getCommentById = async (req: Request, res: Response) => {
    try {
        const id = parseId(req.params.id, "comment");

        const comment = await prisma.comment.findUnique({
            where: { id },
            include: {
                author: { select: { id: true, username: true } },
                post: { select: { id: true, title: true } },
            },
        });

        if (!comment)
            return res.status(404).json({ message: "Comment not found" }); // 404 not found

        res.json(comment);
    } catch (error: any) {
        res.status(400).json({
            message: error.message || "Failed to fetch comment",
        });
    }
};

// POST /api/posts/:postId/comments
export const createComment = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res
                .status(401)
                .json({ message: "Unauthorized. Please log in." }); // 401 unauthorized
        }

        const postId = parseId(req.params.postId, "post");
        const { content } = req.body;

        if (!content) {
            return res.status(400).json({ message: "Content is required" });
        }

        const comment = await prisma.comment.create({
            data: {
                content,
                postId,
                authorId: req.user.id, // from middleware
            },
        });

        res.status(201).json(comment);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to create comment" });
    }
};

// PUT /api/comments/:id
export const updateComment = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res
                .status(401)
                .json({ message: "Unauthorized. Please log in." });
        }

        const commentId = parseId(req.params.id, "comment");
        const { content } = req.body;

        const existing = await prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!existing)
            return res.status(404).json({ message: "Comment not found" });

        if (existing.authorId !== req.user.id) {
            return res.status(403).json({
                message: "Forbidden. You can only update your own comments.",
            });
        }

        const updated = await prisma.comment.update({
            where: { id: commentId },
            data: { content },
        });

        res.json(updated);
    } catch (error) {
        res.status(400).json({ error: "Failed to update comment" });
    }
};

// DELETE /api/comments/:id
export const deleteComment = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) {
            return res
                .status(401)
                .json({ message: "Unauthorized. Please log in." });
        }

        const commentId = parseId(req.params.id, "comment");

        const existing = await prisma.comment.findUnique({
            where: { id: commentId },
        });
        if (!existing)
            return res.status(404).json({ message: "Comment not found" });

        if (existing.authorId !== req.user.id) {
            return res.status(403).json({
                message: "Forbidden. You can only delete your own comments.",
            });
        }

        await prisma.comment.delete({ where: { id: commentId } });
        res.json({ message: "Comment deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to delete comment" });
    }
};

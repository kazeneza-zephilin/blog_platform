import { Request, Response } from "express";
import prisma from "../prisma/client";
import { AuthenticatedRequest } from "../types/customRequest";

const parsePostId = (id: string) => {
    const postId = Number(id);
    if (isNaN(postId)) {
        throw new Error("Invalid post ID");
    }
    return postId;
};

const getAllPosts = async (req: Request, res: Response) => {
    try {
        const posts = await prisma.post.findMany({
            where: { published: true },
            include: { author: { select: { id: true, username: true } } },
            orderBy: { createdAt: "desc" },
        });
        res.json(posts);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "failed to fetch posts" });
    }
};

const getPostById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const post = await prisma.post.findUnique({
            where: { id: Number(id) }, // or +id
            include: { author: { select: { id: true, username: true } } },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "failed to fetch post" });
    }
};

const createPost = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const { title, content } = req.body;
        if (!title || !content) {
            return res
                .status(400)
                .json({ error: "Title and content are required" }); //400 bad request
        }
        const newPost = await prisma.post.create({
            data: {
                title,
                content,
                authorId: req.user!.id, // from authMiddleware
            },
        });
        res.status(201).json(newPost);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "failed to create post" });
    }
};

const updatePost = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const id = parsePostId(req.params.id);
        const { title, content } = req.body;
        if (!title && !content) {
            return res
                .status(400)
                .json({ error: "Title or content is required to update" });
        }
        const post = await prisma.post.findUnique({ where: { id } });
        if (!post) return res.status(404).json({ error: "Post not found" }); //404 not found

        const updatedPost = await prisma.post.update({
            where: { id },
            data: {
                title: title || post.title,
                content: content || post.content,
                published: false, // unpublish on update
            },
        });
        res.json(updatedPost);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "failed to update post" });
    }
};

//patch /:id/publish
const publishPost = async (req: AuthenticatedRequest, res: Response) => { //any for req.user
    try {
        const id = parsePostId(req.params.id);
        const post = await prisma.post.findUnique({ where: { id } });
        if (!post) return res.status(404).json({ message: "Post not found" });

        // Only author can publish/unpublish
        if (post.authorId !== req.user!.id)
            return res
                .status(403)
                .json({ message: "You can only publish your own posts" });

        const updatedPost = await prisma.post.update({
            where: { id },
            data: { published: !post.published },
        });

        res.json({
            message: updatedPost.published
                ? "Post published"
                : "Post unpublished",
            post: updatedPost,
        });
    } catch (error: any) {
        res.status(400).json({
            message: error.message || "Failed to toggle publish status",
        });
    }
};

const deletePost = async (req: AuthenticatedRequest, res: Response) => {
    try {
        const id = parsePostId(req.params.id);
        const post = await prisma.post.findUnique({ where: { id } });
        if (!post) return res.status(404).json({ message: "Post not found" });

        if (post.authorId !== req.user!.id)
            return res
                .status(403)
                .json({ message: "You can only delete your own posts" }); // 403 forbidden

        await prisma.post.delete({ where: { id } });
        res.json({ message: "Post deleted successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: "Failed to delete post" });
    }
};

export {
    getAllPosts,
    getPostById,
    createPost,
    updatePost,
    publishPost,
    deletePost,
};

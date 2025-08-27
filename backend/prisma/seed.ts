import { PrismaClient, Role } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
    // Clean up existing data
    await prisma.comment.deleteMany({});
    await prisma.post.deleteMany({});
    await prisma.user.deleteMany({});

    // Create 4 authors and 4 regular users
    const authors = [];
    const users = [];

    // Create authors
    for (let i = 1; i <= 4; i++) {
        const author = await prisma.user.create({
            data: {
                username: `author${i}`,
                email: `author${i}@example.com`,
                password: await bcrypt.hash("password123", 10),
                role: Role.AUTHOR,
            },
        });
        authors.push(author);
    }

    // Create regular users
    for (let i = 1; i <= 4; i++) {
        const user = await prisma.user.create({
            data: {
                username: `user${i}`,
                email: `user${i}@example.com`,
                password: await bcrypt.hash("password123", 10),
                role: Role.USER,
            },
        });
        users.push(user);
    }

    // Create posts for each author
    for (const author of authors) {
        const numPosts = Math.floor(Math.random() * 3) + 2; // 2-4 posts per author
        for (let i = 0; i < numPosts; i++) {
            const post = await prisma.post.create({
                data: {
                    title: `Post ${i + 1} by ${author.username}`,
                    content: `This is the content of post ${i + 1} by ${
                        author.username
                    }. Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
                    published: Math.random() > 0.3, // 70% chance of being published
                    authorId: author.id,
                },
            });

            // Add 2-5 comments per post from random users
            const numComments = Math.floor(Math.random() * 4) + 2;
            const allUsers = [...users, ...authors]; // Comments can come from any user
            for (let j = 0; j < numComments; j++) {
                const commenter =
                    allUsers[Math.floor(Math.random() * allUsers.length)];
                await prisma.comment.create({
                    data: {
                        content: `Comment ${j + 1} on "${post.title}" by ${
                            commenter.username
                        }. Great post!`,
                        postId: post.id,
                        authorId: commenter.id,
                    },
                });
            }
        }
    }

    console.log("Seed data created successfully!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });

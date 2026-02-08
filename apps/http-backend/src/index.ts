import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '@repo/config/env';
import { CreateUserSchema, SigninUserSchema, CreateRoomSchema } from "@repo/common/types";
import { prismaClient } from "@repo/db/client";
import bcrypt from "bcrypt";
import { authMiddleware } from "./middleware.js";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
    res.send("OK");
});

app.post("/signup", async (req, res) => {

    const body = req.body;
    const parsedData = CreateUserSchema.safeParse(body);
    if(!parsedData.success) {
        return res.status(400).json({
            message: parsedData.error.flatten().fieldErrors
        })
    }

    try {
        const userInfo = await prismaClient.user.create({
        data: {
            email: parsedData.data.email,
            password: await bcrypt.hash(parsedData.data.password, 10),
            name: parsedData.data.name
        }
    })

    return res.json({
        userId: userInfo.id
    })
    } catch (e) {
        return res.status(400).json({
            message: "User already exists"
        })
    }

})

app.post("/signin", async (req, res) => {

    const body = req.body;
    const parsedData = SigninUserSchema.safeParse(body);
    if(!parsedData.success) {
        return res.status(400).json({
            message: "Invalid data"
        })
    }

    const user = await prismaClient.user.findUnique({
        where: {
            email: parsedData.data.email
        }
    })

    if(!user) {
        return res.status(400).json({
            message: "User not found"
        })
    }

    const passwordMatch = await bcrypt.compare(parsedData.data.password, user.password);

    if(!passwordMatch) {
        return res.status(400).json({
            message: "Invalid password"
        })
    }

    const userInfo = await prismaClient.user.findUnique({
        where: {
            email: parsedData.data.email,
        }
    })
    if(!userInfo) {
        return res.status(400).json({
            message: "User not found"
        })
    }
    const token = jwt.sign({
        userId: userInfo.id
    }, JWT_SECRET);
    res.json({
        token
    })
})

app.post("/room", authMiddleware, async (req, res) => {

    const parsedData = CreateRoomSchema.safeParse(req.body);
    if(!parsedData.success) {
        return res.status(400).json({
            message: parsedData.error.flatten().fieldErrors
        })
    }

    // @ts-ignore
    const user = req.userId;
    try {
        const room = await prismaClient.room.create({
            data: {
                slug: parsedData.data.slug,
                adminId: user
            }
        })
        return res.json({
            roomId: room.id
        })
    } catch (e) {
        return res.status(400).json({
            message: "Room already exists with this name, please try with a diff name"
        })
    }
    
})

app.listen(3001, () => {
    console.log("Server started on port 3001");
});
import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from '@repo/config/env';
import { CreateUserSchema, SigninUserSchema, CreateRoomSchema } from "@repo/common/types";

const app = express();
app.use(express.json());

app.get("/health", (req, res) => {
    res.send("OK");
});

app.post("/signup", (req, res) => {

    const data = req.body;
    const parsedData = CreateUserSchema.safeParse(data);
    if(!parsedData.success) {
        return res.status(400).json({
            message: "Invalid data"
        })
    }
    res.json({
        userId: "123"
    })
})

app.post("/signin", (req, res) => {

    const data = req.body;
    const parsedData = SigninUserSchema.safeParse(data);
    if(!parsedData.success) {
        return res.status(400).json({
            message: "Invalid data"
        })
    }
    const userId = "123";
    const token = jwt.sign({
        userId
    }, JWT_SECRET);
    res.json({
        token
    })
})

app.post("/room", (req, res) => {

    const data = req.body;
    const parsedData = CreateRoomSchema.safeParse(data);
    if(!parsedData.success) {
        return res.status(400).json({
            message: "Invalid data"
        })
    }
    res.json({
        roomId: "123"
    })
})

app.listen(3001, () => {
    console.log("Server started on port 3001");
});
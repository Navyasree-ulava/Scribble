import { z } from "zod";

export const CreateUserSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(6).max(20),
    name: z.string()
})

export type CreateUserSchema = z.infer<typeof CreateUserSchema>;

export const SigninUserSchema = z.object({
    username: z.string().min(3).max(20),
    password: z.string().min(6).max(20)
})

export type SigninUserSchema = z.infer<typeof SigninUserSchema>;

export const CreateRoomSchema = z.object({
    name: z.string().min(3).max(20)
})

export type CreateRoomSchema = z.infer<typeof CreateRoomSchema>;
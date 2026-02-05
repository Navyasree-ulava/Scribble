import { z } from "zod";

// CreateUserSchema
export const CreateUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(20),
    name: z.string()
})

export type CreateUserSchema = z.infer<typeof CreateUserSchema>;

export const SigninUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(20)
})

export type SigninUserSchema = z.infer<typeof SigninUserSchema>;

export const CreateRoomSchema = z.object({
    slug: z.string().min(3).max(20)
})

export type CreateRoomSchema = z.infer<typeof CreateRoomSchema>;
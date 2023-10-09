import { z } from "zod";

export const userRegistrationValidator = z.object({
    fullName: z.string().min(2).max(255).optional(),
    regNo: z.string(),
    phoneNumber: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6).max(256),
    bio: z.string().optional()
});

export const userLoginValidator = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(256)
});

export const userUpdateValidator = z.object({
    fullName: z.string().min(2).max(255).optional(),
    regNo: z.string().optional(),
    phoneNumber: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).max(256).optional(),
    bio: z.string().optional()
});
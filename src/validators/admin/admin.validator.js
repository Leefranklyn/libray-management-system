import { z } from "zod";

export const adminRegistrationValidator = z.object({
    fullName: z.string().min(2).max(255).optional(),
    regNo: z.string(),
    phoneNumber: z.string().optional(),
    email: z.string().email(),
    password: z.string().min(6).max(256),
    about: z.string().optional()
});

export const adminLoginValidator = z.object({
    email: z.string().email(),
    password: z.string().min(6).max(256)
});

export const adminUpdateValidator = z.object({
    fullName: z.string().min(2).max(255).optional(),
    regNo: z.string().optional(),
    phoneNumber: z.string().optional(),
    email: z.string().email().optional(),
    password: z.string().min(6).max(256).optional(),
    about: z.string().optional()
});
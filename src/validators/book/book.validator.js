import { z } from "zod";

export const bookRegistrationValidator = z.object({
    bookName: z.string().min(2).max(255),
    authorName: z.string().min(2).max(256),
    about: z.string().min(2).max(256),
    isbn: z.string().min(6).max(256),
    hardCopyFormat: z.boolean().optional(),
    eBookFormat: z.boolean().optional(),
    audoiBookFormat: z.boolean().optional()
});

export const bookUpdateValidator = z.object({
    bookName: z.string().min(2).max(255).optional(),
    authorName: z.string().min(2).max(256).optional(),
    about: z.string().min(2).max(256).optional(),
    isbn: z.string().min(6).max(256).optional(),
    hardCopyFormat: z.boolean().optional(),
    eBookFormat: z.boolean().optional(),
    audoiBookFormat: z.boolean().optional()
});
import { z } from 'zod';

export interface Book { 
    name: string,
    author: string,
    description: string,
    price: number,
    image: string
};

export const bookSchema = z.object({
    name: z.string(),
    author: z.string(),
    description: z.string(),
    price: z.number().or(z.string()).pipe(z.coerce.number()),
    image: z.string().url({ message: "Invalid image url" })
});

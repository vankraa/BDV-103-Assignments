import { z } from 'zod';
import { MongoClient, ObjectId } from 'mongodb';

export interface Book {
    id: ObjectId,
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

export async function connectToMongoDB() {
    try {
        const client = new MongoClient('mongodb://localhost:27017');
        await client.connect();
        return client.db('mcmasterfulBooks').collection('books');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}
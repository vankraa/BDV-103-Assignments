import { z } from 'zod';
import { MongoClient, ObjectId } from 'mongodb';
import { connect, Schema } from 'mongoose'

export interface Book {
    _id?: ObjectId,
    id?: string,
    name: string,
    author: string,
    description: string,
    price: number,
    image: string
};

export function translateTo_id(book: Book): Book {
    if (book.id) {
        book._id = new ObjectId(book.id);
        delete book.id;
    }
    return book;
}

export const bookZodSchema = z.object({
    id: z.coerce.string(),
    name: z.string(),
    author: z.string(),
    description: z.string(),
    price: z.number().or(z.string()).pipe(z.coerce.number()),
    image: z.string().url({ message: "Invalid image url" })
});

export async function connectToMongoDB() {
    try {
        const client = new MongoClient('mongodb://mongo:27017');
        await client.connect()
            .then(() => console.log('Found database client'))
            .catch((err: Error) => console.error('MongoDB connection error:', err));
        return client.db('bookdb').collection('mcmasterful_books');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
}

const literalSchema = z.union([z.string(), z.number(), z.boolean(), z.null()]);
type Literal = z.infer<typeof literalSchema>;
type Json = Literal | { [key: string]: Json } | Json[];
export const jsonSchema: z.ZodType<Json> = z.lazy(() =>
  z.union([literalSchema, z.array(jsonSchema), z.record(jsonSchema)])
);

export default {
    translateTo_id,
    bookZodSchema,
    connectToMongoDB,
    jsonSchema
}
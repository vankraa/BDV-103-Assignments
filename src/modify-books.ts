import { createRouteSpec } from 'koa-zod-router';
import { z } from 'zod';
import { Book, bookSchema, connectToMongoDB } from './schema'
import { ObjectId } from 'mongodb'


const createOrUpdateBookRoute = createRouteSpec({
    method: 'post',
    path: '/update_book_list',
    handler: async (ctx) => {
        const documentCollection = connectToMongoDB();
        const book = JSON.parse(ctx.body) as Book;

        const result = (await documentCollection).updateOne(
            { _id: book.id },
            { $set: book }
        );

        if ((await result).matchedCount === 0) {
            (await documentCollection).insertOne(book);
            return;
        }
    },
    validate: {
        params: bookSchema,
        response: z.string(),
    },
});

const deleteBookRoute = createRouteSpec({
    method: 'delete',
    path: '/delete_book',
    handler: async (ctx) => {
        console.log(ctx.query);
        const documentCollection = connectToMongoDB();
        const bookId = ObjectId.createFromBase64(String(ctx.body));

        const result = (await documentCollection).deleteOne({ _id: bookId });

        if ((await result).deletedCount === 0) {
            ctx.throw(404, 'Book not found');
            return;
        }
    },
    validate: {
        params: z.string()
    },
});

export default {
    createOrUpdateBookRoute,
    deleteBookRoute
}
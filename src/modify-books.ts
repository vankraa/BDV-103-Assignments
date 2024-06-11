import { createRouteSpec } from 'koa-zod-router';
import { z } from 'zod';
import s, { Book } from './schema'
import { ObjectId } from 'mongodb'
import { MongooseError } from 'mongoose';


const createOrUpdateBookRoute = createRouteSpec({
    method: 'post',
    path: '/update_book_list',
    handler: async (ctx) => {
        const documentCollection = await s.connectToMongoDB(); // Await the connection
        let book = ctx.request.body;

        if (book.id) {
            const result = await documentCollection.updateOne(
                { _id: ObjectId.createFromBase64(book.id) },
                { $set: book }
            );
            if (result.matchedCount > 0) {
                ctx.status = 200;
            } else {
                const id = new ObjectId(); // for creation, you need to generate the id
                (await documentCollection).insertOne({ _id: id, ...book});
                return;
            }
        } else {
            await documentCollection.insertOne(book);
            ctx.status = 201;
        }
    },
    validate: {
        body: s.bookZodSchema
    },
});


const deleteBookRoute = createRouteSpec({
    method: 'delete',
    path: '/delete_book/:id',
    handler: async (ctx) => {
        console.log(ctx.query);
        const documentCollection = s.connectToMongoDB();
        const bookId = ObjectId.createFromHexString(String(ctx.params.id));

        const result = (await documentCollection).deleteOne({ _id: bookId });

        if ((await result).deletedCount === 0) {
            ctx.throw(404, 'Book not found');
            return;
        }
        else {
            ctx.status = 200;
        }
    },
    validate: {
        params: z.object({ id: z.string() })
    },
});

export default {
    createOrUpdateBookRoute,
    deleteBookRoute
}
import { createRouteSpec } from 'koa-zod-router';
import { z } from 'zod';
import s, { Book } from './schema'
import { ObjectId } from 'mongodb'
import { MongooseError } from 'mongoose';


const createOrUpdateBookRoute = createRouteSpec({
    method: 'post',
    path: '/update_book_list',
    handler: async (ctx) => {
        // console.log(ObjectId.createFromBase64("542c2b97bac0595474108b48"));
        console.log(ctx.request.body);
        const book = s.translateTo_id(ctx.request.body as Book);
        const id = new ObjectId(book._id);
        console.log(`_id: ${id._id}`);
        try {
            const documentCollection = s.connectToMongoDB();

            const updateResult = (await documentCollection).updateOne(
                { _id: id },
                { $set: book },
                { upsert: true }
            ).then((result) => {
                if(result.matchedCount > 0)
                    console.log(`${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`);
                else if (result.upsertedCount > 0)
                    console.log(`${result.upsertedCount} document created with  with id: ${result.upsertedId}`);
                else
                    throw new MongooseError("Could not insert a new document into the database.");
                return result;
            });
        } catch (error) {
            if (error instanceof MongooseError) {
                console.log(error.message);
            }
            else {
                console.error(error);
            }
        }
        
        ctx.response.body = id.toString();
    },
    validate: {
        // body: jsonSchema,
        response: z.string(),
    },
});

const deleteBookRoute = createRouteSpec({
    method: 'delete',
    path: '/delete_book',
    handler: async (ctx) => {
        console.log(ctx.query);
        const documentCollection = s.connectToMongoDB();
        const bookId = new ObjectId(ctx.querystring);

        const result = (await documentCollection).deleteOne({ _id: bookId });

        if ((await result).deletedCount === 0) {
            ctx.throw(404, 'Book not found');
            return;
        }
    },
    validate: {
        params: z.coerce.string()
    },
});

export default {
    createOrUpdateBookRoute,
    deleteBookRoute
}
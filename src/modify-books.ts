import { createRouteSpec } from 'koa-zod-router';
import { z } from 'zod';
import { Book, bookSchema } from './schema'
import bookList from '../mcmasteful-book-list.json';

let books = bookList;

const createOrUpdateBookRoute = createRouteSpec({
    method: 'post',
    path: '/update_book_list',
    handler: (ctx) => {
        const bookIndex = bookList.findIndex(book => book.name === String(ctx.query));
        if (bookIndex >= 0) {
            bookList.splice(bookIndex, 1);
        } else {
            ctx.status = 500;
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
    handler: (ctx) => {
        console.log(ctx.query);
        const bookIndex = bookList.findIndex(book => book.name === String(ctx.query));
        if (bookIndex >= 0) {
            bookList.splice(bookIndex, 1);
        } else {
            ctx.status = 500;
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
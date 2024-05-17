import { createRouteSpec } from 'koa-zod-router';
import { z } from 'zod';
import bookList from '../mcmasteful-book-list.json';

interface Book { 
    name: string,
    author: string,
    description: string,
    price: number,
    image: string
};

// Define the JSON schema for book objects
const bookSchema = z.object({
    name: z.string(),
    author: z.string(),
    description: z.string(),
    price: z.number().or(z.string()).pipe(z.coerce.number()),
    image: z.string().url({ message: "Invalid image url" })
});

function validateBookSchema(book:any, index: number, bookArray:any[]) : boolean {
    return bookSchema.safeParse(book).success;
}

function removeDuplicates(book: Book, index:number, bookArray:Book[]) : boolean {
    return index === bookArray.findIndex((b) => 
        b.name === book.name &&
        b.author === book.author &&
        b.description === book.description &&
        b.price === book.price &&
        b.image === book.image
    );
}

const getBooksRoute = createRouteSpec({
    method: 'get',
    path: '/books',
    handler: (ctx) => {
        try {
            // console.log(bookList);
            // if (!z.array(bookSchema).safeParse(bookList).success){
            //     throw TypeError("Incorrect value types in book database.")
            // };
            console.log('before sort and filter');
            const bookListSortedAndFiltered = bookList.sort().filter(removeDuplicates)
            ctx.body = bookListSortedAndFiltered;
        } catch (error) {
            console.error("Error found: ", error);
            ctx.status = 500;
        }
    },
    validate: {
        response: z.array(bookSchema),
    },
});


export default {
    getBooksRoute
};
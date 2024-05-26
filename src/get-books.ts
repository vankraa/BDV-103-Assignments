import { createRouteSpec } from 'koa-zod-router';
import { z } from 'zod';
import { Book, bookSchema } from './schema'
import bookList from '../mcmasteful-book-list.json';

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
            // console.log('before sort and filter');
            let bookListSortedAndFiltered = bookList.sort().filter(removeDuplicates);
            
            
            // console.log('before query string handling');
            // console.log(ctx.invalid);
            // console.log(ctx.querystring);
            // console.log(ctx.query);

            const query = ctx.query;

            if (Object.keys(query).length !== 0){
                if (Object.keys(query).includes('to') && Object.keys(query).includes('from')){
                    // 10-20 and >20 filters selected
                    if (Array.isArray(query.from) && !Array.isArray(query.to)) {
                        let fromArr : string[] = Array.isArray(query.from) ? query.from : [query.from] as string[];
                        let fromNum : number = Math.min(...fromArr.map(Number));
                        
                        bookListSortedAndFiltered = bookListSortedAndFiltered.filter((book: Book, index:number, bookArray:Book[]) => {
                            return book.price >= fromNum;
                        });
                    }
                    // <10 and 10-20 filters selected
                    else if (!Array.isArray(query.from) && Array.isArray(query.to)) {
                        let toArr : string[] = Array.isArray(query.to) ? query.to : [query.to] as string[];
                        let toNum : number = Math.max(...toArr.map(Number));

                        bookListSortedAndFiltered = bookListSortedAndFiltered.filter((book: Book, index:number, bookArray:Book[]) => {
                            return book.price <= toNum;
                        });
                    }
                    // <10 and >20 filters selected or 10-20 filter selected
                    else if (!Array.isArray(query.from) && !Array.isArray(query.to)) {
                        // 10-20 filter selected
                        if (Number(query.from) < Number(query.to))
                            bookListSortedAndFiltered = bookListSortedAndFiltered.filter((book: Book, index:number, bookArray:Book[]) => {
                                return book.price <= Number(query.to) && book.price >= Number(query.from);
                            });
                        // <10 and >20 filters selected
                        else
                            bookListSortedAndFiltered = bookListSortedAndFiltered.filter((book: Book, index:number, bookArray:Book[]) => {
                                return book.price <= Number(query.to) || book.price >= Number(query.from);
                            });
                    }
                    // else, all filters selected so return all books.
                }
                else if (Object.keys(query).includes('to')){
                    let toArr : string[] = Array.isArray(query.to) ? query.to : [query.to] as string[];
                    let toNum : number = Math.max(...toArr.map(Number));
                    
                    bookListSortedAndFiltered = bookListSortedAndFiltered.filter((book: Book, index:number, bookArray:Book[]) => {
                        return book.price <= toNum;
                    });
                }
                else if (Object.keys(query).includes('from')){
                    let fromArr : string[] = Array.isArray(query.from) ? query.from : [query.from] as string[];
                    let fromNum : number = Math.min(...fromArr.map(Number));
                    
                    bookListSortedAndFiltered = bookListSortedAndFiltered.filter((book: Book, index:number, bookArray:Book[]) => {
                        return book.price >= fromNum;
                    });
                }
                else {
                    ctx.throw(400, 'Bad Request: Filters could not be parsed.');
                }
            }

            ctx.body = bookListSortedAndFiltered;
        } catch (error) {
            console.error("Error found: ", error);
            ctx.status = 500;
        }
    },
    validate: {
        params: z.object({ 
            from: z.union([z.array(z.coerce.number()), z.coerce.number()]).optional(),
            to: z.union([z.array(z.coerce.number()), z.coerce.number()]).optional()
        }).optional(),
        response: z.array(bookSchema),
    },
});

export default {
    getBooksRoute
};
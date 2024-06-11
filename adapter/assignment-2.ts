import { captureRejectionSymbol } from "koa";
import assignment1 from "./assignment-1";

export type BookID = string;

export interface Book {
    id?: BookID,
    name: string,
    author: string,
    description: string,
    price: number,
    image: string,
};

async function listBooks(filters?: Array<{from?: number, to?: number}>) : Promise<Book[]>{
    return assignment1.listBooks(filters);
}

async function createOrUpdateBook(book: Book): Promise<BookID> {
    const response = await fetch(`${assignment1.url}/update_book_list`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(book)
    });

    if (!response.ok) {
        return Promise.reject(`Failed to create or update book. HTTP status: ${response.status}`);
    }
    else {
        const bookId = String(response.body);
        return Promise.resolve<BookID>(bookId);
    }
}

async function removeBook(book: BookID): Promise<void> {
    const response = await fetch(`${assignment1.url}/delete_book/${book}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        return Promise.reject(`Failed to delete book. HTTP status: ${response.status}`);
    }
    else {
        return Promise.resolve();
    }
}

const assignment = "assignment-2";

export default {
    assignment,
    createOrUpdateBook,
    removeBook,
    listBooks
};
export interface Book {
    name: string,
    author: string,
    description: string,
    price: number,
    image: string,
};

async function listBooks(filters?: Array<{from?: number, to?: number}>) : Promise<Book[]>{
    throw new Error("Todo")
}

const assignment = "assignment-1";

export default {
    assignment,
    listBooks
};
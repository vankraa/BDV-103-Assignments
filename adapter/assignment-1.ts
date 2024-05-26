export interface Book {
    name: string,
    author: string,
    description: string,
    price: number,
    image: string,
};
const url = "http://localhost:3000"

// If you have multiple filters, a book matching any of them is a match.
async function listBooks(filters?: Array<{from?: number, to?: number}>) : Promise<Book[]>{
    let queryString = '';
    if (filters != null)
        filters.forEach((filter, index) => {
            const keys = Object.keys(filter);
            keys.forEach((key, keyIndex) => {
                queryString += `${index !== 0 || keyIndex !== 0 ? '&' : ''}${key}=${filter[key as keyof typeof filter]}`;
            });
        });
    try {
        const response = await fetch(`${url}/books${queryString ? `?${queryString}` : ''}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch books');
        }
        const booksData = await response.json() as Book[];

        return booksData;
    } catch (error) {
        console.error('Error fetching books:', error);
        return [];
    }
}

const assignment = "assignment-1";

export default {
    assignment,
    listBooks,
    url
};
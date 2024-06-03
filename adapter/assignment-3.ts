import previous_assignment from './assignment-2'

export type BookID = string

export interface Book {
  id?: BookID
  name: string
  author: string
  description: string
  price: number
  image: string
};

export interface Filter {
  from?: number
  to?: number
  name?: string
  author?: string
};

// Function to convert filters to query string parameters
function filtersToQueryString(filters?: Filter[]): string {
  if (!filters || filters.length === 0) return '';

  return filters.map((filter) => {
    const params = new URLSearchParams();
    if (filter.from !== undefined) params.append('from', filter.from.toString());
    if (filter.to !== undefined) params.append('to', filter.to.toString());
    if (filter.name) params.append('name', filter.name);
    if (filter.author) params.append('author', filter.author);
    return params.toString();
  }).join('&');
}

// If multiple filters are provided, any book that matches at least one of them should be returned
// Within a single filter, a book would need to match all the given conditions
async function listBooks(filters?: Filter[]): Promise<Book[]> {
  const queryString = filtersToQueryString(filters);
  const response = await fetch(`/books?${queryString}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch books');
  }

  const books: Book[] = await response.json() as Book[];
  return books;
}

async function createOrUpdateBook (book: Book): Promise<BookID> {
  return await previous_assignment.createOrUpdateBook(book)
}

async function removeBook (book: BookID): Promise<void> {
  await previous_assignment.removeBook(book)
}

const assignment = 'assignment-3'

export default {
  assignment,
  createOrUpdateBook,
  removeBook,
  listBooks
}

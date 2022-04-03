export interface User {
    id: number;
    username: string | null;
    name: string | null;
    tags: string[];
    location: string | null;
    rating: number | null
}
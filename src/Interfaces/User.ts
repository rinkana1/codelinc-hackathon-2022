export interface User {
    id: number,
    username?: string | null,
    tags?: string[] | null,
    location?: string | null,
    rating?: number | null,
}
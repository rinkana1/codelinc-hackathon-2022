export interface Company {
    id: number,
    compname?: string | null,
    tags?: string[] | null,
    location?: string | null,
    description?: string | null,
    rating?: number | null
}
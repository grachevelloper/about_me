export class PaginatedResponseDto<T> {
    readonly items: T[];
    readonly page: number;
    readonly limit: number;
    readonly total: number;
    readonly hasNext: boolean;

    constructor(items: T[], page: number, limit: number, total: number) {
        this.items = items;
        this.page = page;
        this.limit = limit;
        this.total = total;
        this.hasNext = page * limit < total;
    }
}

import {describe, expect, it} from "@jest/globals";
import {PaginatedResponseDto} from "src/shared/dto/paginated-response.dto";

describe("PaginatedResponseDto", () => {
    it("creates the common list response shape and reports a next page", () => {
        const response = new PaginatedResponseDto(["first", "second"], 2, 2, 5);

        expect(response).toEqual({
            items: ["first", "second"],
            page: 2,
            limit: 2,
            total: 5,
            hasNext: true,
        });
    });

    it("reports the final page", () => {
        const response = new PaginatedResponseDto(["last"], 3, 2, 5);

        expect(response.hasNext).toBe(false);
    });
});

import {describe, expect, it, jest} from "@jest/globals";
import {TagsController} from "src/modules/articles/tags/tags.contoroller";
import {Tag} from "src/modules/articles/tags/tags.entity";
import {TagsService} from "src/modules/articles/tags/tags.service";

describe("TagsController", () => {
    it("maps created tags to response DTOs without entity-only fields", async () => {
        const tag = Object.assign(new Tag(), {
            id: "dc86f84f-f3e6-4d9c-96ca-83f2a8c48fd7",
            name: "nestjs",
            createdAt: "2026-01-01T00:00:00.000Z",
            updatedAt: "2026-01-02T00:00:00.000Z",
            articles: [],
        });
        const service = {
            create: jest.fn<TagsService["create"]>().mockResolvedValue(tag),
        } as unknown as TagsService;
        const controller = new TagsController(service);

        const result = await controller.create({name: " NestJS "});

        expect(result).toEqual({
            id: tag.id,
            name: "nestjs",
        });
        expect(result).not.toHaveProperty("articles");
        expect(result).not.toHaveProperty("createdAt");
        expect(result).not.toHaveProperty("updatedAt");
    });

    it("maps listed tags to response DTOs", async () => {
        const tag = Object.assign(new Tag(), {
            id: "dc86f84f-f3e6-4d9c-96ca-83f2a8c48fd7",
            name: "nestjs",
            articles: [],
        });
        const service = {
            findAll: jest.fn<TagsService["findAll"]>().mockResolvedValue([tag]),
        } as unknown as TagsService;
        const controller = new TagsController(service);

        await expect(controller.findAll()).resolves.toEqual([
            {
                id: tag.id,
                name: "nestjs",
            },
        ]);
    });
});

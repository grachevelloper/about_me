import {beforeEach, describe, expect, it, jest} from "@jest/globals";
import {ConflictException} from "@nestjs/common";
import {Test, TestingModule} from "@nestjs/testing";
import {getRepositoryToken} from "@nestjs/typeorm";
import {Tag} from "src/modules/articles/tags/tags.entity";
import {TagsService} from "src/modules/articles/tags/tags.service";
import {Repository} from "typeorm";

describe("TagsService", () => {
    let service: TagsService;
    let repository: jest.Mocked<Repository<Tag>>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                TagsService,
                {
                    provide: getRepositoryToken(Tag),
                    useValue: {
                        create: jest.fn(),
                        find: jest.fn(),
                        findOne: jest.fn(),
                        remove: jest.fn(),
                        save: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get(TagsService);
        repository = module.get(getRepositoryToken(Tag));
    });

    it("normalizes tag names before creating a tag", async () => {
        const tag = Object.assign(new Tag(), {
            id: "dc86f84f-f3e6-4d9c-96ca-83f2a8c48fd7",
            name: "nestjs",
        });
        repository.findOne.mockResolvedValue(null);
        repository.create.mockReturnValue(tag);
        repository.save.mockResolvedValue(tag);

        await service.create({name: " NestJS "});

        expect(repository.findOne).toHaveBeenCalledWith({
            where: {name: "nestjs"},
        });
        expect(repository.create).toHaveBeenCalledWith({name: "nestjs"});
    });

    it("rejects duplicate tag names", async () => {
        repository.findOne.mockResolvedValue(
            Object.assign(new Tag(), {
                id: "dc86f84f-f3e6-4d9c-96ca-83f2a8c48fd7",
                name: "nestjs",
            }),
        );

        await expect(service.create({name: " NestJS "})).rejects.toBeInstanceOf(
            ConflictException,
        );
        expect(repository.save).not.toHaveBeenCalled();
    });

    it("finds existing tags and creates only missing names", async () => {
        const existing = Object.assign(new Tag(), {
            id: "dc86f84f-f3e6-4d9c-96ca-83f2a8c48fd7",
            name: "nestjs",
        });
        const created = Object.assign(new Tag(), {
            id: "5c72f3d6-4e62-43bf-9765-4da630a57736",
            name: "typeorm",
        });
        repository.find.mockResolvedValue([existing]);
        repository.create.mockReturnValue(created);
        repository.save.mockResolvedValue([created] as never);

        const result = await service.findOrCreateByNames([
            " NestJS ",
            "typeorm",
            "nestjs",
        ]);

        expect(repository.create).toHaveBeenCalledTimes(1);
        expect(repository.create).toHaveBeenCalledWith({name: "typeorm"});
        expect(result).toEqual([existing, created]);
    });
});

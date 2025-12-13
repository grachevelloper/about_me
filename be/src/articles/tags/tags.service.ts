import {Injectable, NotFoundException} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

import {Tag} from "./tags.entity";

@Injectable()
export class TagsService {
    constructor(
        @InjectRepository(Tag)
        private readonly tagRepository: Repository<Tag>,
    ) {}

    async create(name: string): Promise<Tag> {
        const tag = this.tagRepository.create({name});
        return await this.tagRepository.save(tag);
    }

    async findAll(): Promise<Tag[]> {
        return await this.tagRepository.find({
            order: {createdAt: "DESC"},
        });
    }

    async findOne(id: string): Promise<Tag> {
        const tag = await this.tagRepository.findOne({where: {id}});

        if (!tag) {
            throw new NotFoundException(`Тег с ID ${id} не найден`);
        }

        return tag;
    }

    async update(id: string, newName: string): Promise<Tag> {
        const tag = await this.findOne(id);

        Object.assign(tag, {name: newName});
        return await this.tagRepository.save(tag);
    }

    async delete(id: string): Promise<void> {
        const tag = await this.findOne(id);
        await this.tagRepository.remove(tag);
    }

    async findByName(name: string): Promise<Tag | null> {
        return await this.tagRepository.findOne({where: {name}});
    }
}

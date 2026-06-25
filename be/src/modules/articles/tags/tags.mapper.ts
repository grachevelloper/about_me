import {TagResponseDto} from "./tags.dto";
import {Tag} from "./tags.entity";

export class TagsMapper {
    static toResponse(tag: Tag): TagResponseDto {
        return {
            id: tag.id,
            name: tag.name,
        };
    }
}

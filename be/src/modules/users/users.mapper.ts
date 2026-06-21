import {UserResponseDto} from "./dto/user-response.dto";
import {User} from "./users.entity";

export class UsersMapper {
    static toResponse(user: User): UserResponseDto {
        return {
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role,
            avatar: user.avatar ?? null,
            nowReading: user.nowReading ?? null,
            nowWatch: user.nowWatch ?? null,
            nowBeingIn: user.nowBeingIn ?? null,
            nowListening: user.nowListening ?? null,
            status: user.status ?? null,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        };
    }
}

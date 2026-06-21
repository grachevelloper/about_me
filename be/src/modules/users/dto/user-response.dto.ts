import {Role} from "../../../types";
import {UserStatus} from "../../../types/user";

export class UserResponseDto {
    id!: string;
    username!: string;
    email!: string;
    role!: Role;
    avatar!: string | null;
    nowReading!: string | null;
    nowWatch!: string | null;
    nowBeingIn!: string | null;
    nowListening!: string | null;
    status!: UserStatus | null;
    createdAt!: string;
    updatedAt!: string;
}

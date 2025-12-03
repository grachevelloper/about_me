import {ApiProperty, ApiPropertyOptional} from "@nestjs/swagger";
import {
    IsEmail,
    IsEnum,
    IsOptional,
    IsString,
    Length,
    Matches,
    MaxLength,
    MinLength,
} from "class-validator";

import {UserStatus} from "@/types/user";

import {Role} from "../../types";

export class CreateUserDto {
    @ApiProperty({
        example: "user@example.com",
        description: "Email пользователя",
    })
    @IsEmail()
    @MaxLength(255)
    email: string;

    @ApiProperty({
        example: "StrongPassword123!",
        description: "Пароль пользователя",
    })
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
        message: "Пароль должен содержать заглавные, строчные буквы и цифры",
    })
    password: string;

    @ApiProperty({example: "kolya-master", description: "Имя пользователя"})
    @IsString()
    @Length(1, 50)
    username: string;
}

export class UpdateUserDto {
    @ApiPropertyOptional({
        example: "user@example.com",
        description: "Email пользователя",
    })
    @IsEmail()
    @MaxLength(255)
    @IsOptional()
    email?: string;

    @ApiPropertyOptional({
        example: "StrongPassword123!",
        description: "Пароль пользователя",
    })
    @IsString()
    @MinLength(8)
    @MaxLength(32)
    @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
        message: "Пароль должен содержать заглавные, строчные буквы и цифры",
    })
    @IsOptional()
    password?: string;

    @ApiPropertyOptional({
        example: "kolya-master",
        description: "Имя пользователя",
    })
    @IsString()
    @Length(1, 50)
    @IsOptional()
    username?: string;

    @ApiPropertyOptional({
        enum: Role,
        enumName: "Role",
        example: Role.ADMIN,
        description: "Роль пользователя",
    })
    @IsEnum(Role)
    @IsOptional()
    role?: Role;

    @ApiPropertyOptional({
        example: "https://example.com/avatar.jpg",
        description: "URL аватара пользователя",
    })
    @IsString()
    @IsOptional()
    avatar?: string;

    @ApiPropertyOptional({
        enum: UserStatus,
        enumName: "UserStatus",
        // example: UserStatus.INACTIVE,
        description: "Статус пользователя",
    })
    @IsEnum(UserStatus)
    @IsOptional()
    status?: UserStatus;
}

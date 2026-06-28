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

import {Role} from "../../types";

export class SigninUserDto {
    @IsEmail()
    @MaxLength(255)
    email!: string;

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
    password!: string;
}
export class SignupUserDto extends SigninUserDto {
    @IsString()
    @Length(1, 50)
    username!: string;
}

export class CreateUserDto extends SignupUserDto {
    @IsEnum(Role)
    role!: Role;
}

export class UpdateUserDto {
    @ApiPropertyOptional({
        example: "kolya-master",
        description: "Имя пользователя",
    })
    @IsString()
    @Length(1, 50)
    @IsOptional()
    username?: string;

    @IsEnum(Role)
    @IsOptional()
    role?: Role;

    @IsString()
    @IsOptional()
    avatar?: string;

    @IsString()
    @IsOptional()
    nowReading?: string;

    @IsString()
    @IsOptional()
    nowWatch?: string;

    @IsString()
    @IsOptional()
    nowListening?: string;

    @IsString()
    @IsOptional()
    nowBeingIn?: string;
}

export class ChangePasswordDto {
    @ApiProperty({example: "StrongPassword123!"})
    @IsString()
    @MinLength(8)
    @MaxLength(72)
    currentPassword!: string;

    @ApiProperty({example: "NewStrongPassword123!"})
    @IsString()
    @MinLength(8)
    @MaxLength(72)
    @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])/, {
        message: "Пароль должен содержать заглавные, строчные буквы и цифры",
    })
    newPassword!: string;
}

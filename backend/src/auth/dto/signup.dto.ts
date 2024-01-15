import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsString, IsStrongPassword } from "class-validator";
import { hashString } from "utils";

export class CreateAuthDto {
    @IsEmail()
    @Transform(({ value }: { value: string }) => value.toLowerCase())
    @ApiProperty()
    email: string;
    @IsString()
    @IsStrongPassword()
    @ApiProperty()
    password: string;
}

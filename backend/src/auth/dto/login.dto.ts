import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsEmail()
    @Transform(({ value }: { value: string }) => value.toLowerCase())
    @ApiProperty()
    email: string;
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty()
    password: string;
}
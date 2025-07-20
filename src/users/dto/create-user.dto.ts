import { IsEmail, IsMobilePhone, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";


export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    @MinLength(3)
    first_name:string;

    @IsString()
    @IsOptional()
    last_name:string;

    @IsEmail()
    @IsNotEmpty()
    email:string;

    @IsMobilePhone('en-IN')
    @IsNotEmpty()
    mobile:number;

    @IsString()
    @IsNotEmpty()
    @MinLength(4)
    password:string;
}
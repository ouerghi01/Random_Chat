import { IsInt, IsNumber, IsString, MinLength } from "class-validator";



export class MessageDto {
    @IsString()
    @MinLength(20,{message : 'name is too short'})
    content: string;
    @IsInt()
    @MinLength(1)
    senderId: number;
    @IsInt()
    @MinLength(1)
    receiverId: number;
}
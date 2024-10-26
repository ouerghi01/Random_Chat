import { Entity, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
@Entity()
export class Message{
    @PrimaryGeneratedColumn()
    id: number;
    content: string;
    senderId: number;
    receiverId: number;

}
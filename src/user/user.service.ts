import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { Token } from './entities/token.entity';
import { MessageDto } from './dto/message.dto';
import { Message } from './entities/message.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Token) private tokenRepository :Repository<Token>
    ,
    @InjectRepository(Message) private messageRepository :Repository<Message>
  ) {}
  create(createUserDto: CreateUserDto):Promise<User> {
    const user = new User();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.age = createUserDto.age;
    user.password = createUserDto.password;
    user.gender = createUserDto.gender;
    return this.userRepository.save(user);

  }
  public async storeTokenInRepository(access_token: string, user: User) {
    const token = new Token();
    token.token = access_token;
    token.user = user;
    token.created_at = new Date();
    token.expired_at = new Date(new Date().getTime() + 8 * 24 * 60 * 60 * 1000);
    await this.tokenRepository.save(token);
}
  public findByToken(token: string): Promise<Token> {
    return this.tokenRepository.findOneBy({token})
  }

  findAll() :Promise<User[]>{
    return this.userRepository.find();
  }
  findUserByEmail(email: string):Promise<User> {
    return this.userRepository.findOneBy({email});
  }

  findOne(id: number):Promise<User> {
    return this.userRepository.findOneBy({id});
  }

  updateUser(id: number, updateUserDto: UpdateUserDto): Promise<User> {
    const user: User = new User();
    user.name = updateUserDto.name;
    user.age = updateUserDto.age;
    user.email = updateUserDto.email;
    user.password = updateUserDto.password;
    user.id = id;
    
    return this.userRepository.save(user);
  }
  async createMessage(message_dto :MessageDto): Promise<Message> {
    const message = new Message();
    message.content = message_dto.content;
    message.senderId = message_dto.senderId;
    message.receiverId = message_dto.receiverId;
    await this.messageRepository.save(message);
    return message;
  }
  async getAllMessages(): Promise<Message[]> {
    return this.messageRepository.find();
  }


  removeUser(id: number): Promise<{ affected?: number }> {
    return this.userRepository.delete(id);
  }
}

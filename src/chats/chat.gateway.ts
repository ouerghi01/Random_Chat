import { ConnectedSocket, MessageBody, OnGatewayConnection, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from 'socket.io';
import { ChatsService } from "./chats.service";
import { UserService } from "src/user/user.service";
import { Message } from "src/user/entities/message.entity";
import { forwardRef, Inject } from "@nestjs/common";
@WebSocketGateway()
export class ChatGateway implements OnGatewayConnection ,OnGatewayDisconnect {
  constructor(private chatsService: ChatsService,
    
    @Inject(forwardRef(() => UserService))
    private userService :UserService) {}
  @WebSocketServer()
  server: Server;
  async handleConnection(socket: Socket) {
    await this.chatsService.getUserFromSocket(socket)
  }
  handleDisconnect(client: any) {
    console.log('Client disconnected:', client.id);
  }
  @SubscribeMessage('send_message')
  async listenForMessages(@MessageBody() message: string,@ConnectedSocket() socket: Socket) {
    const user = await this.chatsService.getUserFromSocket(socket)
    this.server.emit('receive_message', {message,user});
  }
  @SubscribeMessage('get_messages')
  async getMessages(@ConnectedSocket() socket: Socket) {
    await this.chatsService.getUserFromSocket(socket)
    const messages :Message[]= await this.userService.getAllMessages();
    this.server.emit('messages', messages);
    return messages
  }

}

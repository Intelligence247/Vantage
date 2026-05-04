import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Server, Socket } from 'socket.io';
import { Public } from '../../common/decorators/public.decorator';
import { JwtPayload } from '../../common/decorators/current-user.decorator';
import { InquiryDocument } from './schema/inquiry.schema';

function participantUserIds(inquiry: InquiryDocument): string[] {
  const agentRef = inquiry.agent as { _id?: { toString: () => string } } | null | undefined;
  const agentId =
    typeof agentRef === 'object' &&
    agentRef !== null &&
    '_id' in agentRef
      ? agentRef._id!.toString()
      : agentRef?.toString();
  const senderRef = inquiry.sender as { _id?: { toString: () => string } } | null | undefined;
  const senderId =
    typeof senderRef === 'object' &&
    senderRef !== null &&
    '_id' in senderRef
      ? senderRef._id!.toString()
      : senderRef?.toString();
  return [agentId, senderId].filter((id): id is string => Boolean(id));
}

@Public()
@WebSocketGateway({
  namespace: '/inquiries',
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  },
})
export class InquiriesGateway implements OnGatewayConnection {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(InquiriesGateway.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async handleConnection(client: Socket) {
    const token = this.extractToken(client);
    if (!token) {
      client.disconnect(true);
      return;
    }
    try {
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<string>('jwt.accessSecret'),
      });
      client.data.user = payload;
      await client.join(`user:${payload.sub}`);
    } catch {
      this.logger.warn('WebSocket JWT verification failed');
      client.disconnect(true);
    }
  }

  notifyInquiryParticipants(inquiry: InquiryDocument): void {
    if (!this.server) return;
    const plain = JSON.parse(JSON.stringify(inquiry)) as Record<string, unknown>;
    const targets = new Set(participantUserIds(inquiry));
    for (const uid of targets) {
      this.server.to(`user:${uid}`).emit('inquiry:updated', { inquiry: plain });
    }
  }

  private extractToken(client: Socket): string | undefined {
    const auth = client.handshake.auth as { token?: string };
    if (auth?.token) return auth.token;
    const header = client.handshake.headers.authorization;
    if (typeof header === 'string' && header.startsWith('Bearer ')) {
      return header.slice(7);
    }
    return undefined;
  }
}

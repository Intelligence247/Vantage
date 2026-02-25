import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const request = require('supertest');
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { Server } from 'http';
import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { AuthModule } from '../src/modules/auth/auth.module';
import { UsersModule } from '../src/modules/users/users.module';
import { PropertiesModule } from '../src/modules/properties/properties.module';
import { InquiriesModule } from '../src/modules/inquiries/inquiries.module';
import { AdminModule } from '../src/modules/admin/admin.module';
import { CloudinaryModule } from '../src/modules/cloudinary/cloudinary.module';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { TransformInterceptor } from '../src/common/interceptors';
import { configuration } from '../src/config';

const TEST_MONGO_URI =
  process.env.TEST_MONGO_URI || 'mongodb://localhost:27017/sovereign-estate-test';

describe('Application (e2e)', () => {
  let app: INestApplication;
  let server: Server;
  let userAccessToken: string;
  let agentAccessToken: string;
  let adminAccessToken: string;
  let agentId: string;
  let propertyId: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => ({
              ...configuration(),
              database: { uri: TEST_MONGO_URI },
              jwt: {
                accessSecret: 'test-access-secret-key-12345',
                refreshSecret: 'test-refresh-secret-key-12345',
                accessExpiresIn: '15m',
                refreshExpiresIn: '7d',
              },
              cloudinary: {
                cloudName: 'test',
                apiKey: 'test',
                apiSecret: 'test',
              },
              cors: { origin: '*' },
              port: 3333,
              nodeEnv: 'test',
            }),
          ],
        }),
        MongooseModule.forRoot(TEST_MONGO_URI),
        WinstonModule.forRoot({
          transports: [new winston.transports.Console({ silent: true })],
        }),
        ThrottlerModule.forRoot([{ ttl: 60000, limit: 1000 }]),
        JwtModule.register({ global: true }),
        AuthModule,
        UsersModule,
        PropertiesModule,
        InquiriesModule,
        AdminModule,
        CloudinaryModule,
      ],
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api', { exclude: ['health'] });
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    app.useGlobalInterceptors(new TransformInterceptor());

    await app.init();
    server = app.getHttpServer() as Server;
  }, 30000);

  afterAll(async () => {
    await app.close();
  }, 10000);

  describe('Health & Root', () => {
    it('GET /health should return ok', () => {
      return request(server)
        .get('/health')
        .expect(200)
        .expect((res: any) => {
          expect(res.body.data.status).toBe('ok');
        });
    });

    it('GET /api should return API info', () => {
      return request(server)
        .get('/api')
        .expect(200)
        .expect((res: any) => {
          expect(res.body.data.message).toBe('Sovereign Estate API');
        });
    });
  });

  describe('Auth - Registration', () => {
    it('POST /api/auth/register - should register a user', () => {
      return request(server)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'testuser@example.com',
          password: 'Password123',
          phone: '+234 800 000 0001',
        })
        .expect(201)
        .expect((res: any) => {
          expect(res.body.data.user.email).toBe('testuser@example.com');
          expect(res.body.data.tokens.accessToken).toBeDefined();
          userAccessToken = res.body.data.tokens.accessToken;
        });
    });

    it('POST /api/auth/register - should register an agent', () => {
      return request(server)
        .post('/api/auth/register')
        .send({
          name: 'Test Agent',
          email: 'testagent@example.com',
          password: 'Password123',
          role: 'agent',
        })
        .expect(201)
        .expect((res: any) => {
          expect(res.body.data.user.role).toBe('agent');
          expect(res.body.data.user.isVerified).toBe(false);
          agentAccessToken = res.body.data.tokens.accessToken;
          agentId = res.body.data.user.id;
        });
    });

    it('POST /api/auth/register - should register an admin', () => {
      return request(server)
        .post('/api/auth/register')
        .send({
          name: 'Test Admin',
          email: 'testadmin@example.com',
          password: 'Password123',
          role: 'admin',
        })
        .expect(201)
        .expect((res: any) => {
          adminAccessToken = res.body.data.tokens.accessToken;
        });
    });

    it('POST /api/auth/register - should reject duplicate email', () => {
      return request(server)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'testuser@example.com',
          password: 'Password123',
        })
        .expect(400);
    });

    it('POST /api/auth/register - should reject weak password', () => {
      return request(server)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'weak@example.com',
          password: 'weak',
        })
        .expect(400);
    });
  });

  describe('Auth - Login', () => {
    it('POST /api/auth/login - should login with valid credentials', () => {
      return request(server)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'Password123',
        })
        .expect(200)
        .expect((res: any) => {
          expect(res.body.data.tokens.accessToken).toBeDefined();
          expect(res.body.data.tokens.refreshToken).toBeDefined();
          userAccessToken = res.body.data.tokens.accessToken;
        });
    });

    it('POST /api/auth/login - should reject invalid credentials', () => {
      return request(server)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'WrongPassword1',
        })
        .expect(401);
    });
  });

  describe('Auth - Token Refresh', () => {
    let refreshToken: string;

    it('should get refresh token from login', () => {
      return request(server)
        .post('/api/auth/login')
        .send({
          email: 'testuser@example.com',
          password: 'Password123',
        })
        .expect(200)
        .expect((res: any) => {
          refreshToken = res.body.data.tokens.refreshToken;
          userAccessToken = res.body.data.tokens.accessToken;
          expect(refreshToken).toBeDefined();
        });
    });

    it('POST /api/auth/refresh - should refresh tokens', () => {
      return request(server)
        .post('/api/auth/refresh')
        .send({ refreshToken })
        .expect(200)
        .expect((res: any) => {
          expect(res.body.data.accessToken).toBeDefined();
          expect(res.body.data.refreshToken).toBeDefined();
        });
    });
  });

  describe('Properties - Unauthorized Access', () => {
    it('POST /api/properties - should block unauthenticated', () => {
      return request(server)
        .post('/api/properties')
        .send({
          title: 'Test Property',
          description: 'A test property description text',
          price: 1000000,
          type: 'sale',
        })
        .expect(401);
    });

    it('POST /api/properties - should block regular user', () => {
      return request(server)
        .post('/api/properties')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .send({
          title: 'Test Property',
          description: 'A test property description text',
          price: 1000000,
          type: 'sale',
        })
        .expect(403);
    });
  });

  describe('Properties - Agent Operations', () => {
    it('POST /api/properties - agent should create property', () => {
      return request(server)
        .post('/api/properties')
        .set('Authorization', `Bearer ${agentAccessToken}`)
        .send({
          title: 'Luxury Duplex in Victoria Island',
          description:
            'Beautiful 5 bedroom duplex with modern finishes and sea view',
          price: 150000000,
          type: 'sale',
          category: 'residential',
          propertyKind: 'duplex',
          address: '25 Banana Island Road',
          city: 'Lagos',
          state: 'Lagos',
          beds: 5,
          baths: 6,
          sqft: 5000,
          parking: 3,
          features: ['Swimming Pool', 'Smart Home', 'Generator'],
        })
        .expect(201)
        .expect((res: any) => {
          expect(res.body.data.title).toBe(
            'Luxury Duplex in Victoria Island',
          );
          propertyId = res.body.data.id;
        });
    });
  });

  describe('Admin - Agent Verification', () => {
    it('PUT /api/dashboard/admin/users/:id/verify - should verify agent', () => {
      return request(server)
        .put(`/api/dashboard/admin/users/${agentId}/verify`)
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200)
        .expect((res: any) => {
          expect(res.body.data.isVerified).toBe(true);
        });
    });
  });

  describe('Properties - Public Access', () => {
    it('GET /api/properties - should list properties publicly', () => {
      return request(server)
        .get('/api/properties')
        .expect(200)
        .expect((res: any) => {
          expect(res.body.data.properties).toBeDefined();
          expect(Array.isArray(res.body.data.properties)).toBe(true);
        });
    });

    it('GET /api/properties/:id - should get property details', () => {
      return request(server)
        .get(`/api/properties/${propertyId}`)
        .expect(200)
        .expect((res: any) => {
          expect(res.body.data.title).toBe(
            'Luxury Duplex in Victoria Island',
          );
        });
    });

    it('GET /api/properties/featured - should get featured properties', () => {
      return request(server).get('/api/properties/featured').expect(200);
    });
  });

  describe('Properties - Favorites', () => {
    it('POST /api/properties/:id/favorite - should toggle favorite', () => {
      return request(server)
        .post(`/api/properties/${propertyId}/favorite`)
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(201)
        .expect((res: any) => {
          expect(res.body.data.isFavorited).toBe(true);
        });
    });
  });

  describe('Admin Dashboard', () => {
    it('GET /api/dashboard/admin/stats - should return stats', () => {
      return request(server)
        .get('/api/dashboard/admin/stats')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200)
        .expect((res: any) => {
          expect(res.body.data.users).toBeDefined();
          expect(res.body.data.properties).toBeDefined();
        });
    });

    it('GET /api/dashboard/admin/users - should list users', () => {
      return request(server)
        .get('/api/dashboard/admin/users')
        .set('Authorization', `Bearer ${adminAccessToken}`)
        .expect(200)
        .expect((res: any) => {
          expect(res.body.data.users).toBeDefined();
          expect(res.body.data.total).toBeGreaterThan(0);
        });
    });

    it('GET /api/dashboard/admin/stats - should block non-admin', () => {
      return request(server)
        .get('/api/dashboard/admin/stats')
        .set('Authorization', `Bearer ${userAccessToken}`)
        .expect(403);
    });
  });

  describe('Contact', () => {
    it('POST /api/contact - should accept contact form', () => {
      return request(server)
        .post('/api/contact')
        .send({
          name: 'John Doe',
          email: 'john@example.com',
          phone: '+234 800 000 0000',
          subject: 'general',
          message: 'I have a question about your platform.',
        })
        .expect(201)
        .expect((res: any) => {
          expect(res.body.data.message).toContain('received');
        });
    });
  });
});

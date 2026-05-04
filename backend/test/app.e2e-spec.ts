import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { Server } from 'http';
import { json, urlencoded } from 'express';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const request = require('supertest');

import { AppController } from '../src/app.controller';
import { AppService } from '../src/app.service';
import { TransformInterceptor } from '../src/common/interceptors';
import { GlobalExceptionFilter } from '../src/common/filters';
import { JwtAuthGuard } from '../src/common/guards/jwt-auth.guard';
import { MailService } from '../src/modules/mail/mail.service';
import { AuthModule } from '../src/modules/auth/auth.module';
import { UsersModule } from '../src/modules/users/users.module';
import { PropertiesModule } from '../src/modules/properties/properties.module';
import { InquiriesModule } from '../src/modules/inquiries/inquiries.module';
import { AdminModule } from '../src/modules/admin/admin.module';
import { CloudinaryModule } from '../src/modules/cloudinary/cloudinary.module';
import { PaymentsModule } from '../src/modules/payments/payments.module';
import { UsersService } from '../src/modules/users/users.service';
import { TransactionStatus } from '../src/modules/payments/schema/transaction.schema';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';

describe('Backend Full Flow (e2e)', () => {
  let app: INestApplication;
  let server: Server;
  let mongoServer: MongoMemoryServer;
  let usersService: UsersService;

  let buyerAccessToken: string;
  let vendorAccessToken: string;
  let adminAccessToken: string;
  let vendorId: string;
  let propertyId: string;
  let inquiryId: string;
  let transactionReference: string;
  let verificationOtp: string;
  let paystackVerificationStatus: 'success' | 'failed' = 'success';

  const mailMock = {
    sendEmailVerification: jest.fn().mockResolvedValue(undefined),
    sendAdminVendorAlert: jest.fn().mockResolvedValue(undefined),
    sendVendorApproval: jest.fn().mockResolvedValue(undefined),
    sendAdminPropertyAlert: jest.fn().mockResolvedValue(undefined),
    sendPropertyApprovalAlert: jest.fn().mockResolvedValue(undefined),
    sendVendorInquiryAlert: jest.fn().mockResolvedValue(undefined),
    sendBuyerReplyEmail: jest.fn().mockResolvedValue(undefined),
    sendSettlementSuccessAlert: jest.fn().mockResolvedValue(undefined),
  };

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          load: [
            () => ({
              database: { uri: mongoUri },
              jwt: {
                accessSecret: 'test-access-secret-key-12345',
                refreshSecret: 'test-refresh-secret-key-12345',
                accessExpiresIn: '15m',
                refreshExpiresIn: '7d',
              },
              cors: { origin: 'http://localhost:3000' },
              paystack: { secretKey: 'sk_test_mocked_key' },
              SMTP_HOST: 'smtp.test.local',
              SMTP_PORT: 587,
              SMTP_EMAIL: 'noreply@test.local',
              SMTP_PASSWORD: 'test-password',
              FROM_NAME: 'Vantage Test',
              FROM_EMAIL: 'noreply@test.local',
            }),
          ],
        }),
        MongooseModule.forRoot(mongoUri),
        WinstonModule.forRoot({
          transports: [new winston.transports.Console({ silent: true })],
        }),
        JwtModule.register({ global: true }),
        AuthModule,
        UsersModule,
        PropertiesModule,
        InquiriesModule,
        AdminModule,
        CloudinaryModule,
        PaymentsModule,
      ],
      controllers: [AppController],
      providers: [
        AppService,
        {
          provide: APP_GUARD,
          useClass: JwtAuthGuard,
        },
      ],
    })
      .overrideProvider(MailService)
      .useValue(mailMock)
      .compile();

    app = moduleFixture.createNestApplication();
    app.use(json({ limit: '10mb' }));
    app.use(urlencoded({ extended: true, limit: '10mb' }));
    app.setGlobalPrefix('api', { exclude: ['health'] });
    app.useGlobalFilters(
      new GlobalExceptionFilter(app.get(WINSTON_MODULE_PROVIDER)),
    );
    app.useGlobalInterceptors(new TransformInterceptor());
    await app.init();

    usersService = app.get(UsersService);
    server = app.getHttpServer() as Server;

    jest.spyOn(global, 'fetch').mockImplementation(async (input: RequestInfo | URL) => {
      const url = typeof input === 'string' ? input : input.toString();

      if (url.includes('/transaction/initialize')) {
        return {
          json: async () => ({
            status: true,
            data: {
              authorization_url: 'https://checkout.paystack.mock/authorize',
            },
          }),
        } as Response;
      }

      if (url.includes('/transaction/verify/')) {
        return {
          json: async () => ({
            status: true,
            data: {
              status: paystackVerificationStatus,
            },
          }),
        } as Response;
      }

      return {
        json: async () => ({ status: false }),
      } as Response;
    });
  }, 60000);

  afterAll(async () => {
    jest.restoreAllMocks();
    await app.close();
    await mongoServer.stop();
  });

  it('registers buyer, vendor, and admin accounts', async () => {
    const buyer = await request(server).post('/api/auth/register').send({
      name: 'Flow Buyer',
      email: 'buyer.flow@example.com',
      password: 'Password123',
      role: 'buyer',
    });
    expect(buyer.status).toBe(201);
    buyerAccessToken = buyer.body.data.tokens.accessToken;

    const vendor = await request(server).post('/api/auth/register').send({
      name: 'Flow Vendor',
      email: 'vendor.flow@example.com',
      password: 'Password123',
      role: 'agent',
    });
    expect(vendor.status).toBe(201);
    vendorAccessToken = vendor.body.data.tokens.accessToken;
    vendorId = vendor.body.data.user.id;

    const admin = await request(server).post('/api/auth/register').send({
      name: 'Flow Admin',
      email: 'admin.flow@example.com',
      password: 'Password123',
      role: 'admin',
    });
    expect(admin.status).toBe(201);
    adminAccessToken = admin.body.data.tokens.accessToken;
  });

  it('uses consistent success envelope contract', async () => {
    const response = await request(server).get('/health');
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).toBe('Success');
    expect(typeof response.body.timestamp).toBe('string');
  });

  it('verifies buyer email using OTP', async () => {
    const buyer = await usersService.findByEmail('buyer.flow@example.com');
    if (!buyer) {
      throw new Error('Buyer should exist after registration');
    }
    verificationOtp = buyer.emailVerificationToken as string;
    expect(verificationOtp).toHaveLength(6);

    const response = await request(server).post('/api/auth/verify-email').send({
      email: 'buyer.flow@example.com',
      token: verificationOtp,
    });

    expect(response.status).toBe(200);
    expect(response.body.data.message).toContain('successfully verified');
  });

  it('allows buyer and vendor login', async () => {
    const buyerLogin = await request(server).post('/api/auth/login').send({
      email: 'buyer.flow@example.com',
      password: 'Password123',
    });
    expect(buyerLogin.status).toBe(200);
    buyerAccessToken = buyerLogin.body.data.tokens.accessToken;

    const vendorLogin = await request(server).post('/api/auth/login').send({
      email: 'vendor.flow@example.com',
      password: 'Password123',
    });
    expect(vendorLogin.status).toBe(200);
    vendorAccessToken = vendorLogin.body.data.tokens.accessToken;
  });

  it('lets vendor create a property as pending review', async () => {
    const response = await request(server)
      .post('/api/properties')
      .set('Authorization', `Bearer ${vendorAccessToken}`)
      .send({
        title: 'Flow Duplex Listing',
        description: 'Modern duplex with premium finishes in a secure estate.',
        price: 120000000,
        type: 'sale',
        category: 'residential',
        propertyKind: 'duplex',
        city: 'Lagos',
        state: 'Lagos',
        beds: 5,
        baths: 6,
      });

    expect(response.status).toBe(201);
    expect(response.body.data.status).toBe('pending');
    propertyId = response.body.data.id;
  });

  it('requires admin to approve property listing', async () => {
    const pending = await request(server)
      .get('/api/dashboard/admin/properties/pending')
      .set('Authorization', `Bearer ${adminAccessToken}`);

    expect(pending.status).toBe(200);
    expect(
      pending.body.data.properties.some((property: { id: string }) => property.id === propertyId),
    ).toBe(true);

    const approval = await request(server)
      .put(`/api/dashboard/admin/properties/${propertyId}/approve`)
      .set('Authorization', `Bearer ${adminAccessToken}`);

    expect(approval.status).toBe(200);
    expect(approval.body.data.status).toBe('available');
  });

  it('allows buyer to submit inquiry and vendor to reply', async () => {
    const inquiry = await request(server)
      .post(`/api/properties/${propertyId}/inquiry`)
      .send({
        name: 'Flow Buyer',
        email: 'buyer.flow@example.com',
        message: 'I am interested and want to schedule an inspection tomorrow.',
      });

    expect(inquiry.status).toBe(201);
    inquiryId = inquiry.body.data.id || inquiry.body.data._id;

    const inbox = await request(server)
      .get('/api/inbox')
      .set('Authorization', `Bearer ${vendorAccessToken}`);
    expect(inbox.status).toBe(200);
    expect(inbox.body.data.inquiries.some((item: { id: string }) => item.id === inquiryId)).toBe(true);

    const reply = await request(server)
      .post(`/api/inquiries/${inquiryId}/reply`)
      .set('Authorization', `Bearer ${vendorAccessToken}`)
      .send({
        message: 'Thanks for reaching out. We are available at 10AM tomorrow.',
      });

    expect(reply.status).toBe(201);
    expect(reply.body.data.status).toBe('responded');
  });

  it('initializes and verifies payment, then marks property sold', async () => {
    paystackVerificationStatus = 'success';
    const initialization = await request(server)
      .post(`/api/payments/initialize/${propertyId}`)
      .set('Authorization', `Bearer ${buyerAccessToken}`);

    expect(initialization.status).toBe(201);
    expect(initialization.body.data.authorizationUrl).toContain('paystack.mock');
    transactionReference = initialization.body.data.reference;

    const verification = await request(server)
      .get(`/api/payments/verify/${transactionReference}`)
      .set('Authorization', `Bearer ${buyerAccessToken}`);

    expect(verification.status).toBe(200);
    expect(verification.body.data.status).toBe(TransactionStatus.SUCCESS);

    const property = await request(server).get(`/api/properties/${propertyId}`);
    expect(property.status).toBe(200);
    expect(property.body.data.status).toBe('sold');

    const purchases = await request(server)
      .get('/api/payments/purchases')
      .set('Authorization', `Bearer ${buyerAccessToken}`);
    expect(purchases.status).toBe(200);
    expect(Array.isArray(purchases.body.data)).toBe(true);
    expect(purchases.body.data.length).toBeGreaterThanOrEqual(1);
    expect(purchases.body.data[0].reference).toBe(transactionReference);
    expect(purchases.body.data[0].property).toBeDefined();
  });

  it('blocks non-buyers from payment routes', async () => {
    const asVendor = await request(server)
      .post(`/api/payments/initialize/${propertyId}`)
      .set('Authorization', `Bearer ${vendorAccessToken}`);
    expect(asVendor.status).toBe(403);

    const asAdmin = await request(server)
      .get(`/api/payments/verify/${transactionReference}`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(asAdmin.status).toBe(403);

    const vendorPurchases = await request(server)
      .get('/api/payments/purchases')
      .set('Authorization', `Bearer ${vendorAccessToken}`);
    expect(vendorPurchases.status).toBe(403);
  });

  it('returns validation-shaped error response for malformed params', async () => {
    const malformedAdminId = await request(server)
      .put('/api/dashboard/admin/properties/not-an-object-id/approve')
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(malformedAdminId.status).toBe(400);
    expect(malformedAdminId.body.success).toBe(false);
    expect(malformedAdminId.body.message).toBe('Validation failed');
    expect(Array.isArray(malformedAdminId.body.errors)).toBe(true);

    const malformedPaymentId = await request(server)
      .post('/api/payments/initialize/not-an-object-id')
      .set('Authorization', `Bearer ${buyerAccessToken}`);
    expect(malformedPaymentId.status).toBe(400);
    expect(malformedPaymentId.body.success).toBe(false);
    expect(malformedPaymentId.body.message).toBe('Validation failed');
    expect(Array.isArray(malformedPaymentId.body.errors)).toBe(true);
  });

  it('rejects malformed payment verification reference', async () => {
    const malformedReference = await request(server)
      .get('/api/payments/verify/123')
      .set('Authorization', `Bearer ${buyerAccessToken}`);
    expect(malformedReference.status).toBe(400);
    expect(malformedReference.body.success).toBe(false);
    expect(malformedReference.body.message).toBe('Validation failed');
  });

  it('marks transaction failed when gateway verification fails', async () => {
    const newProperty = await request(server)
      .post('/api/properties')
      .set('Authorization', `Bearer ${vendorAccessToken}`)
      .send({
        title: 'Flow Failed Payment Listing',
        description: 'Secondary listing used to test failed payment verification.',
        price: 90000000,
        type: 'sale',
        category: 'residential',
        propertyKind: 'house',
        city: 'Abuja',
        state: 'FCT',
      });
    expect(newProperty.status).toBe(201);
    const newPropertyId = newProperty.body.data.id;

    const approveNewProperty = await request(server)
      .put(`/api/dashboard/admin/properties/${newPropertyId}/approve`)
      .set('Authorization', `Bearer ${adminAccessToken}`);
    expect(approveNewProperty.status).toBe(200);
    expect(approveNewProperty.body.data.status).toBe('available');

    const initFailedFlow = await request(server)
      .post(`/api/payments/initialize/${newPropertyId}`)
      .set('Authorization', `Bearer ${buyerAccessToken}`);
    expect(initFailedFlow.status).toBe(201);

    paystackVerificationStatus = 'failed';
    const failedVerification = await request(server)
      .get(`/api/payments/verify/${initFailedFlow.body.data.reference}`)
      .set('Authorization', `Bearer ${buyerAccessToken}`);
    expect(failedVerification.status).toBe(400);

    const propertyAfterFailure = await request(server).get(
      `/api/properties/${newPropertyId}`,
    );
    expect(propertyAfterFailure.status).toBe(200);
    expect(propertyAfterFailure.body.data.status).toBe('available');

    paystackVerificationStatus = 'success';
  });

  it('keeps admin-only routes protected', async () => {
    const nonAdminAttempt = await request(server)
      .get('/api/dashboard/admin/stats')
      .set('Authorization', `Bearer ${buyerAccessToken}`);

    expect(nonAdminAttempt.status).toBe(403);
  });
});

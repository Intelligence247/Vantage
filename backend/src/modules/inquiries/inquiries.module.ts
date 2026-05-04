import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Inquiry, InquirySchema } from './schema/inquiry.schema';
import { InquiriesRepository } from './repository/inquiries.repository';
import { InquiriesService } from './inquiries.service';
import { InquiriesController } from './inquiries.controller';
import { InquiriesGateway } from './inquiries.gateway';
import { PropertiesModule } from '../properties/properties.module';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inquiry.name, schema: InquirySchema },
    ]),
    PropertiesModule,
    UsersModule,
    MailModule,
  ],
  controllers: [InquiriesController],
  providers: [InquiriesService, InquiriesRepository, InquiriesGateway],
  exports: [InquiriesService],
})
export class InquiriesModule {}

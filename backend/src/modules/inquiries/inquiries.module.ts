import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Inquiry, InquirySchema } from './schema/inquiry.schema';
import { InquiriesRepository } from './repository/inquiries.repository';
import { InquiriesService } from './inquiries.service';
import { InquiriesController } from './inquiries.controller';
import { PropertiesModule } from '../properties/properties.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inquiry.name, schema: InquirySchema },
    ]),
    PropertiesModule,
  ],
  controllers: [InquiriesController],
  providers: [InquiriesService, InquiriesRepository],
  exports: [InquiriesService],
})
export class InquiriesModule {}

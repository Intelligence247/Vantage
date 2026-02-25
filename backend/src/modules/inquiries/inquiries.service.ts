import {
  Injectable,
  NotFoundException,
  Inject,
} from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { InquiriesRepository } from './repository/inquiries.repository';
import { InquiryDocument, Inquiry } from './schema/inquiry.schema';
import { CreateInquiryInput, ContactFormInput } from './dto/inquiry.dto';
import { PropertiesRepository } from '../properties/repository/properties.repository';

@Injectable()
export class InquiriesService {
  constructor(
    private readonly inquiriesRepository: InquiriesRepository,
    private readonly propertiesRepository: PropertiesRepository,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {}

  async createInquiry(
    input: CreateInquiryInput,
    senderId?: string,
  ): Promise<InquiryDocument> {
    const property = await this.propertiesRepository.findById(
      input.propertyId,
    );
    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const inquiry = await this.inquiriesRepository.create({
      property: input.propertyId as unknown as Inquiry['property'],
      agent: property.agent as Inquiry['agent'],
      sender: senderId
        ? (senderId as unknown as Inquiry['sender'])
        : undefined,
      name: input.name,
      email: input.email,
      phone: input.phone,
      message: input.message,
    });

    await this.propertiesRepository.incrementLeads(input.propertyId);

    this.logger.info('Inquiry created', {
      inquiryId: inquiry.id,
      propertyId: input.propertyId,
    });

    return inquiry;
  }

  async createContactMessage(
    input: ContactFormInput,
  ): Promise<{ message: string }> {
    this.logger.info('Contact form submitted', {
      name: input.name,
      email: input.email,
      subject: input.subject,
    });

    return { message: 'Contact message received. We will get back to you shortly.' };
  }

  async getAgentInquiries(
    agentId: string,
    page = 1,
    limit = 20,
  ): Promise<{
    inquiries: InquiryDocument[];
    total: number;
    page: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;
    const filter = { agent: agentId };
    const [inquiries, total] = await Promise.all([
      this.inquiriesRepository.findAll(filter, skip, limit),
      this.inquiriesRepository.count(filter),
    ]);
    return {
      inquiries,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async getUserInquiries(
    userId: string,
    page = 1,
    limit = 20,
  ): Promise<{
    inquiries: InquiryDocument[];
    total: number;
    page: number;
    pages: number;
  }> {
    const skip = (page - 1) * limit;
    const filter = { sender: userId };
    const [inquiries, total] = await Promise.all([
      this.inquiriesRepository.findAll(filter, skip, limit),
      this.inquiriesRepository.count(filter),
    ]);
    return {
      inquiries,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async getInquiryById(id: string): Promise<InquiryDocument> {
    const inquiry = await this.inquiriesRepository.findById(id);
    if (!inquiry) {
      throw new NotFoundException('Inquiry not found');
    }
    return inquiry;
  }

  async updateInquiryStatus(
    id: string,
    status: string,
  ): Promise<InquiryDocument> {
    const inquiry = await this.inquiriesRepository.update(id, {
      status: status as InquiryDocument['status'],
    });
    if (!inquiry) {
      throw new NotFoundException('Inquiry not found');
    }
    this.logger.info('Inquiry status updated', {
      inquiryId: id,
      status,
    });
    return inquiry;
  }
}

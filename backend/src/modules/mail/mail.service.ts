import { Injectable, Inject } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

@Injectable()
export class MailService {
  private transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    @Inject(WINSTON_MODULE_PROVIDER) private readonly logger: Logger,
  ) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get<string>('SMTP_HOST'),
      port: this.configService.get<number>('SMTP_PORT'),
      secure: this.configService.get<number>('SMTP_PORT') === 465, // true for 465, false for other ports
      auth: {
        user: this.configService.get<string>('SMTP_EMAIL'),
        pass: this.configService.get<string>('SMTP_PASSWORD'),
      },
    });
  }

  async sendEmailVerification(to: string, name: string, token: string) {
    const from = `${this.configService.get<string>('FROM_NAME')} <${this.configService.get<string>('FROM_EMAIL')}>`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Verify Your Email Address</h2>
        <p>Hi ${name},</p>
        <p>Welcome to Vantage! Please use the 6-digit code below to verify your email address:</p>
        <div style="padding: 15px; background-color: #f4f4f4; border-radius: 5px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px;">
          ${token}
        </div>
        <p>This code will expire in 30 minutes.</p>
        <p>If you did not create an account, please ignore this email.</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from,
        to,
        subject: 'Verify Your Email - Vantage',
        html,
      });
      this.logger.info(`Verification email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send verification email to ${to}`, error);
    }
  }

  async sendAdminVendorAlert(vendorName: string, vendorEmail: string) {
    const to = this.configService.get<string>('FROM_EMAIL'); // Sending to admin's default email
    const from = `${this.configService.get<string>('FROM_NAME')} <${this.configService.get<string>('FROM_EMAIL')}>`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Action Required: New Vendor Verification</h2>
        <p>A new vendor has uploaded their KYC document and is waiting for verification.</p>
        <p><strong>Vendor Name:</strong> ${vendorName}</p>
        <p><strong>Vendor Email:</strong> ${vendorEmail}</p>
        <p>Please log in to the admin dashboard to review and verify this user.</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from,
        to,
        subject: 'New Vendor Verification Required - Vantage',
        html,
      });
      this.logger.info(`Admin alert email sent for vendor ${vendorEmail}`);
    } catch (error) {
      this.logger.error(`Failed to send admin alert email for ${vendorEmail}`, error);
    }
  }

  async sendVendorApproval(to: string, name: string) {
    const from = `${this.configService.get<string>('FROM_NAME')} <${this.configService.get<string>('FROM_EMAIL')}>`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Congratulations! Your Account is Verified</h2>
        <p>Hi ${name},</p>
        <p>Your KYC details have been reviewed and approved by the admin.</p>
        <p>You can now log in to your Vantage dashboard and start publishing property listings.</p>
        <p>Welcome aboard!</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from,
        to,
        subject: 'Account Verified - Vantage',
        html,
      });
      this.logger.info(`Vendor approval email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send vendor approval email to ${to}`, error);
    }
  }

  async sendAdminPropertyAlert(vendorName: string, propertyTitle: string) {
    const to = this.configService.get<string>('FROM_EMAIL'); // default to admin
    const from = `${this.configService.get<string>('FROM_NAME')} <${this.configService.get<string>('FROM_EMAIL')}>`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Action Required: New Property Listing</h2>
        <p>A vendor has just submitted a new property listing for review.</p>
        <p><strong>Vendor Name:</strong> ${vendorName}</p>
        <p><strong>Property Title:</strong> ${propertyTitle}</p>
        <p>Please log in to the admin dashboard to review and approve this listing before it goes live.</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from,
        to,
        subject: 'New Property Pending Review - Vantage',
        html,
      });
      this.logger.info(`Admin alert email sent for property '${propertyTitle}'`);
    } catch (error) {
      this.logger.error(`Failed to send admin property alert`, error);
    }
  }

  async sendPropertyApprovalAlert(to: string, vendorName: string, propertyTitle: string) {
    const from = `${this.configService.get<string>('FROM_NAME')} <${this.configService.get<string>('FROM_EMAIL')}>`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Your Listing is Live!</h2>
        <p>Hi ${vendorName},</p>
        <p>Great news! Your property listing <strong>"${propertyTitle}"</strong> has been approved by our team.</p>
        <p>It is now publicly visible to all buyers on the marketplace.</p>
        <p>Thank you for choosing Vantage.</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from,
        to,
        subject: 'Property Approved - Vantage',
        html,
      });
      this.logger.info(`Property approval email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send property approval email to ${to}`, error);
    }
  }

  async sendVendorInquiryAlert(to: string, vendorName: string, propertyTitle: string, buyerName: string, message: string) {
    const from = `${this.configService.get<string>('FROM_NAME')} <${this.configService.get<string>('FROM_EMAIL')}>`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>New Inquiry on Your Property!</h2>
        <p>Hi ${vendorName},</p>
        <p><strong>${buyerName}</strong> is interested in your property <strong>"${propertyTitle}"</strong>.</p>
        <div style="padding: 15px; margin: 15px 0; background-color: #f8f9fa; border-left: 4px solid #007bff; border-radius: 4px;">
          <p style="margin: 0; font-style: italic;">"${message}"</p>
        </div>
        <p>Please log in to your Vantage dashboard to reply to this lead and schedule an inspection.</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from,
        to,
        subject: `New Lead: ${propertyTitle} - Vantage`,
        html,
      });
      this.logger.info(`Vendor inquiry alert email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send vendor inquiry alert email to ${to}`, error);
    }
  }

  async sendBuyerReplyEmail(to: string, buyerName: string, propertyTitle: string, agentName: string, replyMessage: string) {
    const from = `${this.configService.get<string>('FROM_NAME')} <${this.configService.get<string>('FROM_EMAIL')}>`;
    
    const html = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Agent Reply regarding: ${propertyTitle}</h2>
        <p>Hi ${buyerName || 'there'},</p>
        <p><strong>${agentName}</strong> has replied to your inquiry.</p>
        <div style="padding: 15px; margin: 15px 0; background-color: #f8f9fa; border-left: 4px solid #28a745; border-radius: 4px;">
          <p style="margin: 0;">${replyMessage.replace(/\n/g, '<br>')}</p>
        </div>
        <p>If you'd like to continue the conversation, log back in to your Vantage dashboard or contact the agent directly.</p>
        <p>Thank you for using Vantage.</p>
      </div>
    `;

    try {
      await this.transporter.sendMail({
        from,
        to,
        subject: `Reply from ${agentName} - Vantage`,
        html,
      });
      this.logger.info(`Buyer reply email sent to ${to}`);
    } catch (error) {
      this.logger.error(`Failed to send buyer reply email to ${to}`, error);
    }
  }

  async sendSettlementSuccessAlert(buyerEmail: string, vendorEmail: string, propertyTitle: string, amount: number) {
    const from = `${this.configService.get<string>('FROM_NAME')} <${this.configService.get<string>('FROM_EMAIL')}>`;
    
    const formattedAmount = new Intl.NumberFormat('en-NG', { style: 'currency', currency: 'NGN' }).format(amount);

    const buyerHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Payment Successful!</h2>
        <p>Your payment for <strong>"${propertyTitle}"</strong> was successful.</p>
        <p><strong>Amount Paid:</strong> ${formattedAmount}</p>
        <p>The vendor has been notified and the property has been marked as Sold.</p>
        <p>Thank you for using Vantage!</p>
      </div>
    `;

    const vendorHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>Your Property Was Sold!</h2>
        <p>Great news! A buyer has successfully completed the settlement for <strong>"${propertyTitle}"</strong>.</p>
        <p><strong>Settled Amount:</strong> ${formattedAmount}</p>
        <p>The property is now marked as Sold and removed from the active marketplace.</p>
      </div>
    `;

    try {
      // Send to Buyer
      await this.transporter.sendMail({
        from,
        to: buyerEmail,
        subject: `Payment Receipt: ${propertyTitle} - Vantage`,
        html: buyerHtml,
      });
      // Send to Vendor
      await this.transporter.sendMail({
        from,
        to: vendorEmail,
        subject: `Property Sold: ${propertyTitle} - Vantage`,
        html: vendorHtml,
      });
      this.logger.info(`Settlement emails sent for property ${propertyTitle}`);
    } catch (error) {
      this.logger.error(`Failed to send settlement emails for property ${propertyTitle}`, error);
    }
  }
}

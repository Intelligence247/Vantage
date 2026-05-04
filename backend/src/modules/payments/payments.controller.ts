import { Controller, Post, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiParam } from '@nestjs/swagger';
import { PaymentsService } from './payments.service';
import { CurrentUser, JwtPayload, Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';
import { Role } from '../../common/enums';
import { zodValidate } from '../../common/utils';
import {
  initializePaymentParamSchema,
  verifyPaymentParamSchema,
} from './dto/payments.dto';

@ApiTags('Payments')
@Controller('payments')
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('initialize/:propertyId')
  @UseGuards(RolesGuard)
  @Roles(Role.BUYER, Role.USER)
  @ApiOperation({ summary: 'Initialize a new Paystack checkout' })
  @ApiParam({ name: 'propertyId', description: 'The ID of the property to purchase' })
  async initializePayment(
    @CurrentUser() user: JwtPayload,
    @Param('propertyId') propertyId: string,
  ) {
    const validated = zodValidate(initializePaymentParamSchema, { propertyId });
    return this.paymentsService.initializePayment(validated.propertyId, user.sub);
  }

  @Get('purchases')
  @UseGuards(RolesGuard)
  @Roles(Role.BUYER, Role.USER)
  @ApiOperation({
    summary:
      'List successful purchases for the current buyer (payment receipts + listing details)',
  })
  async getMyPurchases(@CurrentUser() user: JwtPayload) {
    return this.paymentsService.getPurchasesForBuyer(user.sub);
  }

  @Get('verify/:reference')
  @UseGuards(RolesGuard)
  @Roles(Role.BUYER, Role.USER)
  @ApiOperation({ summary: 'Verify a Paystack callback reference' })
  @ApiParam({ name: 'reference', description: 'The transaction reference from Paystack' })
  async verifyPayment(
    @Param('reference') reference: string,
  ) {
    const validated = zodValidate(verifyPaymentParamSchema, { reference });
    return this.paymentsService.verifyPayment(validated.reference);
  }
}

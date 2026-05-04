import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Transaction, TransactionSchema } from './schema/transaction.schema';
import { TransactionsRepository } from './repository/transactions.repository';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { PropertiesModule } from '../properties/properties.module';
import { UsersModule } from '../users/users.module';
import { MailModule } from '../mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Transaction.name, schema: TransactionSchema },
    ]),
    PropertiesModule,
    UsersModule,
    MailModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService, TransactionsRepository],
  exports: [PaymentsService],
})
export class PaymentsModule {}

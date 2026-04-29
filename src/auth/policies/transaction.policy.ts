import { ForbiddenException } from '@nestjs/common';
import { AuthUser } from '../types/auth-user.type';
import { TransactionEntity } from '../../transaction/domain/entities/transaction.entity';

export class TransactionPolicy {
  static assertCanAccess(user: AuthUser, transaction: TransactionEntity) {
    if (user.type !== 'ADMIN' && transaction.userUuid !== user.uuid) {
      throw new ForbiddenException(
        'You do not have access to this transaction',
      );
    }
  }

  static canAccess(user: AuthUser, transaction: TransactionEntity) {
    return user.type === 'ADMIN' || transaction.userUuid === user.uuid;
  }
}

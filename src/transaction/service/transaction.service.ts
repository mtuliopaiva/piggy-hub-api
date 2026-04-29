import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { TransactionRepository } from '../repositories/transaction.repository';
import { CreateTransactionDto } from '../domain/dtos/create-transaction.dto';
import { UpdateTransactionDto } from '../domain/dtos/update-transaction.dto';
import { AuditService } from '../../audits/service/audit.service';
import { toAuditJson } from '../../audits/utils/convertToAuditJson';
import { CategoryRepository } from '../../category/repositories/category.repository';
import { TransactionPolicy } from '../../auth/policies/transaction.policy';
import { AuthUser } from '../../auth/types/auth-user.type';
import { UserType } from '@prisma/client';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly categoryRepository: CategoryRepository,
    private readonly auditService: AuditService,
  ) {}

  async list(params: {
    search?: string;
    categoryUuid?: string;
    user: AuthUser;
  }) {
    const { search, categoryUuid, user } = params;

    const userUuid = user.type === UserType.ADMIN ? undefined : user.uuid;

    const [data, total] = await Promise.all([
      this.transactionRepository.findMany(
        search,
        categoryUuid,
        userUuid, // 🔥 filtrado corretamente
      ),
      this.transactionRepository.count(search, categoryUuid, userUuid),
    ]);

    return { data, total };
  }
  async findByUuid(uuid: string, user: AuthUser) {
    const transaction = await this.transactionRepository.findByUuid(uuid);

    if (!transaction || transaction.deletedAt) {
      throw new NotFoundException('Transaction not found');
    }
    TransactionPolicy.assertCanAccess(user, transaction);

    return transaction;
  }

  async createTransaction(dto: CreateTransactionDto, user: { uuid: string }) {
    const category = await this.categoryRepository.findByUuid(dto.categoryUuid);

    if (!category || category.deletedAt) {
      throw new NotFoundException('Category not found');
    }

    return this.transactionRepository.create({
      title: dto.title,
      amount: dto.amount,
      type: dto.type,
      date: new Date(dto.date),
      categoryUuid: dto.categoryUuid,
      userUuid: user.uuid,
    });
  }

  async updateTransaction(
    uuid: string,
    dto: UpdateTransactionDto,
    user: AuthUser,
  ) {
    const transaction = await this.transactionRepository.findByUuid(uuid);

    if (!transaction || transaction.deletedAt) {
      throw new NotFoundException('Transaction not found');
    }

    TransactionPolicy.assertCanAccess(user, transaction);

    return this.transactionRepository.updateTransaction(transaction.uuid, {
      ...dto,
      date: dto.date ? new Date(dto.date) : undefined,
    });
  }
  async softDelete(uuid: string, user: AuthUser) {
    const oldTransaction = await this.transactionRepository.findByUuid(uuid);

    if (!oldTransaction || oldTransaction.deletedAt) {
      throw new NotFoundException('Transaction not found');
    }

    TransactionPolicy.assertCanAccess(user, oldTransaction);

    const deletedTransaction =
      await this.transactionRepository.softDelete(uuid);

    await this.auditService.create({
      actorUuid: user.uuid,
      actorEmail: user.email,
      action: 'transaction.delete',
      entity: 'Transaction',
      entityUuid: uuid,
      oldData: toAuditJson(oldTransaction),
      newData: toAuditJson(deletedTransaction),
    });

    return deletedTransaction;
  }

  async restore(uuid: string, user: AuthUser) {
    const transaction = await this.transactionRepository.findByUuid(uuid);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    TransactionPolicy.assertCanAccess(user, transaction);

    if (!transaction.deletedAt) {
      throw new BadRequestException('Transaction is not deleted');
    }

    const restoredTransaction = await this.transactionRepository.restore(uuid);

    await this.auditService.create({
      actorUuid: user.uuid,
      actorEmail: user.email,
      action: 'transaction.restore',
      entity: 'Transaction',
      entityUuid: uuid,
      oldData: toAuditJson(transaction),
      newData: toAuditJson(restoredTransaction),
    });

    return restoredTransaction;
  }
}

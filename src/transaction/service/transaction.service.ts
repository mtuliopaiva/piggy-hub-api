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

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly auditService: AuditService,
  ) {}

  async list(params?: {
    search?: string;
    categoryUuid?: string;
    userUuid?: string;
  }) {
    const [data, total] = await Promise.all([
      this.transactionRepository.findMany(
        params?.search,
        params?.categoryUuid,
        params?.userUuid,
      ),
      this.transactionRepository.count(
        params?.search,
        params?.categoryUuid,
        params?.userUuid,
      ),
    ]);

    return { data, total };
  }
  async findByUuid(uuid: string) {
    const transaction = await this.transactionRepository.findByUuid(uuid);

    if (!transaction || transaction.deletedAt) {
      throw new NotFoundException('Transaction not found');
    }

    return transaction;
  }

  async createTransaction(dto: CreateTransactionDto, user: { uuid: string }) {
    const transaction = await this.transactionRepository.findByUuid(
      dto.categoryUuid,
    );

    if (!transaction || transaction.deletedAt) {
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

  async updateTransaction(uuid: string, dto: UpdateTransactionDto) {
    const transaction = await this.transactionRepository.findByUuid(uuid);

    if (!transaction || transaction.deletedAt) {
      throw new NotFoundException('Transaction not found');
    }

    return this.transactionRepository.updateTransaction(transaction.uuid, dto);
  }
  async softDelete(uuid: string, actor: { uuid: string; email: string }) {
    const oldTransaction = await this.transactionRepository.findByUuid(uuid);

    if (!oldTransaction || oldTransaction.deletedAt) {
      throw new NotFoundException('Transaction not found');
    }

    const deletedTransaction =
      await this.transactionRepository.softDelete(uuid);

    await this.auditService.create({
      actorUuid: actor.uuid,
      actorEmail: actor.email,
      action: 'transaction.delete',
      entity: 'Transaction',
      entityUuid: uuid,
      oldData: toAuditJson(oldTransaction),
      newData: toAuditJson(deletedTransaction),
    });

    return deletedTransaction;
  }

  async restore(uuid: string, actor: { uuid: string; email: string }) {
    const transaction = await this.transactionRepository.findByUuid(uuid);

    if (!transaction) {
      throw new NotFoundException('Transaction not found');
    }

    if (!transaction.deletedAt) {
      throw new BadRequestException('Transaction is not deleted');
    }

    const restoredTransaction = await this.transactionRepository.restore(uuid);

    await this.auditService.create({
      actorUuid: actor.uuid,
      actorEmail: actor.email,
      action: 'transaction.restore',
      entity: 'Transaction',
      entityUuid: uuid,
      oldData: toAuditJson(transaction),
      newData: toAuditJson(restoredTransaction),
    });

    return restoredTransaction;
  }
}

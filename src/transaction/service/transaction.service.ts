import { Injectable, NotFoundException } from '@nestjs/common';
import { TransactionRepository } from '../repositories/transaction.repository';
import { CreateTransactionDto } from '../domain/dtos/create-transaction.dto';
import { CategoryRepository } from '../../category/repositories/category.repository';

@Injectable()
export class TransactionService {
  constructor(
    private readonly transactionRepository: TransactionRepository,
    private readonly categoryRepository: CategoryRepository,
  ) {}

  async list(params?: { search?: string; categoryUuid?: string }) {
    const [data, total] = await Promise.all([
      this.transactionRepository.findMany(params?.search, params?.categoryUuid),
      this.transactionRepository.count(params?.search, params?.categoryUuid),
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
}

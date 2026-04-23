import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { TransactionRepository } from './transaction.repository';
import { TransactionEntity } from '../domain/entities/transaction.entity';
import { CreateTransactionData } from '../domain/types/create-transaction-data.type';

@Injectable()
export class PrismaTransactionRepository implements TransactionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByUuid(uuid: string): Promise<TransactionEntity | null> {
    return this.prisma.transaction.findUnique({
      where: { uuid },
      include: {
        category: {
          select: {
            uuid: true,
            name: true,
          },
        },
      },
    });
  }

  async findMany(
    search?: string,
    categoryUuid?: string,
  ): Promise<TransactionEntity[]> {
    return this.prisma.transaction.findMany({
      where: {
        deletedAt: null,
        ...(categoryUuid ? { categoryUuid } : {}),
        ...(search
          ? {
              title: {
                contains: search,
                mode: 'insensitive',
              },
            }
          : {}),
      },
      select: {
        uuid: true,
        title: true,
        amount: true,
        type: true,
        date: true,
        userUuid: true,
        categoryUuid: true,
        createdAt: true,
        updatedAt: true,
        deletedAt: true,
        category: {
          select: {
            uuid: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    }) as Promise<TransactionEntity[]>;
  }

  async count(search?: string, categoryUuid?: string): Promise<number> {
    return this.prisma.transaction.count({
      where: {
        deletedAt: null,
        ...(categoryUuid ? { categoryUuid } : {}),
        ...(search
          ? {
              title: {
                contains: search,
                mode: 'insensitive',
              },
            }
          : {}),
      },
    });
  }

  async create(data: CreateTransactionData): Promise<TransactionEntity> {
    return this.prisma.transaction.create({
      data: {
        title: data.title,
        amount: data.amount,
        type: data.type,
        date: data.date,
        userUuid: data.userUuid,
        categoryUuid: data.categoryUuid,
      },
      include: {
        category: {
          select: {
            uuid: true,
            name: true,
          },
        },
      },
    });
  }
}

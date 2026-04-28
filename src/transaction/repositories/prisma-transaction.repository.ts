import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../core/database/prisma.service';
import { TransactionRepository } from './transaction.repository';
import { TransactionEntity } from '../domain/entities/transaction.entity';
import { CreateTransactionData } from '../domain/types/create-transaction-data.type';
import { UpdateTransactionDto } from '../domain/dtos/update-transaction.dto';

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
    userUid?: string,
  ): Promise<TransactionEntity[]> {
    return this.prisma.transaction.findMany({
      where: {
        deletedAt: null,
        ...(categoryUuid ? { categoryUuid } : {}),
        ...(userUid ? { userUuid: userUid } : {}),
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

  async count(
    search?: string,
    categoryUuid?: string,
    userUid?: string,
  ): Promise<number> {
    return this.prisma.transaction.count({
      where: {
        deletedAt: null,
        ...(categoryUuid ? { categoryUuid } : {}),
        ...(userUid ? { userUuid: userUid } : {}),
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

  async updateTransaction(
    uuid: string,
    dto: UpdateTransactionDto,
  ): Promise<TransactionEntity> {
    return this.prisma.transaction.update({
      where: { uuid },
      data: {
        title: dto.title,
        amount: dto.amount,
        type: dto.type,
        date: dto.date,
        categoryUuid: dto.categoryUuid,
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

  async softDelete(uuid: string): Promise<TransactionEntity> {
    return this.prisma.transaction.update({
      where: { uuid },
      data: {
        deletedAt: new Date(),
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

  async restore(uuid: string): Promise<TransactionEntity> {
    return this.prisma.transaction.update({
      where: { uuid },
      data: {
        deletedAt: null,
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

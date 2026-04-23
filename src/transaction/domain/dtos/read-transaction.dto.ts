import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';
import { IsOptional } from 'class-validator';

export class ReadTransactionDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  amount: Decimal;

  @ApiProperty()
  type: TransactionType;

  @ApiProperty()
  category: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  userUuid: string;

  @ApiProperty()
  categoryUuid: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty()
  deletedAt: Date | null;
}

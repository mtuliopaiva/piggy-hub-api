import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ListTransactionQuery } from './list-transaction.query';
import { ReadTransactionDto } from '../dtos/read-transaction.dto';
import { TransactionService } from '../../service/transaction.service';

@QueryHandler(ListTransactionQuery)
export class ListTransactionHandler implements IQueryHandler<ListTransactionQuery> {
  constructor(private readonly service: TransactionService) {}

  async execute(query: ListTransactionQuery): Promise<{
    data: ReadTransactionDto[];
    meta: { total: number };
  }> {
    const { data, total } = await this.service.list(query.data);

    return {
      data: data.map(
        (transaction): ReadTransactionDto => ({
          uuid: transaction.uuid,
          title: transaction.title,
          amount: transaction.amount,
          type: transaction.type,
          date: transaction.date,
          userUuid: transaction.userUuid,
          categoryUuid: transaction.categoryUuid,
          category: transaction.category.name,
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
          deletedAt: transaction.deletedAt,
        }),
      ),
      meta: { total },
    };
  }
}

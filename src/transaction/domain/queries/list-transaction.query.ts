export class ListTransactionQuery {
  constructor(
    public readonly data: {
      search?: string;
      categoryUuid?: string;
    },
  ) {}
}

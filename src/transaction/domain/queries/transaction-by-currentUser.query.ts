export class TransactionByCurrentUserQuery {
  constructor(public readonly data: { userUuid: string }) {}
}

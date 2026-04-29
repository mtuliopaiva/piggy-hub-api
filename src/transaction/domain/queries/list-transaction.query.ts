import { AuthUser } from '../../../auth/types/auth-user.type';

export class ListTransactionQuery {
  constructor(
    public readonly params: {
      search?: string;
      categoryUuid?: string;
      user: AuthUser;
    },
  ) {}
}

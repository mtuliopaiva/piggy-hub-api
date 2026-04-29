import { AuthUser } from '../../../auth/types/auth-user.type';

export class DeleteTransactionCommand {
  constructor(
    public readonly uuid: string,
    public readonly user: AuthUser,
  ) {}
}

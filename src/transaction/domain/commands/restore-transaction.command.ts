import { AuthUser } from '../../../auth/types/auth-user.type';

export class RestoreTransactionCommand {
  constructor(
    public readonly uuid: string,
    public readonly user: AuthUser,
  ) {}
}

import { AuthUser } from '../../../auth/types/auth-user.type';
import { UpdateTransactionDto } from '../dtos/update-transaction.dto';

export class UpdateTransactionCommand {
  constructor(
    public readonly uuid: string,
    public readonly dto: UpdateTransactionDto,
    public readonly user: AuthUser,
  ) {}
}

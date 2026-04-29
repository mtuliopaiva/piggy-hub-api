import { UserType } from '@prisma/client';

export interface AuthUser {
  uuid: string;
  email: string;
  type: UserType;
  roles: string[];
  permissions: string[];
}

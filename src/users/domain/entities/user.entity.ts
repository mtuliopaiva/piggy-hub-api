import { UserType } from '@prisma/client';

export class UserEntity {
  uuid: string;
  email: string;
  password: string;
  type: UserType;
  userProfile?: {
    name?: string;
    avatarUrl?: string;
    birthDate?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

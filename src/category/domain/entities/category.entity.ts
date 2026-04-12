import { UserType } from '@prisma/client';

export class CategoryEntity {
  uuid: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

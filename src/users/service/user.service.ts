import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';

import { UserRepository } from '../repositories/user.repository';
import { UpdateUserDto } from '../domain/dtos/update-user.dto';
import { AuditService } from '../../audits/service/audit.service';
import { toAuditJson } from '../../audits/utils/convertToAuditJson';
import { UserType } from '@prisma/client';
import { UpdateUserProfileDto } from '../domain/dtos/update-userProfile.dto';
import { UserEntity } from '../domain/entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly auditService: AuditService,
  ) {}

  async list(params?: { search?: string }) {
    const [data, total] = await Promise.all([
      this.userRepository.findMany(params?.search),
      this.userRepository.count(params?.search),
    ]);

    return { data, total };
  }

  async findByUuid(uuid: string) {
    const user = await this.userRepository.findByUuid(uuid);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async findUserProfileByUuid(uuid: string) {
    const user = await this.userRepository.findUserProfileByUuid(uuid);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async update(
    uuid: string,
    dto: UpdateUserDto,
    actor: { uuid: string; email: string },
  ) {
    const oldUser = await this.findByUuid(uuid);

    const data: {
      email?: string;
      type?: UserType;
      password?: string;
    } = {
      ...(dto.email ? { email: dto.email } : {}),
      ...(dto.type ? { type: dto.type } : {}),
    };

    if (dto.password) {
      data.password = await bcrypt.hash(dto.password, 10);
    }

    const updatedUser = await this.userRepository.update(uuid, data);

    await this.auditService.create({
      actorUuid: actor.uuid,
      actorEmail: actor.email,
      action: 'users.update',
      entity: 'User',
      entityUuid: uuid,
      oldData: toAuditJson(oldUser),
      newData: toAuditJson(updatedUser),
    });

    return updatedUser;
  }

  async updateUserProfile(uuid: string, dto: UpdateUserProfileDto) {
    const oldUser = await this.findUserProfileByUuid(uuid);

    const updatedUser = await this.userRepository.updateUserProfile(uuid, dto);

    await this.auditService.create({
      actorUuid: uuid,
      actorEmail: oldUser.email,
      action: 'userProfile.update',
      entity: 'UserProfile',
      entityUuid: uuid,
      oldData: toAuditJson(oldUser.userProfile),
      newData: toAuditJson(updatedUser.userProfile),
    });

    return updatedUser;
  }
  async softDelete(uuid: string, actor: { uuid: string; email: string }) {
    const oldUser = await this.findByUuid(uuid);

    const deletedUser = await this.userRepository.update(uuid, {
      deletedAt: new Date(),
    });

    await this.auditService.create({
      actorUuid: actor.uuid,
      actorEmail: actor.email,
      action: 'users.delete',
      entity: 'User',
      entityUuid: uuid,
      oldData: toAuditJson(oldUser),
      newData: toAuditJson(deletedUser),
    });

    return deletedUser;
  }

  async restore(uuid: string, actor: { uuid: string; email: string }) {
    const deletedUser = await this.userRepository.findDeletedByUuid(uuid);

    if (!deletedUser) {
      throw new NotFoundException('Deleted user not found');
    }

    const restoredUser = await this.userRepository.update(uuid, {
      deletedAt: null,
    });

    await this.auditService.create({
      actorUuid: actor.uuid,
      actorEmail: actor.email,
      action: 'users.restore',
      entity: 'User',
      entityUuid: uuid,
      oldData: toAuditJson(deletedUser),
      newData: toAuditJson(restoredUser),
    });

    return restoredUser;
  }
}

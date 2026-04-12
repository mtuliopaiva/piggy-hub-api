import { ApiProperty } from '@nestjs/swagger';
import { UserType } from '@prisma/client';
import { IsOptional } from 'class-validator';

export class ReadUserProfileDto {
  @ApiProperty()
  uuid: string;

  @ApiProperty()
  userUuid: string;

  @ApiProperty()
  @IsOptional()
  name?: string;

  @ApiProperty()
  @IsOptional()
  birthDate?: Date;

  @ApiProperty()
  @IsOptional()
  avatarUrl?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}

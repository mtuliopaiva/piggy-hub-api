import { ApiProperty } from '@nestjs/swagger';
import { ReadUserDto } from './read-user.dto';

export class ListUserDto {
  @ApiProperty({ type: [ReadUserDto] })
  data: ReadUserDto[];

  @ApiProperty()
  total: number;
}

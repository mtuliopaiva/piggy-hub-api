import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Food' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'Description of the category' })
  @IsString()
  @IsNotEmpty()
  description: string;
}

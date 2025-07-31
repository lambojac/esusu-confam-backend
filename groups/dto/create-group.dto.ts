import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber, Min, IsEnum } from 'class-validator';

export class CreateGroupDto {
  @ApiProperty({ example: 'Book Club Lagos' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'A group for book lovers in Lagos' })
  @IsNotEmpty()
  @IsString()
  description: string;

  @ApiProperty({ example: 20, minimum: 1 })
  @IsNumber()
  @Min(1)
  maxCapacity: number;

  @ApiProperty({ example: 'public', enum: ['public', 'private'] })
  @IsEnum(['public', 'private'])
  visibility: string;
}
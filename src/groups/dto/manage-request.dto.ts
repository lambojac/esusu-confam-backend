import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEnum } from 'class-validator';

export class ManageRequestDto {
  @ApiProperty({ example: '507f1f77bcf86cd799439011' })
  @IsNotEmpty()
  @IsString()
  requestId: string;

  @ApiProperty({ example: 'approved', enum: ['approved', 'rejected'] })
  @IsEnum(['approved', 'rejected'])
  action: string;
}
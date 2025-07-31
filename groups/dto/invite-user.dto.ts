import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class InviteUserDto {
  @ApiProperty({ example: 'ABC123XYZ' })
  @IsNotEmpty()
  @IsString()
  inviteCode: string;
}
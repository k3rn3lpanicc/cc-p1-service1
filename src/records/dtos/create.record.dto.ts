/* eslint-disable prettier/prettier */

import { IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { STATE } from '../enums/state.enum';

export class CreateRecordDto {
  @IsEmail()
  readonly email: string;

  @IsString()
  readonly imageUrl?: string;

  @IsOptional()
  @IsEnum(STATE)
  readonly state?: STATE;

  @IsOptional()
  @IsString()
  readonly resultUrl?: string;
}

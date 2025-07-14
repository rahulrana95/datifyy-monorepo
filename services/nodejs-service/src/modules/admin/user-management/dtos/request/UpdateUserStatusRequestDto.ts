import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { AccountStatusFilter } from './GetUsersRequestDto';

export class UpdateUserStatusRequestDto {
  @IsEnum(AccountStatusFilter)
  accountStatus: AccountStatusFilter;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  adminNotes?: string;

  @IsOptional()
  @IsString()
  suspensionDuration?: string; // ISO duration format for suspensions
}
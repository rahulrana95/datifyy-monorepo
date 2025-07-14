import { IsEnum, IsOptional, IsString, MaxLength, IsBoolean } from 'class-validator';

export enum VerificationType {
  EMAIL = 'email',
  PHONE = 'phone',
  GOVERNMENT_ID = 'government_id',
  WORKPLACE = 'workplace'
}

export class VerifyUserRequestDto {
  @IsEnum(VerificationType)
  verificationType: VerificationType;

  @IsBoolean()
  isVerified: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  verificationNotes?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  verificationMethod?: string;

  @IsOptional()
  @IsString()
  documentType?: string; // For ID verification

  @IsOptional()
  @IsString()
  documentNumber?: string; // For ID verification (hashed/encrypted)
}
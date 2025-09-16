import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, IsNumber, IsArray, IsOptional, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';
import { FarmerAddressDto } from './create-farmer.dto';

export class UpdateFarmerDto {
  @ApiProperty({ description: 'Email address', required: false })
  @IsOptional()
  @IsEmail()
  email?: string;

  @ApiProperty({ description: 'Full name', required: false })
  @IsOptional()
  @IsString()
  fullName?: string;

  @ApiProperty({ description: 'CPF', required: false })
  @IsOptional()
  @IsString()
  cpf?: string;

  @ApiProperty({ description: 'Phone number', required: false })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiProperty({ description: 'Address information', required: false })
  @IsOptional()
  @ValidateNested()
  @Type(() => FarmerAddressDto)
  @IsObject()
  address?: FarmerAddressDto;

  @ApiProperty({ description: 'Years of farm experience', required: false })
  @IsOptional()
  @IsNumber()
  farmExperience?: number;

  @ApiProperty({ description: 'Certifications', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];
}

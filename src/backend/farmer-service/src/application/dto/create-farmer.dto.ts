import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, IsNumber, IsArray, IsOptional, ValidateNested, IsObject } from 'class-validator';
import { Type } from 'class-transformer';

export class FarmerAddressDto {
  @ApiProperty({ description: 'Street address' })
  @IsString()
  @IsNotEmpty()
  street: string;

  @ApiProperty({ description: 'Address number' })
  @IsString()
  @IsNotEmpty()
  number: string;

  @ApiProperty({ description: 'Address complement', required: false })
  @IsOptional()
  @IsString()
  complement?: string;

  @ApiProperty({ description: 'Neighborhood' })
  @IsString()
  @IsNotEmpty()
  neighborhood: string;

  @ApiProperty({ description: 'City' })
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty({ description: 'State' })
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty({ description: 'ZIP code' })
  @IsString()
  @IsNotEmpty()
  zipCode: string;

  @ApiProperty({ description: 'Country', default: 'Brasil' })
  @IsOptional()
  @IsString()
  country?: string;
}

export class CreateFarmerDto {
  @ApiProperty({ description: 'Farmer ID' })
  @IsString()
  @IsNotEmpty()
  id: string;

  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({ description: 'Full name' })
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty({ description: 'CPF' })
  @IsString()
  @IsNotEmpty()
  cpf: string;

  @ApiProperty({ description: 'Phone number' })
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiProperty({ description: 'Address information' })
  @ValidateNested()
  @Type(() => FarmerAddressDto)
  @IsObject()
  address: FarmerAddressDto;

  @ApiProperty({ description: 'Years of farm experience' })
  @IsNumber()
  @IsNotEmpty()
  farmExperience: number;

  @ApiProperty({ description: 'Certifications', type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  certifications?: string[];
}

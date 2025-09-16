import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsArray, IsOptional, IsNotEmpty } from 'class-validator';

export class InvokeContractDto {
  @ApiProperty({
    description: 'ID do contrato na rede Stellar',
    example: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAHHAGK5RXVZ'
  })
  @IsString()
  @IsNotEmpty()
  contractId: string;

  @ApiProperty({
    description: 'Nome da função a ser invocada no contrato',
    example: 'transfer'
  })
  @IsString()
  @IsNotEmpty()
  functionName: string;

  @ApiProperty({
    description: 'Argumentos para a função do contrato',
    example: ['address', 'amount'],
    required: false
  })
  @IsArray()
  @IsOptional()
  args?: any[];

  @ApiProperty({
    description: 'Chave secreta da conta que irá assinar a transação',
    example: 'SABC123...'
  })
  @IsString()
  @IsNotEmpty()
  secretKey: string;
}

export class SimulateContractDto {
  @ApiProperty({
    description: 'ID do contrato na rede Stellar',
    example: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAHHAGK5RXVZ'
  })
  @IsString()
  @IsNotEmpty()
  contractId: string;

  @ApiProperty({
    description: 'Nome da função a ser invocada no contrato',
    example: 'balance'
  })
  @IsString()
  @IsNotEmpty()
  functionName: string;

  @ApiProperty({
    description: 'Argumentos para a função do contrato',
    example: ['address'],
    required: false
  })
  @IsArray()
  @IsOptional()
  args?: any[];

  @ApiProperty({
    description: 'Chave pública da conta para simulação',
    example: 'GABC123...'
  })
  @IsString()
  @IsNotEmpty()
  publicKey: string;
}

export class DeployContractDto {
  @ApiProperty({
    description: 'Código WASM do contrato (em base64)',
    example: 'AGFzbQEAAAAB...'
  })
  @IsString()
  @IsNotEmpty()
  wasmCode: string;

  @ApiProperty({
    description: 'Chave secreta da conta que irá fazer o deploy',
    example: 'SABC123...'
  })
  @IsString()
  @IsNotEmpty()
  secretKey: string;

  @ApiProperty({
    description: 'Argumentos de inicialização do contrato',
    required: false
  })
  @IsArray()
  @IsOptional()
  initArgs?: any[];
}

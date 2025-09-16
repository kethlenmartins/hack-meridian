import { Controller, Post, Get, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { ContractService } from './contract.service';
import { InvokeContractDto, SimulateContractDto, DeployContractDto } from './dto/invoke-contract.dto';

@ApiTags('contracts')
@Controller('contracts')
export class ContractController {
  constructor(private readonly contractService: ContractService) {}

  @Post('invoke')
  @ApiOperation({ 
    summary: 'Invoca uma função de um smart contract',
    description: 'Executa uma função específica de um smart contract deployado na rede Stellar'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Função do contrato executada com sucesso',
    example: {
      success: true,
      transactionHash: 'abc123...',
      result: {},
      timestamp: '2023-12-01T10:00:00.000Z'
    }
  })
  @ApiResponse({ status: 400, description: 'Erro na invocação do contrato' })
  async invokeContract(@Body() invokeDto: InvokeContractDto) {
    return this.contractService.invokeContract(invokeDto);
  }

  @Post('simulate')
  @ApiOperation({ 
    summary: 'Simula a invocação de uma função de contrato',
    description: 'Simula a execução de uma função sem submeter a transação à rede'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Simulação executada com sucesso',
    example: {
      success: true,
      simulation: {},
      timestamp: '2023-12-01T10:00:00.000Z'
    }
  })
  @ApiResponse({ status: 400, description: 'Erro na simulação do contrato' })
  async simulateContract(@Body() simulateDto: SimulateContractDto) {
    return this.contractService.simulateContract(simulateDto);
  }

  @Post('deploy')
  @ApiOperation({ 
    summary: 'Faz o deploy de um novo smart contract',
    description: 'Faz upload do código WASM de um contrato para a rede Stellar'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Contrato deployado com sucesso',
    example: {
      success: true,
      uploadTransactionHash: 'def456...',
      message: 'Contract WASM uploaded successfully',
      timestamp: '2023-12-01T10:00:00.000Z'
    }
  })
  @ApiResponse({ status: 400, description: 'Erro no deploy do contrato' })
  async deployContract(@Body() deployDto: DeployContractDto) {
    return this.contractService.deployContract(deployDto);
  }

  @Get(':contractId')
  @ApiOperation({ 
    summary: 'Obtém informações sobre um contrato',
    description: 'Retorna informações detalhadas sobre um contrato específico'
  })
  @ApiParam({ 
    name: 'contractId', 
    description: 'ID do contrato na rede Stellar',
    example: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAHHAGK5RXVZ'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Informações do contrato obtidas com sucesso',
    example: {
      success: true,
      contractId: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAHHAGK5RXVZ',
      data: {},
      timestamp: '2023-12-01T10:00:00.000Z'
    }
  })
  @ApiResponse({ status: 400, description: 'Erro ao obter informações do contrato' })
  async getContractInfo(@Param('contractId') contractId: string) {
    return this.contractService.getContractInfo(contractId);
  }

  @Get(':contractId/history')
  @ApiOperation({ 
    summary: 'Obtém o histórico de transações de um contrato',
    description: 'Retorna as transações mais recentes relacionadas ao contrato'
  })
  @ApiParam({ 
    name: 'contractId', 
    description: 'ID do contrato na rede Stellar' 
  })
  @ApiQuery({ 
    name: 'limit', 
    description: 'Número máximo de transações a retornar',
    required: false,
    example: 10
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Histórico obtido com sucesso',
    example: {
      success: true,
      contractId: 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAHHAGK5RXVZ',
      transactions: [],
      timestamp: '2023-12-01T10:00:00.000Z'
    }
  })
  async getContractHistory(
    @Param('contractId') contractId: string,
    @Query('limit') limit?: number
  ) {
    return this.contractService.getContractHistory(contractId, limit);
  }

  @Get('utils/create-keypair')
  @ApiOperation({ 
    summary: 'Cria um novo par de chaves Stellar',
    description: 'Gera um novo par de chaves público/privado para uso na rede Stellar'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Par de chaves criado com sucesso',
    example: {
      publicKey: 'GABC123...',
      secretKey: 'SABC123...'
    }
  })
  createKeypair() {
    return this.contractService.createRandomKeypair();
  }

  @Get('utils/check-account/:publicKey')
  @ApiOperation({ 
    summary: 'Verifica se uma conta existe na rede',
    description: 'Verifica se uma conta pública existe na rede Stellar e retorna suas informações'
  })
  @ApiParam({ 
    name: 'publicKey', 
    description: 'Chave pública da conta a ser verificada',
    example: 'GABC123...'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Verificação realizada com sucesso',
    example: {
      success: true,
      exists: true,
      publicKey: 'GABC123...',
      accountId: 'GABC123...',
      sequence: '123456789',
      balances: [],
      timestamp: '2023-12-01T10:00:00.000Z'
    }
  })
  async checkAccount(@Param('publicKey') publicKey: string) {
    return this.contractService.checkAccount(publicKey);
  }
}

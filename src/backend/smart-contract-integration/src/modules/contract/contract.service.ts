import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { StellarService } from '../stellar/stellar.service';
import * as StellarSdk from '@stellar/stellar-sdk';
import { InvokeContractDto, SimulateContractDto, DeployContractDto } from './dto/invoke-contract.dto';

@Injectable()
export class ContractService {
  private readonly logger = new Logger(ContractService.name);

  constructor(private readonly stellarService: StellarService) {}

  /**
   * Invoca uma função de um smart contract
   */
  async invokeContract(invokeDto: InvokeContractDto): Promise<any> {
    try {
      const { contractId, functionName, args = [], secretKey } = invokeDto;
      
      // Cria o keypair a partir da secret key
      const sourceKeypair = this.stellarService.createKeypair(secretKey);
      
      // Converte argumentos para ScVal
      const scArgs = args.map(arg => this.stellarService.nativeToScVal(arg));
      
      // Invoca o contrato
      const result = await this.stellarService.invokeContract(
        contractId,
        functionName,
        scArgs,
        sourceKeypair
      );
      
      return {
        success: true,
        transactionHash: result.hash,
        result: result,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error invoking contract:', error);
      throw new BadRequestException(`Failed to invoke contract: ${error.message}`);
    }
  }

  /**
   * Simula a invocação de uma função de contrato (sem submeter à rede)
   */
  async simulateContract(simulateDto: SimulateContractDto): Promise<any> {
    try {
      const { contractId, functionName, args = [], publicKey } = simulateDto;
      
      // Converte argumentos para ScVal
      const scArgs = args.map(arg => this.stellarService.nativeToScVal(arg));
      
      // Simula a invocação
      const simulation = await this.stellarService.simulateContract(
        contractId,
        functionName,
        scArgs,
        publicKey
      );
      
      return {
        success: true,
        simulation: simulation,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error simulating contract:', error);
      throw new BadRequestException(`Failed to simulate contract: ${error.message}`);
    }
  }

  /**
   * Obtém informações sobre um contrato
   */
  async getContractInfo(contractId: string): Promise<any> {
    try {
      const contractData = await this.stellarService.getContractData(contractId);
      
      return {
        success: true,
        contractId,
        data: contractData,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error getting contract info for ${contractId}:`, error);
      throw new BadRequestException(`Failed to get contract info: ${error.message}`);
    }
  }

  /**
   * Deploy de um novo contrato (funcionalidade avançada)
   */
  async deployContract(deployDto: DeployContractDto): Promise<any> {
    try {
      const { wasmCode, secretKey, initArgs = [] } = deployDto;
      
      // Cria o keypair
      const sourceKeypair = this.stellarService.createKeypair(secretKey);
      
      // Converte o código WASM de base64 para Buffer
      const wasmBuffer = Buffer.from(wasmCode, 'base64');
      
      // Cria a operação de upload do contrato
      const uploadOperation = StellarSdk.Operation.uploadContractWasm({
        wasm: wasmBuffer,
      });
      
      // Constrói e submete a transação de upload
      const uploadTransaction = await this.stellarService.buildTransaction(
        sourceKeypair,
        [uploadOperation]
      );
      
      const uploadResult = await this.stellarService.submitTransaction(uploadTransaction);
      
      this.logger.log(`Contract WASM uploaded successfully: ${uploadResult.hash}`);
      
      // Aqui você pode adicionar lógica para criar uma instância do contrato
      // usando o hash do WASM uploadado
      
      return {
        success: true,
        uploadTransactionHash: uploadResult.hash,
        message: 'Contract WASM uploaded successfully. Create contract instance as next step.',
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Error deploying contract:', error);
      throw new BadRequestException(`Failed to deploy contract: ${error.message}`);
    }
  }

  /**
   * Obtém o histórico de transações de um contrato
   */
  async getContractHistory(contractId: string, limit: number = 10): Promise<any> {
    try {
      const server = this.stellarService.getHorizonServer();
      
      // Busca transações relacionadas ao contrato
      const transactions = await server
        .transactions()
        .forAccount(contractId)
        .limit(limit)
        .order('desc')
        .call();
      
      return {
        success: true,
        contractId,
        transactions: transactions.records,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error(`Error getting contract history for ${contractId}:`, error);
      throw new BadRequestException(`Failed to get contract history: ${error.message}`);
    }
  }

  /**
   * Utilitário para criar um keypair aleatório
   */
  createRandomKeypair(): { publicKey: string; secretKey: string } {
    const keypair = this.stellarService.createKeypair();
    
    return {
      publicKey: keypair.publicKey(),
      secretKey: keypair.secret(),
    };
  }

  /**
   * Verifica se uma conta existe na rede
   */
  async checkAccount(publicKey: string): Promise<any> {
    try {
      const account = await this.stellarService.getAccount(publicKey);
      const balances = await this.stellarService.getAccountBalance(publicKey);
      
      return {
        success: true,
        exists: true,
        publicKey,
        accountId: account.id,
        sequence: account.sequenceNumber(),
        balances,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      if (error.message.includes('does not exist')) {
        return {
          success: true,
          exists: false,
          publicKey,
          message: 'Account does not exist on the network',
          timestamp: new Date().toISOString(),
        };
      }
      
      this.logger.error(`Error checking account ${publicKey}:`, error);
      throw new BadRequestException(`Failed to check account: ${error.message}`);
    }
  }
}

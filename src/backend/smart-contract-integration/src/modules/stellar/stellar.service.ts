import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as StellarSdk from '@stellar/stellar-sdk';

@Injectable()
export class StellarService {
  private readonly logger = new Logger(StellarService.name);
  private readonly server: StellarSdk.Horizon.Server;
  private readonly rpcServer: StellarSdk.rpc.Server;
  private readonly networkPassphrase: string;

  constructor(private configService: ConfigService) {
    // Configuração da rede (testnet por padrão)
    const network = this.configService.get('STELLAR_NETWORK', 'testnet');
    
    if (network === 'mainnet') {
      this.server = new StellarSdk.Horizon.Server('https://horizon.stellar.org');
      this.rpcServer = new StellarSdk.rpc.Server('https://soroban-rpc.stellar.org');
      this.networkPassphrase = StellarSdk.Networks.PUBLIC;
    } else {
      this.server = new StellarSdk.Horizon.Server('https://horizon-testnet.stellar.org');
      this.rpcServer = new StellarSdk.rpc.Server('https://soroban-rpc.stellar.org:443');
      this.networkPassphrase = StellarSdk.Networks.TESTNET;
    }

    this.logger.log(`Stellar service initialized for ${network} network`);
  }

  /**
   * Obtém informações da conta
   */
  async getAccount(publicKey: string): Promise<StellarSdk.Horizon.AccountResponse> {
    try {
      const account = await this.server.loadAccount(publicKey);
      return account;
    } catch (error) {
      this.logger.error(`Error loading account ${publicKey}:`, error);
      throw new Error(`Failed to load account: ${error.message}`);
    }
  }

  /**
   * Cria um keypair a partir de uma secret key
   */
  createKeypair(secretKey?: string): StellarSdk.Keypair {
    if (secretKey) {
      return StellarSdk.Keypair.fromSecret(secretKey);
    }
    return StellarSdk.Keypair.random();
  }

  /**
   * Obtém o saldo de uma conta
   */
  async getAccountBalance(publicKey: string): Promise<any[]> {
    try {
      const account = await this.getAccount(publicKey);
      return account.balances;
    } catch (error) {
      this.logger.error(`Error getting balance for ${publicKey}:`, error);
      throw error;
    }
  }

  /**
   * Submete uma transação para a rede
   */
  async submitTransaction(transaction: StellarSdk.Transaction): Promise<StellarSdk.Horizon.SubmitTransactionResponse> {
    try {
      const result = await this.server.submitTransaction(transaction);
      this.logger.log(`Transaction submitted successfully: ${result.hash}`);
      return result;
    } catch (error) {
      this.logger.error('Error submitting transaction:', error);
      throw new Error(`Failed to submit transaction: ${error.message}`);
    }
  }

  /**
   * Constrói uma transação básica
   */
  async buildTransaction(sourceKeypair: StellarSdk.Keypair, operations: StellarSdk.Operation[]): Promise<StellarSdk.Transaction> {
    try {
      const sourceAccount = await this.getAccount(sourceKeypair.publicKey());
      
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      });

      // Adiciona as operações
      operations.forEach(operation => {
        transaction.addOperation(operation);
      });

      const builtTransaction = transaction.setTimeout(300).build();
      builtTransaction.sign(sourceKeypair);

      return builtTransaction;
    } catch (error) {
      this.logger.error('Error building transaction:', error);
      throw error;
    }
  }

  /**
   * Obtém informações sobre um smart contract
   */
  async getContractData(contractId: string): Promise<any> {
    try {
      // Usa o RPC server para obter dados do contrato
      const contractAddress = new StellarSdk.Address(contractId);
      this.logger.log(`Getting contract data for: ${contractId}`);
      
      return {
        contractId,
        address: contractAddress.toString(),
        // Adicione mais lógica específica conforme necessário
      };
    } catch (error) {
      this.logger.error(`Error getting contract data for ${contractId}:`, error);
      throw error;
    }
  }

  /**
   * Invoca uma função do smart contract
   */
  async invokeContract(
    contractId: string,
    functionName: string,
    args: StellarSdk.xdr.ScVal[],
    sourceKeypair: StellarSdk.Keypair
  ): Promise<any> {
    try {
      const contract = new StellarSdk.Contract(contractId);
      
      // Cria a operação de invocação do contrato
      const operation = contract.call(functionName, ...args);
      
      // Constrói e submete a transação
      const transaction = await this.buildTransaction(sourceKeypair, [operation]);
      const result = await this.submitTransaction(transaction);
      
      this.logger.log(`Contract invocation successful: ${result.hash}`);
      return result;
    } catch (error) {
      this.logger.error(`Error invoking contract ${contractId}.${functionName}:`, error);
      throw error;
    }
  }

  /**
   * Simula uma invocação de contrato (sem submeter à rede)
   */
  async simulateContract(
    contractId: string,
    functionName: string,
    args: StellarSdk.xdr.ScVal[],
    sourcePublicKey: string
  ): Promise<any> {
    try {
      const contract = new StellarSdk.Contract(contractId);
      const sourceAccount = await this.getAccount(sourcePublicKey);
      
      const operation = contract.call(functionName, ...args);
      
      const transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(operation)
        .setTimeout(300)
        .build();

      // Simula a transação usando o RPC server
      const simulation = await this.rpcServer.simulateTransaction(transaction);
      
      this.logger.log(`Contract simulation completed for ${contractId}.${functionName}`);
      return simulation;
    } catch (error) {
      this.logger.error(`Error simulating contract ${contractId}.${functionName}:`, error);
      throw error;
    }
  }

  /**
   * Converte valores nativos para ScVal (usado em argumentos de contratos)
   */
  nativeToScVal(value: any): StellarSdk.xdr.ScVal {
    return StellarSdk.nativeToScVal(value);
  }

  /**
   * Converte ScVal para valores nativos
   */
  scValToNative(scVal: StellarSdk.xdr.ScVal): any {
    return StellarSdk.scValToNative(scVal);
  }

  /**
   * Getters para acesso aos servidores
   */
  getHorizonServer(): StellarSdk.Horizon.Server {
    return this.server;
  }

  getRpcServer(): StellarSdk.rpc.Server {
    return this.rpcServer;
  }

  getNetworkPassphrase(): string {
    return this.networkPassphrase;
  }
}

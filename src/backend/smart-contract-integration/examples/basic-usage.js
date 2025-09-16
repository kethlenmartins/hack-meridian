/**
 * Exemplo básico de uso do Stellar Contract Integration Service
 * 
 * Este script demonstra como usar o serviço para:
 * 1. Criar um novo par de chaves
 * 2. Verificar uma conta
 * 3. Simular uma função de contrato
 * 4. Invocar uma função de contrato
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3004';

// Exemplo de ID de contrato (substitua pelo seu contrato real)
const EXAMPLE_CONTRACT_ID = 'CDLZFC3SYJYDZT7K67VZ75HPJVIEUVNIXF47ZG2FB2RMQQAHHAGK5RXVZ';

/**
 * Função auxiliar para fazer requisições à API
 */
async function apiRequest(method, endpoint, data = null) {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Erro na requisição ${method} ${endpoint}:`, error.response?.data || error.message);
    throw error;
  }
}

/**
 * 1. Criar um novo par de chaves
 */
async function createKeypair() {
  console.log('📝 Criando novo par de chaves...');
  
  const keypair = await apiRequest('GET', '/contracts/utils/create-keypair');
  
  console.log('✅ Novo par de chaves criado:');
  console.log(`   Public Key: ${keypair.publicKey}`);
  console.log(`   Secret Key: ${keypair.secretKey}`);
  console.log('   ⚠️  GUARDE A SECRET KEY COM SEGURANÇA!');
  
  return keypair;
}

/**
 * 2. Verificar se uma conta existe
 */
async function checkAccount(publicKey) {
  console.log(`🔍 Verificando conta: ${publicKey}`);
  
  const accountInfo = await apiRequest('GET', `/contracts/utils/check-account/${publicKey}`);
  
  if (accountInfo.exists) {
    console.log('✅ Conta encontrada:');
    console.log(`   Account ID: ${accountInfo.accountId}`);
    console.log(`   Sequence: ${accountInfo.sequence}`);
    console.log(`   Balances:`, accountInfo.balances);
  } else {
    console.log('❌ Conta não existe na rede');
    console.log('   💡 Para testnet, crie uma conta em: https://laboratory.stellar.org/#account-creator');
  }
  
  return accountInfo;
}

/**
 * 3. Simular uma função de contrato
 */
async function simulateContract(contractId, functionName, args, publicKey) {
  console.log(`🎭 Simulando função '${functionName}' do contrato ${contractId}`);
  
  const simulationData = {
    contractId,
    functionName,
    args,
    publicKey
  };
  
  const result = await apiRequest('POST', '/contracts/simulate', simulationData);
  
  console.log('✅ Simulação concluída:');
  console.log('   Resultado:', JSON.stringify(result.simulation, null, 2));
  
  return result;
}

/**
 * 4. Invocar uma função de contrato (transação real)
 */
async function invokeContract(contractId, functionName, args, secretKey) {
  console.log(`🚀 Invocando função '${functionName}' do contrato ${contractId}`);
  console.log('   ⚠️  Esta é uma transação REAL que será submetida à rede!');
  
  const invocationData = {
    contractId,
    functionName,
    args,
    secretKey
  };
  
  const result = await apiRequest('POST', '/contracts/invoke', invocationData);
  
  console.log('✅ Função invocada com sucesso:');
  console.log(`   Transaction Hash: ${result.transactionHash}`);
  console.log('   Resultado:', JSON.stringify(result.result, null, 2));
  
  return result;
}

/**
 * 5. Obter informações de um contrato
 */
async function getContractInfo(contractId) {
  console.log(`📋 Obtendo informações do contrato: ${contractId}`);
  
  const contractInfo = await apiRequest('GET', `/contracts/${contractId}`);
  
  console.log('✅ Informações do contrato:');
  console.log('   Dados:', JSON.stringify(contractInfo.data, null, 2));
  
  return contractInfo;
}

/**
 * 6. Obter histórico de transações de um contrato
 */
async function getContractHistory(contractId, limit = 5) {
  console.log(`📈 Obtendo histórico do contrato: ${contractId}`);
  
  const history = await apiRequest('GET', `/contracts/${contractId}/history?limit=${limit}`);
  
  console.log('✅ Histórico de transações:');
  console.log(`   Total de transações encontradas: ${history.transactions.length}`);
  
  history.transactions.forEach((tx, index) => {
    console.log(`   ${index + 1}. Hash: ${tx.hash}`);
    console.log(`      Data: ${tx.created_at}`);
  });
  
  return history;
}

/**
 * Exemplo completo de uso
 */
async function main() {
  console.log('🌟 === Stellar Contract Integration Service - Exemplo de Uso ===\n');
  
  try {
    // 1. Criar novo par de chaves
    const keypair = await createKeypair();
    console.log('\n' + '='.repeat(60) + '\n');
    
    // 2. Verificar a conta (provavelmente não existirá ainda)
    await checkAccount(keypair.publicKey);
    console.log('\n' + '='.repeat(60) + '\n');
    
    // 3. Obter informações de um contrato (exemplo)
    // Descomente a linha abaixo se você tiver um contrato real para testar
    // await getContractInfo(EXAMPLE_CONTRACT_ID);
    // console.log('\n' + '='.repeat(60) + '\n');
    
    // 4. Simular uma função de contrato (exemplo)
    // Descomente as linhas abaixo se você tiver um contrato real para testar
    // await simulateContract(
    //   EXAMPLE_CONTRACT_ID,
    //   'balance',
    //   [keypair.publicKey],
    //   keypair.publicKey
    // );
    // console.log('\n' + '='.repeat(60) + '\n');
    
    console.log('✅ Exemplo concluído com sucesso!');
    console.log('\n💡 Próximos passos:');
    console.log('   1. Financie a conta criada usando o Stellar Laboratory (para testnet)');
    console.log('   2. Deploy um contrato ou use um contrato existente');
    console.log('   3. Teste as funções de simulação e invocação');
    console.log('\n📚 Documentação completa: http://localhost:3004/api');
    
  } catch (error) {
    console.error('❌ Erro durante a execução:', error.message);
  }
}

// Executar o exemplo se este arquivo for chamado diretamente
if (require.main === module) {
  main();
}

module.exports = {
  createKeypair,
  checkAccount,
  simulateContract,
  invokeContract,
  getContractInfo,
  getContractHistory,
  apiRequest
};

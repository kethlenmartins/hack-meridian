#!/usr/bin/env node

/**
 * Script de teste para verificar se o Supabase está configurado corretamente
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

async function testSupabase() {
    console.log('🧪 Testando configuração do Supabase...\n');

    // Verifica se as variáveis estão configuradas
    if (!supabaseUrl || !supabaseKey) {
        console.error('❌ Configuração incompleta!');
        console.log('Variáveis necessárias:');
        console.log('- SUPABASE_URL:', supabaseUrl ? '✅' : '❌');
        console.log('- SUPABASE_ANON_KEY:', supabaseKey ? '✅' : '❌');
        console.log('\nConfigure essas variáveis no arquivo .env');
        process.exit(1);
    }

    console.log('✅ Configuração encontrada:');
    console.log('- Supabase URL:', supabaseUrl);
    console.log('- Anon Key:', supabaseKey ? supabaseKey.substring(0, 10) + '...' : 'Não configurado');
    console.log('');

    // Cria o cliente Supabase
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Testa a conexão básica
    console.log('🔗 Testando conexão com Supabase...');
    try {
        const { data, error } = await supabase
            .from('notifications')
            .select('count')
            .limit(1);

        if (error) {
            console.error('❌ Erro ao conectar com Supabase:');
            console.error('Message:', error.message);
            console.error('Hint:', error.hint);
            
            if (error.message.includes('Invalid API key')) {
                console.log('\n💡 Solução:');
                console.log('1. Verifique se a chave SUPABASE_ANON_KEY está correta');
                console.log('2. Acesse o painel do Supabase e copie a chave correta');
                console.log('3. Atualize a variável de ambiente');
            } else if (error.message.includes('relation "notifications" does not exist')) {
                console.log('\n💡 Solução:');
                console.log('1. Execute o script SQL no Supabase para criar a tabela');
                console.log('2. Use o arquivo: supabase-notifications-schema.sql');
            }
        } else {
            console.log('✅ Conexão com Supabase verificada com sucesso!');
            console.log('Response:', data);
        }
    } catch (error) {
        console.error('❌ Erro de conexão:');
        console.error('Details:', error.message);
    }

    // Testa inserção de uma notificação de teste
    console.log('\n📧 Testando inserção de notificação...');
    try {
        const testNotification = {
            id: 'test-' + Date.now(),
            recipient_email: 'test@example.com',
            subject: 'Teste de Conexão',
            content: 'Esta é uma notificação de teste.',
            type: 'email',
            status: 'pending',
            created_at: new Date().toISOString(),
        };

        const { data, error } = await supabase
            .from('notifications')
            .insert(testNotification)
            .select();

        if (error) {
            console.error('❌ Erro ao inserir notificação:');
            console.error('Message:', error.message);
            console.error('Hint:', error.hint);
        } else {
            console.log('✅ Notificação inserida com sucesso!');
            console.log('Data:', data);
        }
    } catch (error) {
        console.error('❌ Erro na inserção:');
        console.error('Details:', error.message);
    }
}

// Executa o teste
testSupabase().catch(console.error);

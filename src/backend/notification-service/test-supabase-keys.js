#!/usr/bin/env node

/**
 * Script para testar diferentes chaves do Supabase
 */

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://wcquqbjrchhcnrspebpf.supabase.co';

// Diferentes chaves para testar
const testKeys = [
    '4a0ddbe01e58abba42d9fc89b51ce40d', // Chave atual
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndjcXVxYmpyY2hoY25yc3BlYnBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ0MzQ0MDAsImV4cCI6MjA1MDAxMDQwMH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8', // JWT exemplo
];

async function testKey(key, keyName) {
    console.log(`\n🧪 Testando chave: ${keyName}`);
    console.log(`Key: ${key.substring(0, 20)}...`);
    
    try {
        const supabase = createClient(supabaseUrl, key);
        
        const { data, error } = await supabase
            .from('notifications')
            .select('count')
            .limit(1);

        if (error) {
            console.log(`❌ Erro: ${error.message}`);
            if (error.hint) {
                console.log(`   Hint: ${error.hint}`);
            }
        } else {
            console.log(`✅ Sucesso! Data: ${JSON.stringify(data)}`);
            return true;
        }
    } catch (error) {
        console.log(`❌ Erro de conexão: ${error.message}`);
    }
    
    return false;
}

async function main() {
    console.log('🔍 Testando chaves do Supabase...');
    console.log(`URL: ${supabaseUrl}`);
    
    for (let i = 0; i < testKeys.length; i++) {
        const success = await testKey(testKeys[i], `Chave ${i + 1}`);
        if (success) {
            console.log(`\n🎉 Chave ${i + 1} funcionou! Use esta chave no .env`);
            break;
        }
    }
    
    console.log('\n💡 Se nenhuma chave funcionou:');
    console.log('1. Acesse o painel do Supabase');
    console.log('2. Vá para Settings > API');
    console.log('3. Copie a chave "anon public"');
    console.log('4. Atualize a variável SUPABASE_ANON_KEY');
}

main().catch(console.error);

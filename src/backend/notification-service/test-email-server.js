#!/usr/bin/env node

/**
 * Script de teste para verificar se o EmailJS está configurado corretamente
 * Versão para servidor Node.js usando fetch
 */

// Carrega as variáveis de ambiente
require('dotenv').config();

const publicKey = process.env.EMAILJS_PUBLIC_KEY;
const serviceId = process.env.EMAILJS_SERVICE_ID;
const templateId = process.env.EMAILJS_TEMPLATE_ID;

async function testEmailJS() {
    console.log('🧪 Testando configuração do EmailJS...\n');

    // Verifica se as variáveis estão configuradas
    if (!publicKey || !serviceId || !templateId) {
        console.error('❌ Configuração incompleta!');
        console.log('Variáveis necessárias:');
        console.log('- EMAILJS_PUBLIC_KEY:', publicKey ? '✅' : '❌');
        console.log('- EMAILJS_SERVICE_ID:', serviceId ? '✅' : '❌');
        console.log('- EMAILJS_TEMPLATE_ID:', templateId ? '✅' : '❌');
        console.log('\nConfigure essas variáveis no arquivo .env');
        process.exit(1);
    }

    console.log('✅ Configuração encontrada:');
    console.log('- Public Key:', publicKey ? publicKey.substring(0, 10) + '...' : 'Não configurado');
    console.log('- Service ID:', serviceId || 'Não configurado');
    console.log('- Template ID:', templateId || 'Não configurado');
    console.log('');

    // Dados de teste
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const templateParams = {
        to_email: testEmail,
        to_name: 'Usuário Teste',
        from_name: 'Farm Investment Platform',
        subject: 'Teste de Configuração EmailJS',
        message: 'Este é um email de teste para verificar se a configuração do EmailJS está funcionando corretamente.',
    };

    console.log('📧 Enviando email de teste para:', testEmail);

    try {
        // Usa a API REST do EmailJS diretamente
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                service_id: serviceId,
                template_id: templateId,
                user_id: publicKey,
                template_params: templateParams,
            }),
        });

        if (response.ok) {
            const result = await response.text();
            console.log('✅ Email enviado com sucesso!');
            console.log('Status:', response.status);
            console.log('Response:', result);
        } else {
            const error = await response.text();
            console.error('❌ Erro ao enviar email:');
            console.error('Status:', response.status);
            console.error('Error:', error);
        }
    } catch (error) {
        console.error('❌ Erro de conexão:');
        console.error('Details:', error.message);
    }
}

// Executa o teste
testEmailJS().catch(console.error);

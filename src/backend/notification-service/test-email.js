#!/usr/bin/env node

/**
 * Script de teste para verificar se o EmailJS está configurado corretamente
 * Execute: node test-email.js
 */

const emailjs = require('@emailjs/browser');

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

    // Inicializa o EmailJS
    emailjs.init(publicKey);

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
        const response = await emailjs.send(serviceId, templateId, templateParams);
        console.log('✅ Email enviado com sucesso!');
        console.log('Status:', response.status);
        console.log('Text:', response.text);
    } catch (error) {
        console.error('❌ Erro ao enviar email:');
        console.error('Status:', error.status);
        console.error('Text:', error.text);
        console.error('Details:', error);
    }
}

// Executa o teste
testEmailJS().catch(console.error);

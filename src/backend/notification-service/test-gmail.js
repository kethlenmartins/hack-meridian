#!/usr/bin/env node

/**
 * Script de teste para verificar se o Gmail está configurado corretamente
 */

const nodemailer = require('nodemailer');
require('dotenv').config();

const gmailUser = process.env.GMAIL_USER;
const gmailAppPassword = process.env.GMAIL_APP_PASSWORD;

async function testGmail() {
    console.log('🧪 Testando configuração do Gmail...\n');

    // Verifica se as variáveis estão configuradas
    if (!gmailUser || !gmailAppPassword) {
        console.error('❌ Configuração incompleta!');
        console.log('Variáveis necessárias:');
        console.log('- GMAIL_USER:', gmailUser ? '✅' : '❌');
        console.log('- GMAIL_APP_PASSWORD:', gmailAppPassword ? '✅' : '❌');
        console.log('\nConfigure essas variáveis no arquivo .env');
        process.exit(1);
    }

    console.log('✅ Configuração encontrada:');
    console.log('- Gmail User:', gmailUser);
    console.log('- App Password:', gmailAppPassword ? '***' + gmailAppPassword.slice(-4) : 'Não configurado');
    console.log('');

    // Cria o transporter
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmailUser,
            pass: gmailAppPassword,
        },
    });

    // Testa a conexão
    console.log('🔗 Testando conexão com Gmail...');
    try {
        await transporter.verify();
        console.log('✅ Conexão com Gmail verificada com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao verificar conexão com Gmail:');
        console.error('Details:', error.message);
        process.exit(1);
    }

    // Dados de teste
    const testEmail = process.env.TEST_EMAIL || 'test@example.com';
    const mailOptions = {
        from: `"Farm Investment Platform" <${gmailUser}>`,
        to: testEmail,
        subject: 'Teste de Configuração Gmail',
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>Teste de Configuração Gmail</title>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background-color: #2c5530; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                    .content { background-color: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1>🌱 Farm Investment Platform</h1>
                </div>
                <div class="content">
                    <h2>Olá!</h2>
                    <p>Este é um email de teste para verificar se a configuração do Gmail está funcionando corretamente.</p>
                    <p>Se você recebeu este email, a configuração está funcionando perfeitamente! 🎉</p>
                </div>
            </body>
            </html>
        `,
    };

    console.log('📧 Enviando email de teste para:', testEmail);

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('✅ Email enviado com sucesso!');
        console.log('Message ID:', info.messageId);
        console.log('Response:', info.response);
    } catch (error) {
        console.error('❌ Erro ao enviar email:');
        console.error('Details:', error.message);
    }
}

// Executa o teste
testGmail().catch(console.error);

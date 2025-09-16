require('dotenv').config({ path: '../.env' });
const axios = require('axios');

async function testEmailJS() {
    console.log('🧪 Testando EmailJS com Axios...');

    const publicKey = process.env.EMAILJS_PUBLIC_KEY;
    const serviceId = process.env.EMAILJS_SERVICE_ID;
    const templateId = process.env.EMAILJS_TEMPLATE_ID;

    console.log('📋 Configuração:');
    console.log('- Public Key:', publicKey ? '✅' : '❌');
    console.log('- Service ID:', serviceId ? '✅' : '❌');
    console.log('- Template ID:', templateId ? '✅' : '❌');

    if (!publicKey || !serviceId || !templateId) {
        console.log('\n❌ Configuração incompleta!');
        process.exit(1);
    }

    const templateParams = {
        to_email: 'mr944773@gmail.com',
        to_name: 'Matheus',
        from_name: 'Farm Investment Platform',
        subject: 'Teste de EmailJS',
        message: 'Este é um teste de notificação com EmailJS usando Axios!',
    };

    const requestData = {
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        template_params: templateParams,
    };

    console.log('\n📤 Enviando email...');
    console.log('Request Data:', JSON.stringify(requestData, null, 2));

    try {
        const response = await axios.post('https://api.emailjs.com/api/v1.0/email/send', requestData, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log('✅ Email enviado com sucesso!');
        console.log('Status:', response.status);
        console.log('Response:', response.data);
    } catch (error) {
        console.log('❌ Erro ao enviar email:');
        console.log('Status:', error.response?.status);
        console.log('Error:', error.response?.data);
        console.log('Message:', error.message);
    }
}

testEmailJS();

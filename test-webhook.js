const fetch = require('node-fetch');

async function testWebhook() {
  try {
    const response = await fetch('http://localhost:3000/api/webhooks/kirvano', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Matheus.W.843002'
      },
      body: JSON.stringify({
        event: 'PIX_GENERATED',
        data: {
          customer: {
            email: 'test-webhook@example.com'
          }
        }
      })
    });

    const text = await response.text();
    console.log('Status:', response.status);
    console.log('Response:', text);
  } catch (error) {
    console.error('Error:', error);
  }
}

testWebhook();

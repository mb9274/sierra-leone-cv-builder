const http = require('https');
const data = JSON.stringify({email:'demo@konnectsl.com',password:'KonnectSL2024!'});
const req = http.request({
  hostname: 'fra.cloud.appwrite.io',
  port: 443,
  path: '/v1/account/sessions/email',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Appwrite-Project': '6a844aa00001154d4e9a',
    'Content-Length': Buffer.byteLength(data)
  }
}, res => {
  console.log('Status:', res.statusCode);
  console.log('Set-Cookie:', JSON.stringify(res.headers['set-cookie']));
  let body = '';
  res.on('data', c => body += c);
  res.on('end', () => {
    try {
      const j = JSON.parse(body);
      console.log('Body secret:', JSON.stringify(j.secret));
      console.log('Body $id:', j.$id);
    } catch(e) {
      console.log('Body:', body.substring(0, 500));
    }
  });
});
req.write(data);
req.end();

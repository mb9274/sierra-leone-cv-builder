const { Client, Account } = require('node-appwrite');

async function main() {
  const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6a844aa00001154d4e9a');

  const account = new Account(client);
  const session = await account.createEmailPasswordSession('demo@konnectsl.com', 'KonnectSL2024!');
  console.log('Session keys:', Object.keys(session));
  console.log('Session $id:', session.$id);
  console.log('Session secret:', JSON.stringify(session.secret));
  console.log('Session userId:', session.userId);
  console.log('Full session:', JSON.stringify(session, null, 2));
}
main().catch(e => console.error('ERROR:', e.message));

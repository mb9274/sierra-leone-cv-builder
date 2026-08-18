const { Client, Databases, ID, Permission, Role } = require('node-appwrite');

async function main() {
  const client = new Client()
    .setEndpoint('https://fra.cloud.appwrite.io/v1')
    .setProject('6a844aa00001154d4e9a')
    .setKey('standard_fd6bd7f254ab0283dd84a01bf1c5189ca1139c9c3ab9816c4bb0df535bfca54b6808b4a30e71e31889975120388c433d44ea9c6aa79e1d66e5e1c197f2f15436c259aac7b6c1f898c3277b307545f2ca66a266e56b918eb5230f6e3febc2f3e4bc62320d1854db60b0706efca243b479238be6f81308ca945f436c9a1b0f2aba');

  const databases = new Databases(client);
  const dbId = 'cvs-db';
  const colId = 'cvs';

  try {
    const db = await databases.create(dbId, 'CV Database');
    console.log('Database created:', db.$id);
  } catch (e) {
    console.log('Database:', e.message || 'may already exist');
  }

  try {
    const col = await databases.createCollection(
      dbId,
      colId,
      'CVs',
      [
        Permission.read(Role.any()),
        Permission.create(Role.users()),
        Permission.update(Role.users()),
        Permission.delete(Role.users()),
      ]
    );
    console.log('Collection created:', col.$id);
  } catch (e) {
    console.log('Collection:', e.message || 'may already exist');
  }

  try {
    await databases.createStringAttribute(dbId, colId, 'user_id', 255, true);
    console.log('Attribute user_id created');
  } catch (e) {
    console.log('Attribute user_id:', e.message || 'may already exist');
  }

  try {
    await databases.createStringAttribute(dbId, colId, 'data', 65535, true);
    console.log('Attribute data created');
  } catch (e) {
    console.log('Attribute data:', e.message || 'may already exist');
  }

  try {
    await databases.createIndex(dbId, colId, 'user_id_idx', 'key', ['user_id']);
    console.log('Index user_id_idx created');
  } catch (e) {
    console.log('Index:', e.message || 'may already exist');
  }

  console.log('Done!');
}
main().catch(console.error);

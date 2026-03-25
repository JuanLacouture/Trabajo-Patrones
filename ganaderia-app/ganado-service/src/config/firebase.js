const admin = require('firebase-admin');

if (!admin.apps.length) {
  const serviceAccount = require('../../serviceAccountKey.json');
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const db = admin.firestore();

// Si estamos en test, apuntar al emulador
if (process.env.FIRESTORE_EMULATOR_HOST) {
  db.settings({
    host: process.env.FIRESTORE_EMULATOR_HOST,
    ssl: false,
  });
}

module.exports = db;

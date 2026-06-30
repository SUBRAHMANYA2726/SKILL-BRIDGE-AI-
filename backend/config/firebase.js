const admin = require('firebase-admin');
const fs = require('fs');

try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    // 1. Cloud Deployment Method: Read from raw JSON string (Render/Vercel)
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized successfully (via JSON Env Var).');
  } else if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH && fs.existsSync(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH)) {
    // 2. Local Method: Read from local JSON file
    const serviceAccount = require(`../${process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH}`);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized successfully (via local file path).');
  } else {
    console.warn('Firebase service account key not found. Authentication will fail until configured.');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
}

module.exports = admin;

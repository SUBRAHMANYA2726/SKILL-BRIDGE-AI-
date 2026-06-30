const admin = require('firebase-admin');
const fs = require('fs');

try {
  if (fs.existsSync(process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH)) {
    const serviceAccount = require(`../${process.env.FIREBASE_SERVICE_ACCOUNT_KEY_PATH}`);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } else {
    console.warn('Firebase service account key not found. Authentication will fail until configured.');
  }
} catch (error) {
  console.error('Error initializing Firebase Admin SDK:', error);
}

module.exports = admin;

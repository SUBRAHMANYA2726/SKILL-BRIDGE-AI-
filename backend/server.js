require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('./config/firebase');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Basic Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'SkillBridge AI backend is running (Firebase Mode)' });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));

// Firebase Admin Seeder
const seedAdmin = async () => {
  try {
    const adminEmail = 'fullhakondd@gmail.com';
    const adminPassword = 'fullai123';
    
    // Check if user exists in Firebase Auth
    let userRecord;
    try {
      userRecord = await admin.auth().getUserByEmail(adminEmail);
    } catch (e) {
      if (e.code === 'auth/user-not-found') {
        userRecord = await admin.auth().createUser({
          email: adminEmail,
          password: adminPassword,
          displayName: 'Super Admin'
        });
        console.log('Firebase Auth Admin user created successfully.');
      } else {
        throw e;
      }
    }

    // Check if user exists in Firestore
    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(userRecord.uid).get();
    
    if (!userDoc.exists) {
      await db.collection('users').doc(userRecord.uid).set({
        fullName: 'Super Admin',
        email: adminEmail,
        phone: '0000000000',
        role: 'admin',
        status: 'active',
        createdAt: new Date().toISOString()
      });
      console.log('Firestore Admin document created successfully.');
    }
  } catch (error) {
    console.error('Error seeding admin user via Firebase:', error);
  }
};

// Start Server & Seed
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  seedAdmin();
});

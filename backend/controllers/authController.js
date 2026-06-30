const admin = require('../config/firebase');

// @desc    Register a new user (Create Firestore Profile after Firebase Client Auth)
// @route   POST /api/auth/register
// @access  Public (But requires Firebase ID Token passed as Bearer)
const registerUser = async (req, res) => {
  try {
    const { fullName, email, phone } = req.body;
    
    // We expect the frontend to pass the Firebase Token so we know which UID they just registered
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No Firebase token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const db = admin.firestore();
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      return res.status(400).json({ message: 'User profile already exists' });
    }

    const userData = {
      fullName,
      email,
      phone,
      role: 'user',
      status: 'active',
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString()
    };

    await userRef.set(userData);

    res.status(201).json({ _id: uid, ...userData, token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error registering user profile' });
  }
};

// @desc    Authenticate a user (Update Last Login after Firebase Client Auth)
// @route   POST /api/auth/login
// @access  Public (But requires Firebase ID Token)
const loginUser = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No Firebase token provided' });
    }
    
    const token = authHeader.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const db = admin.firestore();
    const userRef = db.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User profile not found. Please register.' });
    }

    if (userDoc.data().status === 'blocked') {
      return res.status(403).json({ message: 'Your account has been blocked by an administrator.' });
    }

    // Update last login
    await userRef.update({ lastLogin: new Date().toISOString() });

    res.json({ _id: uid, ...userDoc.data(), token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error logging in' });
  }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  res.json(req.user);
};

// @desc    Logout user (client handles Firebase logout)
// @route   POST /api/auth/logout
// @access  Private
const logoutUser = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

module.exports = {
  registerUser,
  loginUser,
  getProfile,
  logoutUser
};

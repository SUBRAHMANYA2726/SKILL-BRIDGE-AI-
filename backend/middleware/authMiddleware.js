const admin = require('../config/firebase');

const protect = async (req, res, next) => {
  let token;
  
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      
      const decodedToken = await admin.auth().verifyIdToken(token);
      
      const db = admin.firestore();
      const userDoc = await db.collection('users').doc(decodedToken.uid).get();
      
      if (!userDoc.exists) {
        return res.status(401).json({ message: 'Not authorized, user profile not found in database' });
      }

      req.user = { uid: decodedToken.uid, ...userDoc.data() };

      if (req.user.status === 'blocked') {
        return res.status(403).json({ message: 'Your account has been blocked by an administrator.' });
      }
      
      next();
    } catch (error) {
      console.error('Firebase token verification error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, admin: isAdmin };

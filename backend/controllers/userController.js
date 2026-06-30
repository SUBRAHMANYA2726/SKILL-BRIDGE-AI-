const admin = require('../config/firebase');

// @desc    Toggle Bookmark (Opportunity or Resource)
// @route   POST /api/users/bookmarks
// @access  Private
const toggleBookmark = async (req, res) => {
  try {
    const { itemId, type } = req.body; // type: 'opportunity' or 'resource'
    const uid = req.user.uid;
    const db = admin.firestore();
    const userRef = db.collection('users').doc(uid);
    
    const userDoc = await userRef.get();
    if (!userDoc.exists) return res.status(404).json({ message: 'User not found' });
    
    const userData = userDoc.data();
    const fieldName = type === 'opportunity' ? 'savedOpportunities' : 'savedResources';
    let savedList = userData[fieldName] || [];

    if (savedList.includes(itemId)) {
      savedList = savedList.filter(id => id !== itemId);
    } else {
      savedList.push(itemId);
    }

    await userRef.update({ [fieldName]: savedList });
    res.json({ message: 'Bookmark updated', [fieldName]: savedList });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating bookmark' });
  }
};

// @desc    Get user profile (including skills & bookmarks)
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = async (req, res) => {
  try {
    const uid = req.user.uid;
    const db = admin.firestore();
    const userDoc = await db.collection('users').doc(uid).get();
    
    if (!userDoc.exists) return res.status(404).json({ message: 'User not found' });
    
    res.json(userDoc.data());
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

// @desc    Get recommended opportunities
// @route   GET /api/users/recommendations
// @access  Private
const getRecommendations = async (req, res) => {
  try {
    const uid = req.user.uid;
    const db = admin.firestore();
    
    // 1. Get user skills
    const userDoc = await db.collection('users').doc(uid).get();
    const userSkills = userDoc.data()?.skills || ['React', 'JavaScript']; // Default fallback for demo
    
    // 2. Fetch all ops (in a real prod app, you'd use a search engine like Algolia or Meilisearch)
    const opsSnapshot = await db.collection('opportunities').get();
    let recommended = [];
    
    opsSnapshot.forEach(doc => {
      const op = { _id: doc.id, ...doc.data() };
      // Match if any skill overlaps
      if (op.skills && op.skills.some(skill => userSkills.includes(skill))) {
        recommended.push(op);
      }
    });

    res.json(recommended);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching recommendations' });
  }
};

// @desc    Get Notifications
// @route   GET /api/users/notifications
// @access  Private
const getNotifications = async (req, res) => {
  try {
    // Generate some dynamic notifications based on system state
    // In production, this would be a separate 'notifications' collection triggered by cloud functions.
    const notifications = [
      { id: 1, title: 'New Amazon Internship posted!', time: '1 hour ago', read: false },
      { id: 2, title: 'Your Google application deadline is in 2 days.', time: '5 hours ago', read: false },
      { id: 3, title: 'Welcome to SkillBridge AI!', time: '1 day ago', read: true },
    ];
    res.json(notifications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching notifications' });
  }
};

module.exports = {
  toggleBookmark,
  getUserProfile,
  getRecommendations,
  getNotifications
};

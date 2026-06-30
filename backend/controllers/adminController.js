const admin = require('../config/firebase');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
  try {
    const db = admin.firestore();
    const usersSnapshot = await db.collection('users').orderBy('createdAt', 'desc').get();
    
    let users = [];
    usersSnapshot.forEach(doc => {
      users.push({ _id: doc.id, ...doc.data() });
    });

    // Basic client-side filtering for keyword since Firestore lacks native full-text search easily
    const keyword = req.query.keyword ? req.query.keyword.toLowerCase() : '';
    if (keyword) {
      users = users.filter(u => 
        (u.fullName && u.fullName.toLowerCase().includes(keyword)) || 
        (u.email && u.email.toLowerCase().includes(keyword))
      );
    }

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching users from Firestore' });
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
  try {
    const db = admin.firestore();
    const userRef = db.collection('users').doc(req.params.id);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      if (userDoc.data().role === 'admin') {
        return res.status(400).json({ message: 'Cannot delete admin user' });
      }
      
      // Delete from Firestore
      await userRef.delete();
      
      // Delete from Firebase Auth
      try {
        await admin.auth().deleteUser(req.params.id);
      } catch (authErr) {
        console.warn('User not found in Firebase Auth during deletion:', authErr);
      }
      
      res.json({ message: 'User removed successfully' });
    } else {
      res.status(404).json({ message: 'User not found in Firestore' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting user' });
  }
};

// @desc    Block or Unblock user
// @route   PUT /api/admin/users/:id/block
// @access  Private/Admin
const toggleBlockUser = async (req, res) => {
  try {
    const db = admin.firestore();
    const userRef = db.collection('users').doc(req.params.id);
    const userDoc = await userRef.get();

    if (userDoc.exists) {
      if (userDoc.data().role === 'admin') {
        return res.status(400).json({ message: 'Cannot block admin user' });
      }
      
      const newStatus = userDoc.data().status === 'active' ? 'blocked' : 'active';
      await userRef.update({ status: newStatus });
      
      // Disable the user in Firebase Auth so they can't login at all
      try {
        await admin.auth().updateUser(req.params.id, { disabled: newStatus === 'blocked' });
      } catch(e) {
        console.warn('Failed to disable user in Auth:', e);
      }

      res.json({ message: `User ${newStatus} successfully` });
    } else {
      res.status(404).json({ message: 'User not found in Firestore' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating user status' });
  }
};

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getStats = async (req, res) => {
  try {
    const db = admin.firestore();
    const usersSnapshot = await db.collection('users').where('role', '==', 'user').get();
    
    let totalUsers = 0;
    let activeUsers = 0;
    let blockedUsers = 0;
    let recentRegistrations = 0;
    
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    usersSnapshot.forEach(doc => {
      totalUsers++;
      const data = doc.data();
      if (data.status === 'active') activeUsers++;
      if (data.status === 'blocked') blockedUsers++;
      if (new Date(data.createdAt) >= sevenDaysAgo) recentRegistrations++;
    });

    res.json({
      totalUsers,
      activeUsers,
      blockedUsers,
      recentRegistrations
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching stats from Firestore' });
  }
};

module.exports = {
  getUsers,
  deleteUser,
  toggleBlockUser,
  getStats
};

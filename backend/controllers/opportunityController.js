const admin = require('../config/firebase');

// @desc    Get all opportunities (with optional keyword/domain filtering)
// @route   GET /api/opportunities
// @access  Private (Logged in users)
const getOpportunities = async (req, res) => {
  try {
    const db = admin.firestore();
    const opsSnapshot = await db.collection('opportunities').orderBy('createdAt', 'desc').get();
    
    let ops = [];
    opsSnapshot.forEach(doc => {
      ops.push({ _id: doc.id, ...doc.data() });
    });

    // Client-side style filtering since Firestore limits complex multi-field filtering
    const keyword = req.query.keyword ? req.query.keyword.toLowerCase() : '';
    if (keyword) {
      ops = ops.filter(o => 
        (o.title && o.title.toLowerCase().includes(keyword)) || 
        (o.company && o.company.toLowerCase().includes(keyword)) ||
        (o.skills && o.skills.some(s => s.toLowerCase().includes(keyword)))
      );
    }

    res.json(ops);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching opportunities' });
  }
};

// @desc    Create a new opportunity
// @route   POST /api/opportunities
// @access  Private/Admin
const createOpportunity = async (req, res) => {
  try {
    const db = admin.firestore();
    const opData = {
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('opportunities').add(opData);
    res.status(201).json({ _id: docRef.id, ...opData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating opportunity' });
  }
};

// @desc    Delete an opportunity
// @route   DELETE /api/opportunities/:id
// @access  Private/Admin
const deleteOpportunity = async (req, res) => {
  try {
    const db = admin.firestore();
    await db.collection('opportunities').doc(req.params.id).delete();
    res.json({ message: 'Opportunity deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting opportunity' });
  }
};

module.exports = {
  getOpportunities,
  createOpportunity,
  deleteOpportunity
};

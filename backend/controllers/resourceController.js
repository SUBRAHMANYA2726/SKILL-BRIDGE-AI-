const admin = require('../config/firebase');

// @desc    Get all resources (grouped by domain or filtered)
// @route   GET /api/resources
// @access  Private
const getResources = async (req, res) => {
  try {
    const db = admin.firestore();
    const querySnapshot = await db.collection('resources').get();
    
    let resources = [];
    querySnapshot.forEach(doc => {
      resources.push({ _id: doc.id, ...doc.data() });
    });

    const domain = req.query.domain;
    if (domain) {
      resources = resources.filter(r => r.domain === domain);
    }

    res.json(resources);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching resources' });
  }
};

// @desc    Create a new learning resource
// @route   POST /api/resources
// @access  Private/Admin
const createResource = async (req, res) => {
  try {
    const db = admin.firestore();
    const resData = {
      ...req.body,
      createdAt: new Date().toISOString()
    };
    
    const docRef = await db.collection('resources').add(resData);
    res.status(201).json({ _id: docRef.id, ...resData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating resource' });
  }
};

// @desc    Delete a resource
// @route   DELETE /api/resources/:id
// @access  Private/Admin
const deleteResource = async (req, res) => {
  try {
    const db = admin.firestore();
    await db.collection('resources').doc(req.params.id).delete();
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error deleting resource' });
  }
};

module.exports = {
  getResources,
  createResource,
  deleteResource
};

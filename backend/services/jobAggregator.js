const admin = require('../config/firebase');

const syncLiveJobs = async () => {
  try {
    const db = admin.firestore();
    console.log('Fetching live jobs from public APIs...');

    const newJobs = [];

    // 1. Fetch from Arbeitnow (Free API, Real Companies)
    try {
      const arbeitnowRes = await fetch('https://www.arbeitnow.com/api/job-board-api');
      if (arbeitnowRes.ok) {
        const data = await arbeitnowRes.json();
        const jobs = data.data.slice(0, 15); // limit to 15 to avoid spam
        jobs.forEach(job => {
          newJobs.push({
            title: job.title,
            company: job.company_name,
            location: job.location,
            stipend: job.salary || 'Not disclosed',
            category: 'Full-time Jobs', // default assumption from this board
            skills: job.tags || ['Tech'],
            description: 'Apply via official portal. ' + (job.description ? job.description.substring(0, 150) + '...' : ''),
            link: job.url,
            applyLink: job.url,
            expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
            source: 'Arbeitnow',
            createdAt: new Date().toISOString()
          });
        });
      }
    } catch (err) {
      console.error('Arbeitnow API error:', err.message);
    }

    // 2. Fetch from Remotive (Free Remote Tech Jobs API)
    try {
      const remotiveRes = await fetch('https://remotive.com/api/remote-jobs?category=software-dev&limit=15');
      if (remotiveRes.ok) {
        const data = await remotiveRes.json();
        const jobs = data.jobs.slice(0, 15);
        jobs.forEach(job => {
          newJobs.push({
            title: job.title,
            company: job.company_name,
            location: 'Remote',
            stipend: job.salary || 'Competitive',
            category: job.job_type.includes('contract') ? 'Internships' : 'Full-time Jobs',
            skills: job.tags || ['Software Development'],
            description: 'Apply via official portal.',
            link: job.url,
            applyLink: job.url,
            expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            source: 'Remotive',
            createdAt: new Date().toISOString()
          });
        });
      }
    } catch (err) {
      console.error('Remotive API error:', err.message);
    }

    // 3. Clear existing old jobs (optional: right now we'll just wipe old aggregated jobs to prevent duplicates)
    const existingAggregated = await db.collection('opportunities')
      .where('source', 'in', ['Arbeitnow', 'Remotive'])
      .get();
      
    const batch = db.batch();
    existingAggregated.forEach(doc => {
      batch.delete(doc.ref);
    });
    
    // Commit deletes
    await batch.commit();

    // 4. Add new live jobs
    const addBatch = db.batch();
    newJobs.forEach(job => {
      const newRef = db.collection('opportunities').doc();
      addBatch.set(newRef, job);
    });

    await addBatch.commit();
    console.log(`Successfully synced ${newJobs.length} live jobs to Firestore!`);
    
    return { success: true, count: newJobs.length };
  } catch (error) {
    console.error('Error syncing live jobs:', error);
    return { success: false, error: error.message };
  }
};

const cleanupExpiredJobs = async () => {
  try {
    const db = admin.firestore();
    const now = new Date().toISOString();
    
    const snapshot = await db.collection('opportunities')
      .where('expirationDate', '<', now)
      .get();

    if (snapshot.empty) {
      return { success: true, count: 0 };
    }

    const batch = db.batch();
    snapshot.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log(`Cleaned up ${snapshot.size} expired jobs.`);
    return { success: true, count: snapshot.size };
  } catch (error) {
    console.error('Error cleaning up expired jobs:', error);
    return { success: false, error: error.message };
  }
};

module.exports = { syncLiveJobs, cleanupExpiredJobs };

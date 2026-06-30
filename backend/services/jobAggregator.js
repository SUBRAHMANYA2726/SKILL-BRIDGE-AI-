const admin = require('../config/firebase');

const syncLiveJobs = async () => {
  try {
    const db = admin.firestore();
    console.log('Fetching live jobs strictly from official APIs and verified boards...');

    const newJobs = [];

    // 1. Fetch from Greenhouse API (Example: Stripe, Figma)
    const greenhouseBoards = ['stripe', 'figma'];
    for (const board of greenhouseBoards) {
      try {
        const ghRes = await fetch(`https://boards-api.greenhouse.io/v1/boards/${board}/jobs`);
        if (ghRes.ok) {
          const data = await ghRes.json();
          const jobs = data.jobs.slice(0, 5); // Take 5 recent
          jobs.forEach(job => {
            newJobs.push({
              title: job.title,
              company: board.charAt(0).toUpperCase() + board.slice(1),
              location: job.location.name || 'Remote',
              stipend: 'Not disclosed (Official ATS)',
              category: job.title.toLowerCase().includes('intern') ? 'Internships' : 'Full-time Jobs',
              skills: ['Tech'],
              description: 'Official Greenhouse ATS Listing. Apply directly on the company portal.',
              link: job.absolute_url,
              applyLink: job.absolute_url,
              expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              source: 'Greenhouse API',
              verified: true, // Official Company Portal
              createdAt: job.updated_at || new Date().toISOString()
            });
          });
        }
      } catch (err) {
        console.error(`Greenhouse API error for ${board}:`, err.message);
      }
    }

    // 2. Fetch from Lever API (Example: Netflix, Coursera)
    const leverBoards = ['netflix', 'coursera'];
    for (const board of leverBoards) {
      try {
        const lvRes = await fetch(`https://api.lever.co/v0/postings/${board}?mode=json`);
        if (lvRes.ok) {
          const data = await lvRes.json();
          const jobs = data.slice(0, 5); // Take 5 recent
          jobs.forEach(job => {
            newJobs.push({
              title: job.text,
              company: board.charAt(0).toUpperCase() + board.slice(1),
              location: job.categories.location || 'Remote',
              stipend: 'Not disclosed (Official ATS)',
              category: job.text.toLowerCase().includes('intern') ? 'Internships' : 'Full-time Jobs',
              skills: job.categories.team ? [job.categories.team] : ['Tech'],
              description: job.descriptionPlain ? job.descriptionPlain.substring(0, 150) + '...' : 'Official Lever ATS Listing.',
              link: job.hostedUrl,
              applyLink: job.applyUrl || job.hostedUrl,
              expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
              source: 'Lever API',
              verified: true, // Official Company Portal
              createdAt: new Date(job.createdAt).toISOString()
            });
          });
        }
      } catch (err) {
        console.error(`Lever API error for ${board}:`, err.message);
      }
    }

    // 3. Fetch from RemoteOK API (Public Tech Job Board)
    try {
      const roRes = await fetch('https://remoteok.com/api');
      if (roRes.ok) {
        const data = await roRes.json();
        const jobs = data.slice(1, 10); // Skip first element (it's API info)
        jobs.forEach(job => {
          newJobs.push({
            title: job.position,
            company: job.company,
            location: 'Remote Worldwide',
            stipend: job.salary_min && job.salary_max ? `$${job.salary_min} - $${job.salary_max}/yr` : 'Not disclosed',
            category: 'Full-time Jobs',
            skills: job.tags || ['Software'],
            description: 'Apply via official RemoteOK listing.',
            link: job.url,
            applyLink: job.url,
            expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
            source: 'RemoteOK',
            verified: false, // External aggregator
            createdAt: new Date(job.date).toISOString()
          });
        });
      }
    } catch (err) {
      console.error('RemoteOK API error:', err.message);
    }

    // Completely clear all old jobs to ensure NO mock data remains
    const allExisting = await db.collection('opportunities').get();
    const deleteBatch = db.batch();
    allExisting.forEach(doc => {
      deleteBatch.delete(doc.ref);
    });
    await deleteBatch.commit();

    // Add new live jobs
    const addBatch = db.batch();
    newJobs.forEach(job => {
      const newRef = db.collection('opportunities').doc();
      addBatch.set(newRef, job);
    });

    await addBatch.commit();
    console.log(`Successfully synced ${newJobs.length} real live jobs to Firestore! Mock data wiped.`);
    
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

const { syncLiveJobs } = require('./backend/services/jobAggregator');

const runSync = async () => {
  console.log('Forcing immediate sync...');
  const result = await syncLiveJobs();
  console.log(result);
  process.exit(0);
};

runSync();

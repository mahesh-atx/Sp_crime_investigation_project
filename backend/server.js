require('dotenv').config();
const app = require('./src/app');
const connectDB = require('./src/config/db');
const startAlertJob = require('./src/jobs/dailyAlertJob');

const PORT = process.env.PORT || 5000;

// Connect to database and start server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Crime Dashboard API ready`);
    
    // Start automated alerts
    startAlertJob();
  });
});

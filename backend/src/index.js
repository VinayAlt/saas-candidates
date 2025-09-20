const express = require('express');
const bodyParser = require('body-parser');
const candidateRoutes = require('./routes/candidates');
const authRoutes = require('./routes/auth');

const app = express();
app.use(bodyParser.json());

// Routes
app.use('/auth', authRoutes);
app.use('/candidates', candidateRoutes);

// Health check (for Kubernetes probes)
app.get('/healthz', (req, res) => res.send('OK'));

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
  console.log(`AWS Region: ${process.env.AWS_REGION}`);
});

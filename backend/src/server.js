require('dotenv').config();
const envTekshr = require('./envTekshir');
const app = require('./app');

const PORT = process.env.PORT || 3000;
console.log(envTekshr(['PORT', 'DATABASE_URL']));

app.listen(PORT, () => {
  console.log(`Server ${PORT}-portda ishlamoqda: http://localhost:${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});
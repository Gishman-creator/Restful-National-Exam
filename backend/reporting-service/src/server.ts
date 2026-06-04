import app from './app';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 3004;

app.listen(Number(PORT), '0.0.0.0', () => {
  console.log(`Reporting Service is running on port ${PORT}`);
});

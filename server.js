const express = require('express');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
app.use(helmet()); // Security headers (OWASP)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Label instance (app1/app2) supaya log Nginx bisa menunjukkan siapa yang melayani request.
app.use((req, res, next) => {
  res.set('X-Served-By', process.env.INSTANCE || 'app');
  next();
});

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.use(require('./routes/reservations'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`App on port ${PORT}`));

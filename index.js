const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const router = require('./router');

mongoose.connect('mongodb://localhost/auth');

const app = express();
const PORT = process.env.PORT || 8080;

app.use(morgan('combined'));
app.use(bodyParser.json({ type: '*/*' }));
router(app);

app.listen(PORT, () => {
  console.log(`server listening on: ${PORT}`);
});

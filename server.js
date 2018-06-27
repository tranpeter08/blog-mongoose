const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const router = express.Router();

const blogPostRouter = require('./blogPostRouter')

const app = express();

app.use(morgan('common'));

app.use('/blog',blogPostRouter);

app.listen(process.env.PORT || 8080, () => {
    console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
  });
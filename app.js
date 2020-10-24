const result = require('dotenv').config();
const Express = require('express');
const BodyParser = require('body-parser');
const CookieParser = require('cookie-parser');
const rateLimiter = require('./middleware/rateLimiter');
const indexRouter = require('./route/index');
const apiRouter = require('./route/api');

if (result.error) throw result.error;

const app = Express();
app.use(BodyParser.urlencoded({ extended: true }));
app.use(BodyParser.json());
app.use(CookieParser());

app.use('/', indexRouter);
app.use('/api', rateLimiter); // limit only /api/* url
app.use('/api', apiRouter);

// Capture All 404 errors
app.use((req, res) => {
  res.status(404).send('Unable to find the requested resource!');
});

app.listen(process.env.PORT || 3000);

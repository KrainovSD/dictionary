import * as dotenv from 'dotenv';
dotenv.config({ path: 'config.env' });
import express from 'express';
const app = express();
app.use(express.json()); // req.body only for application/json
//app.use(express.urlencoded({extended: true})); // req.body only for application/x-www-form-urlencoded
import cookieParser from 'cookie-parser';
app.use(cookieParser()); // req.cookies

import mongoose from 'mongoose';
mongoose
  .connect(`mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}`)
  .then(() => console.log('server has connected to MongoDB'))
  .catch((err) => {
    console.log(err);
    logger(err, 'BD connect');
  });
mongoose.connection.on('disconnected', () => {
  console.log('BD disconnected');
});
mongoose.connection.on('recconect', () => {
  console.log('DB recconect');
});
mongoose.connection.on('close', () => {
  console.log('DB close connect');
});
const port = process.env.PORT || 3000;
const host = process.env.HOST;
app.listen(port, host, (err) => {
  if (err) {
    console.log(err);
    logger(err, 'start server');
  }
  console.log(`Server has started on port ${port} and host ${host}`);
});

const PRODUCTION = process.env.PRODUCTION == 'true' ? true : false;
if (!PRODUCTION) {
  app.use((request, response, next) => {
    //res.set('Access-Control-Allow-Credentials', 'true') - разрешение на куки
    response.header({
      'Access-Control-Allow-Origin': 'http://127.0.0.1:8080',
      'Access-Control-Allow-Methods': 'DELETE,GET,POST,PUT',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
      'Access-Control-Allow-Credentials': 'true',
    });
    next();
  });
}

import untils from './untils/index.js';
import routes from './routes/index.js';
import logger from './logger.js';
app.use(untils.reqLogger);
app.use('/auth', routes.auth);
app.use('/user', routes.user);
app.use('/words', routes.words);

process.on('uncaughtException', (err) => {
  console.log(err);
  logger(err, 'uncaughtException');
  process.exit(1);
}); // some logging mechanisam // .... process.exit(1); // terminates process });

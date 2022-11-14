import config from './config.js';
import express from 'express';
const app = express();
app.use(express.json()); // req.body only for application/json
//app.use(express.urlencoded({extended: true})); // req.body only for application/x-www-form-urlencoded
import cookieParser from 'cookie-parser';
app.use(cookieParser()); // req.cookies

import mongoManager from 'mongodb-topology-manager';
const server = new mongoManager.Server('mongod', {
  dbpath: `mongodb://localhost:27017`,
  port: 27017,
});
server.start();
import mongoose from 'mongoose';
mongoose
  .connect(`mongodb://${config.server.dbHost}/${config.server.dbName}`)
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
server.stop();

app.listen(config.server.port, config.server.host, (err) => {
  if (err) {
    console.log(err);
    logger(err, 'start server');
  }
  console.log(
    `Server has started on port ${config.server.port} and host ${config.server.host}`
  );
});
/* ONLY FOR DEV!!!!!!!!!!! */
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

/*const routes = require('./routes/index.js');
app.use('/', routes.auth);*/

import { UserController } from './controllers/index.js';
import { loginValidation, registerValidation } from './validations.js';
import {
  handleValidationErrors,
  checkAuth,
  reqLogger,
} from './untils/index.js';
import logger from './logger.js';
app.use(reqLogger);

app.post(
  '/register',
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.get('/confirm', UserController.confirm);
app.post(
  '/login',
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post('/logout', UserController.logout);
app.put('/tokens', UserController.updateAccessToken);

app.post('/checkAuth', checkAuth, (req, res) => {
  res.json(req.userId);
});

process.on('uncaughtException', (err) => {
  console.log(err);
  logger(err, 'uncaughtException');
  //res.status(500).json({message: err});
  process.exit(1);
}); // some logging mechanisam // .... process.exit(1); // terminates process });

/*GET — получение ресурса
POST — создание ресурса
PUT — обновление ресурса
DELETE — удаление ресурса */

/*
users: {
iserid: string,
userName: string,
nickName: string,
email: string,
hash: string,
salt: string,
role: string,
registration: string,
avatar: src, 
token: string, 
statistics:{
    startLearning: string,
    lastLearning: string,
    bestStreak: string,
}
en:{
    here all below
}
knownWorlds: {
    word:{
        translate: string,
        transcript: string,
        image: string,
        description: string,
        example: [of string],
        lastRepeat: string,
        lastReverseRepeat: string,
        dateOfCreation: string
    }
}
categories: {
    nameCategory: {
        regularityToRepeat:[of string],
        deleteAfterLearning: boolean,
        nextRepeat: string,
        lastRepeat: string,?
        storyRepeat:[of string]

    }
}
wordsOfCategories:{
    word:{
        translate: string,
        transcript: string,
        image: string,
        description: string,
        example: [of string],
        categories: [of string],
        dateOfCreation: string,
    }
}
repeatWords: {
    words:{
        word:{
            translate: string,
            transcript: string,
            image: string,
            description: string,
            example: [of string],
            nextRepeat: string,
            lastRepeat: string,?
            storyRepeat:[of string]

        }
    }
    options: {
        automaticallyAddToRepeat: boolean,
        regularityToRepeat: [of string]
        }
    }
}


*/

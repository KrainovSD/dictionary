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

import { UserController, WordController } from './controllers/index.js';
import {
  registerValidation,
  loginValidation,
  confirmValidation,
  forgotPasswordValidation,
  newPasswordValidation,
  infoValidation,
  newEmailValidation,
  userInfoValidation,
  categoryValidation,
  wordValidation,
  relevanceValidation,
  messageValidation,
  answerValidation,
} from './validations.js';
import {
  handleValidationErrors,
  checkAuth,
  reqLogger,
  upload,
} from './untils/index.js';
import logger from './logger.js';
app.use(reqLogger);
/* AUTH */
app.post(
  '/register',
  registerValidation,
  handleValidationErrors,
  UserController.register
);
app.post(
  '/confirm',
  confirmValidation,
  handleValidationErrors,
  UserController.confirm
);
app.post(
  '/login',
  loginValidation,
  handleValidationErrors,
  UserController.login
);
app.post('/logout', checkAuth, UserController.logout);
app.post('/tokens', UserController.updateAccessToken);
/* USER INFO  */
app.post(
  '/forgot',
  forgotPasswordValidation,
  handleValidationErrors,
  UserController.forgotPassword
);
app.post(
  '/password',
  newPasswordValidation,
  handleValidationErrors,
  UserController.newPassword
);
app.post(
  '/email',
  checkAuth,
  newEmailValidation,
  handleValidationErrors,
  UserController.changeEmail
);
app.post(
  '/info',
  checkAuth,
  infoValidation,
  handleValidationErrors,
  UserController.changeInfo
);
app.post(
  '/avatar',
  checkAuth,
  upload.single('avatar'),
  UserController.changeAvatar
);

app.post('/export', checkAuth, UserController.exportUserData);
app.post(
  '/import',
  checkAuth,
  userInfoValidation,
  handleValidationErrors,
  UserController.importUserData
);
app.post(
  '/syncInfo',
  checkAuth,
  userInfoValidation,
  handleValidationErrors,
  UserController.syncInfo
);
/* MESSAGE */
app.post(
  '/message',
  checkAuth,
  messageValidation,
  handleValidationErrors,
  UserController.message
);
/* WORDS */
app.post(
  '/category',
  checkAuth,
  categoryValidation,
  handleValidationErrors,
  WordController.addCategory
);
app.put(
  '/category',
  checkAuth,
  categoryValidation,
  handleValidationErrors,
  WordController.updateCategory
);
app.delete('/category/:id', checkAuth, WordController.deleteCategory);
app.post(
  '/word',
  checkAuth,
  wordValidation,
  handleValidationErrors,
  WordController.addWord
);
app.put(
  '/word',
  checkAuth,
  wordValidation,
  handleValidationErrors,
  WordController.updateWord
);
app.delete('/word/:id', checkAuth, WordController.deleteWord);
app.post('/startLearnCategory', checkAuth, WordController.startLearnCategory);
app.post(
  '/relevance',
  checkAuth,
  relevanceValidation,
  handleValidationErrors,
  WordController.addRelevance
);
app.post(
  '/learnAnswer',
  checkAuth,
  answerValidation,
  handleValidationErrors,
  WordController.learnAnswer
);
app.post(
  '/reLearnAnswer',
  checkAuth,
  answerValidation,
  handleValidationErrors,
  WordController.reLearnAnswer
);
app.post(
  '/knownAnswer',
  checkAuth,
  answerValidation,
  handleValidationErrors,
  WordController.knownAnswer
);
app.post(
  '/reKnownAnswer',
  checkAuth,
  answerValidation,
  handleValidationErrors,
  WordController.reKnownAnswer
);
app.post(
  '/repeatAnswer',
  checkAuth,
  answerValidation,
  handleValidationErrors,
  WordController.repeatAnswer
);
app.post(
  '/reRepeatAnswer',
  checkAuth,
  answerValidation,
  handleValidationErrors,
  WordController.reRepeatAnswer
);
app.post('/streak', checkAuth, WordController.checkStreak);
app.post('/translateAPI', (req, res) => {
  const API_KEY = process.env.TRANSLATE_YANDEX_API_KEY;
  return res.json({ API_KEY });
});

process.on('uncaughtException', (err) => {
  console.log(err);
  logger(err, 'uncaughtException');
  process.exit(1);
}); // some logging mechanisam // .... process.exit(1); // terminates process });

/*GET — получение ресурса
POST — создание ресурса
PUT — обновление ресурса
DELETE — удаление ресурса */

import config from './config.js';
import express from 'express';
const app = express();
app.use(express.json()); // req.body only for application/json
//app.use(express.urlencoded({extended: true})); // req.body only for application/x-www-form-urlencoded
import cookieParser from 'cookie-parser';
app.use(cookieParser()); // req.cookies

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
const port = process.env.PORT || config.server.port;
app.listen(port, config.server.host, (err) => {
  if (err) {
    console.log(err);
    logger(err, 'start server');
  }
  console.log(
    `Server has started on port ${port} and host ${config.server.host}`
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

import { UserController, WordController } from './controllers/index.js';
import {
  registerValidation,
  loginValidation,
  confirmValidation,
  forgotPasswordValidation,
  newPasswordValidation,
  infoValidation,
  newEmailValidation,
  importDataValidation,
  categoryValidation,
  wordValidation,
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
app.post('/logout', UserController.logout);
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
  importDataValidation,
  handleValidationErrors,
  UserController.importUserData
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

process.on('uncaughtException', (err) => {
  console.log(err);
  logger(err, 'uncaughtException');
  process.exit(1);
}); // some logging mechanisam // .... process.exit(1); // terminates process });

/*GET — получение ресурса
POST — создание ресурса
PUT — обновление ресурса
DELETE — удаление ресурса */

import express from 'express';
const router = express.Router();

import { UserController } from '../controllers/index.js';
import { userValidation } from '../validations.js';
import untils from '../untils/index.js';

router.post(
  '/forgot',
  userValidation.forgotPass,
  untils.handleValidationErrors,
  UserController.forgotPassword
);
router.post(
  '/password',
  userValidation.newPass,
  untils.handleValidationErrors,
  UserController.newPassword
);
router.post(
  '/email',
  untils.checkAuth,
  userValidation.newEmail,
  untils.handleValidationErrors,
  UserController.changeEmail
);
router.post(
  '/info',
  untils.checkAuth,
  userValidation.info,
  untils.handleValidationErrors,
  UserController.changeInfo
);
router.post(
  '/avatar',
  untils.checkAuth,
  untils.upload.single('avatar'),
  UserController.changeAvatar
);

router.post('/export', untils.checkAuth, UserController.exportUserData);
router.post(
  '/import',
  untils.checkAuth,
  userValidation.userInfo,
  untils.handleValidationErrors,
  UserController.importUserData
);
router.post(
  '/syncInfo',
  untils.checkAuth,
  userValidation.userInfo,
  untils.handleValidationErrors,
  UserController.syncInfo
);
router.post(
  '/message',
  untils.checkAuth,
  userValidation.message,
  untils.handleValidationErrors,
  UserController.message
);

export default router;

import express from 'express';
const router = express.Router();

import { UserController } from '../controllers/index.js';
import { authValidation } from '../validations.js';
import untils from '../untils/index.js';

router.post(
  '/register',
  authValidation.register,
  untils.handleValidationErrors,
  UserController.register
);
router.post(
  '/confirm',
  authValidation.confirm,
  untils.handleValidationErrors,
  UserController.confirm
);
router.post(
  '/login',
  authValidation.login,
  untils.handleValidationErrors,
  UserController.login
);
router.post('/logout', untils.checkAuth, UserController.logout);
router.post('/tokens', UserController.updateAccessToken);

export default router;

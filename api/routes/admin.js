import express from 'express';
const router = express.Router();

import { AdminController } from '../controllers/index.js';
import { adminValidation } from '../validations.js';
import untils from '../untils/index.js';

router.post(
  '/user-list',
  untils.checkAuth,
  untils.checkAdmin,
  AdminController.getUserList
);
router.post(
  '/known-words',
  untils.checkAuth,
  untils.checkAdmin,
  adminValidation.newKnownWords,
  untils.handleValidationErrors,
  AdminController.addNewKnownWords
);

export default router;

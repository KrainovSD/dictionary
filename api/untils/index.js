import { default as handleValidationErrors } from './handleValidatorErrors.js';
import { default as checkAuth } from './checkAuth.js';
import { default as reqLogger } from './reqLogger.js';
import { upload } from './multer.js';

export default {
  handleValidationErrors,
  checkAuth,
  reqLogger,
  upload,
};

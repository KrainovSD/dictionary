import express from 'express';
const router = express.Router();
import * as dotenv from 'dotenv';
dotenv.config({ path: 'config.env' });

import { WordController } from '../controllers/index.js';
import { wordsValidation } from '../validations.js';
import untils from '../untils/index.js';

router.post(
  '/category',
  untils.checkAuth,
  wordsValidation.category,
  untils.handleValidationErrors,
  WordController.addCategory
);
router.put(
  '/category',
  untils.checkAuth,
  wordsValidation.category,
  untils.handleValidationErrors,
  WordController.updateCategory
);
router.delete('/category/:id', untils.checkAuth, WordController.deleteCategory);
router.post(
  '/word',
  untils.checkAuth,
  wordsValidation.word,
  untils.handleValidationErrors,
  WordController.addWord
);
router.put(
  '/word',
  untils.checkAuth,
  wordsValidation.word,
  untils.handleValidationErrors,
  WordController.updateWord
);
//router.delete('/word/:id', untils.checkAuth, WordController.deleteWord);
router.post(
  '/delete-words',
  untils.checkAuth,
  wordsValidation.id,
  untils.handleValidationErrors,
  WordController.deleteWord
);
router.post(
  '/startLearnCategory',
  untils.checkAuth,
  WordController.startLearnCategory
);
router.post(
  '/relevance',
  untils.checkAuth,
  wordsValidation.relevance,
  untils.handleValidationErrors,
  WordController.addRelevance
);
router.post(
  '/learnAnswer',
  untils.checkAuth,
  wordsValidation.answer,
  untils.handleValidationErrors,
  WordController.learnAnswer
);
router.post(
  '/reLearnAnswer',
  untils.checkAuth,
  wordsValidation.answer,
  untils.handleValidationErrors,
  WordController.reLearnAnswer
);
router.post(
  '/knownAnswer',
  untils.checkAuth,
  wordsValidation.answer,
  untils.handleValidationErrors,
  WordController.knownAnswer
);
router.post(
  '/reKnownAnswer',
  untils.checkAuth,
  wordsValidation.answer,
  untils.handleValidationErrors,
  WordController.reKnownAnswer
);
router.post(
  '/repeatAnswer',
  untils.checkAuth,
  wordsValidation.answer,
  untils.handleValidationErrors,
  WordController.repeatAnswer
);
router.post(
  '/reRepeatAnswer',
  untils.checkAuth,
  wordsValidation.answer,
  untils.handleValidationErrors,
  WordController.reRepeatAnswer
);
router.post('/streak', untils.checkAuth, WordController.checkStreak);

router.post('/translateAPI', (req, res) => {
  const API_KEY = process.env.TRANSLATE_YANDEX_API_KEY;
  return res.json({ API_KEY });
});

export default router;

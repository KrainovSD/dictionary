import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
import User from '../models/Users.js';
const maxSizeAvatar = 5 * 1024 * 1024;

const fileFilter = (req, file, cb) => {
  // Функция должна вызывать `cb` с булевым значением, которое покажет следует ли принимать  файл или нет
  if (file.mimetype != 'image/png') return cb(null, false);
  return cb(null, true);
};
const storageConfig = multer.diskStorage({
  destination: async (req, file, cb) => {
    try {
      let user = await User.findOne({ _id: req.userId });
      let nickName = user.nickName;
      // Путь куда сохраняется файл полностью прописывается
      let dir = path.join(__dirname, `/../dist/uploads/${nickName}`);
      //if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true });
      if (!fs.existsSync(dir)) fs.mkdirSync(dir);
      cb(null, dir);
    } catch (error) {
      console.error(error);
    }
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // имя файла после сохранения
  },
});
export const upload = multer({
  storage: storageConfig,
  fileFilter: fileFilter,
  limits: {
    fileSize: maxSizeAvatar,
  },
}); // установка написанных конфигов

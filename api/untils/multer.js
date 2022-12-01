import multer from 'multer';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const maxLength = 1 * 1024 * 1024;

const fileFilter = (req, file, cb) => {
  // Функция должна вызывать `cb` с булевым значением, которое покажет следует ли принимать  файл или нет
  let fileLength = req.headers?.['content-length'];
  if (fileLength && fileLength > maxLength) cb(null, false);
  if (file.mimetype != 'image/png') cb(null, false);
  cb(null, true);
};
const storageConfig = multer.diskStorage({
  destination: async (req, file, cb) => {
    // Путь куда сохраняется файл полностью прописывается
    let dir = `./uploads/${req.userId}`;
    if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true });
    try {
      fs.mkdirSync(__dirname + `/../uploads/${req.userId}`);
    } catch (error) {
      console.error(error);
    }
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // имя файла после сохранения
  },
});
export const upload = multer({
  storage: storageConfig,
  fileFilter: fileFilter,
  limits: {
    fileSize: maxLength,
  },
}); // установка написанных конфигов

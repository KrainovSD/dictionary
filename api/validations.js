import { body } from 'express-validator';

export const loginValidation = [
  body('nickName', 'Неправильный ник').isString(),
  body('password', 'Пароль должен быть минимум 6 символов').isLength({ min: 6 }),
];

export const registerValidation = [
  body('email', 'Неверный формат почты').isEmail(),
  body('password', 'Пароль должен быть минимум 5 символов').isLength({ min: 6 }),
  body('userName', 'Укажите имя').isLength({ min: 3 }).isString(),
  body('nickName', 'Неверная ссылка на аватарку').isLength({ min: 3 }).isString(),
];

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
  body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
  body('tags', 'Неверный формат тэгов').optional().isString(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];
import { body } from 'express-validator';
export const confirmValidation = [
  body('id', 'ID не прошло проверку на подлинность').isString(),
];

export const loginValidation = [
  body(
    'nickName',
    'NickName должнен состоять только из латинских букв, цифр или символа нижнего подчеркивания, а так же длина NickName не должна превышать 25 символов или быть меньше, чем 3 символа!'
  )
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Поле nickName не должно быть пустым!')
    .isString()
    .withMessage('У поля nickName неверный тип данных!')
    .isLength({ min: 3, max: 16 })
    .withMessage(
      'Длина NickName не должна превышать 16 символов или быть меньше, чем 3 символа!'
    )
    .matches(/^([A-Za-z0-9_]+)$/)
    .withMessage(
      'NickName должнен состоять только из латинских букв, цифр или символа нижнего подчеркивания!'
    ),

  body('password', 'Длина пароля должна быть минимум 6 символов')
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Поле password не должно быть пустым!')
    .isString()
    .withMessage('У поля password неверный тип данных!')
    .isLength({ min: 8 })
    .withMessage('Минимальная длина пароля 8 символов!'),
];

export const registerValidation = [
  body('email', 'Неверный формат почты')
    .trim()
    .toLowerCase()
    .isEmail()
    .isString(),
  body('password', 'Пароль должен быть минимум 5 символов')
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Поле password не должно быть пустым!')
    .isString()
    .withMessage('У поля password неверный тип данных!')
    .isLength({ min: 8 })
    .withMessage('Минимальная длина пароля 8 символов!'),
  body('userName', 'Укажите имя')
    .trim()
    .toLowerCase()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Поле userName не должно быть пустым!')
    .isString()
    .withMessage('У поля userName неверный тип данных!')
    .isLength({ min: 2, max: 15 })
    .withMessage(
      'Длина Имени не должна превышать 15 символов или быть меньше, чем 2 символа! Если ваше имя содержит более 15-ти символов, используйте, пожалуйста, сокращенную версию!'
    )
    .matches(/^([A-Za-zА-Яа-я]+)$/)
    .withMessage('Имя может содержать только латинские или русские буквы!'),
  body('nickName', 'Неверная ссылка на аватарку')
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Поле nickName не должно быть пустым!')
    .isString()
    .withMessage('У поля nickName неверный тип данных!')
    .isLength({ min: 3, max: 16 })
    .withMessage(
      'Длина NickName не должна превышать 16 символов или быть меньше, чем 3 символа!'
    )
    .matches(/^([A-Za-z0-9_]+)$/)
    .withMessage(
      'NickName должнен состоять только из латинских букв, цифр или символа нижнего подчеркивания!'
    ),
];
export const forgotPasswordValidation = [
  body('email', 'Неверный формат почты')
    .trim()
    .toLowerCase()
    .isEmail()
    .isString(),
  body('nickName', 'Неверная ссылка на аватарку')
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Поле nickName не должно быть пустым!')
    .isString()
    .withMessage('У поля nickName неверный тип данных!')
    .isLength({ min: 3, max: 16 })
    .withMessage(
      'Длина NickName не должна превышать 16 символов или быть меньше, чем 3 символа!'
    )
    .matches(/^([A-Za-z0-9_]+)$/)
    .withMessage(
      'NickName должнен состоять только из латинских букв, цифр или символа нижнего подчеркивания!'
    ),
];
export const newPasswordValidation = [
  body('password', '')
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Поле password не должно быть пустым!')
    .isString()
    .withMessage('У поля password неверный тип данных!')
    .isLength({ min: 8 })
    .withMessage('Минимальная длина пароля 8 символов!'),
  body('key', '')
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Key не должен быть пустым!')
    .isString()
    .withMessage('У key неверный тип данных!'),
];
export const infoValidation = [];

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
  body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
  body('tags', 'Неверный формат тэгов').optional().isString(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];

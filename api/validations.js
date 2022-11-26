import { body } from 'express-validator';
export const confirmValidation = [
  body('key', 'Key не прошел проверку на подлинность').isString(),
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
  body('password', '')
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
  body('nickName', '')
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
export const infoValidation = [
  body('nickName', '')
    .optional()
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
  body('userName', 'Укажите имя')
    .optional()
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
  body('email', 'Неверный формат почты')
    .optional()
    .trim()
    .toLowerCase()
    .isEmail()
    .isString(),
  body('password', 'Неверный формат почты')
    .optional()
    .trim()
    .toLowerCase()
    .isEmail()
    .isString(),
  body('countKnownWordsAtOneTime')
    .optional()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Поле не должно быть пустым!')
    .isInt({ min: 20, max: 99, allow_leading_zeroes: false })
    .withMessage(
      'За один урок следует повторять не менее 20 слов и не более 99!'
    ),
  body('countWrongsToAddToRepeat')
    .optional()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Поле не должно быть пустым!')
    .isInt({ min: 3, max: 9, allow_leading_zeroes: false })
    .withMessage(
      'Слово не следует добавлять чаще, чем после 3 ошибок и реже, чем после 9!'
    ),
  body('regularityToRepeat.*')
    .optional()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Поле не должно быть пустым!')
    .isInt({ min: 1, max: 16, allow_leading_zeroes: false })
    .withMessage(
      'Интервал не может превышать 16-ти дней и быть меньше 1-ого дня!'
    ),
  /*.custom((value) => {
    value
    throw new Error('');
    return true;
  }),*/
  body('maxDateCheckRelevance')
    .optional()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Поле не должно быть пустым!')
    .isInt({ min: 10, max: 90, allow_leading_zeroes: false })
    .withMessage(
      'Слово не следует анализировать за срок короче, чем 10 дней и длиннее, чем 90!'
    ),
  body('maxCountCheckRelevance')
    .optional()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Поле не должно быть пустым!')
    .isInt({ min: 3, max: 9, allow_leading_zeroes: false })
    .withMessage(
      'Слово не следует добавлять чаще, чем после 3 встреч и реже, чем после 9!'
    ),
  body('*').custom((value, { req }) => {
    let fields = Object.keys(req.body);
    if (fields.length != 1) throw new Error('Принимается только одно поле!');
    if (
      fields[0] != 'nickName' &&
      fields[0] != 'userName' &&
      fields[0] != 'email' &&
      fields[0] != 'password' &&
      fields[0] != 'countKnownWordsAtOneTime' &&
      fields[0] != 'countWrongsToAddToRepeat' &&
      fields[0] != 'maxDateCheckRelevance' &&
      fields[0] != 'maxCountCheckRelevance' &&
      fields[0] != 'regularityToRepeat'
    )
      throw new Error('Переданного поля не существует!');
    return true;
  }),
];

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
  body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
  body('tags', 'Неверный формат тэгов').optional().isString(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];

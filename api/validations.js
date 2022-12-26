import { body } from 'express-validator';
/*USER */

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
  body('regularityToRepeat')
    .optional()
    .custom((value) => {
      if (value.length != 8)
        throw new Error('Количество повторений должно быть равно 8-ми!');
      return true;
    }),
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

export const newEmailValidation = [
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
  body('email', 'Неверный формат почты')
    .trim()
    .toLowerCase()
    .isEmail()
    .isString(),
];

export const importDataValidation = [];

export const messageValidation = [
  body('userName')
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Имя пользователя не должно быть пустым!')
    .isString()
    .withMessage('У Имя пользователя неверный тип данных!')
    .matches(/^[А-Яа-яA-Za-z]+$/)
    .withMessage(
      'При заполнении имени разрешено использовать только буквы английского и русского алфавита!'
    ),
  body('email')
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Email не должен быть пустым!')
    .isString()
    .withMessage('У Email неверный тип данных!')
    .matches(
      /^[a-z0-9][a-z0-9-_.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9]).[a-z0-9]{2,10}(?:.[a-z]{2,10})?$/
    )
    .withMessage('Неверный формат Email!'),
  body('message')
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Сообщение не должно быть пустым!')
    .isString()
    .withMessage('У сообщения неверный тип данных!')
    .matches(/^[А-Яа-яA-Za-z0-9 \-:!?.,]+$/)
    .withMessage(
      'При заполнении сообщения разрешено использовать только буквы английского, русского алфавита, цифры и знаки препинания!'
    )
    .isLength({ max: 600 })
    .withMessage('Длина сообщения не должна превышать 600 символов!'),
];

/* WORDS  */

export const categoryValidation = [
  body('id')
    .optional()
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('id не должно быть пустым!')
    .isString()
    .withMessage('У id неверный тип данных!'),
  body('name')
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Имя категории не должно быть пустым!')
    .isString()
    .withMessage('У имени категории неверный тип данных!')
    .isLength({ min: 5, max: 20 })
    .withMessage(
      'Имя категории должно быть не длиннее 20-ти символов или короче 5!'
    )
    .matches(/^[A-Za-zА-Яа-я0-9\- ]+$/)
    .withMessage(
      'Имя категории может состоять из букв русского, английского алфавита и цифр без использования специальных символов!'
    ),
  body('icon')
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Название иконки не должно быть пустым!')
    .isString()
    .withMessage('У названия иконки неверный тип данных!')
    .matches(/^[A-Za-z\-.]+$/)
    .withMessage('Неверно передано название иконки!'),
  body('regularityToRepeat.*')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Поле не должно быть пустым!')
    .isInt({ min: 1, max: 16, allow_leading_zeroes: false })
    .withMessage(
      'Интервал не может превышать 16-ти дней и быть меньше 1-ого дня!'
    ),
  body('regularityToRepeat').custom((value) => {
    if (value.length != 12)
      throw new Error('Количество повторений должно быть равно 12-ти!');
    return true;
  }),
];
export const wordValidation = [
  body('id')
    .optional()
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('id не должно быть пустым!')
    .isString()
    .withMessage('У id неверный тип данных!'),
  body('word')
    .trim()
    .toLowerCase()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Слово не должно быть пустым!')
    .isString()
    .withMessage('У слова неверный тип данных!')
    .isLength({ max: 50 })
    .withMessage(
      'Длина слова или словосочетания не должна превышать более 50 символов!'
    )
    .matches(/^[a-zA-Z\- ]+$/)
    .withMessage(
      'Слово или словосочетание может состоять только из букв английского алфавита, пробела и дефиса!'
    ),
  body('category')
    .optional()
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Категория не должна быть пуста!')
    .isString()
    .withMessage('У категории неверный тип данных!'),
  body('translate')
    .trim()
    .toLowerCase()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Перевод не должен быть пустым!')
    .isString()
    .withMessage('У перевода неверный тип данных!')
    .isLength({ max: 50 })
    .withMessage(
      'Длина слова или словосочетания не должна превышать более 50 символов!'
    )
    .matches(/^[а-яА-Я \-,]+$/)
    .withMessage(
      'Слово или словосочетание может состоять только из букв русского алфавита, пробела, дефиса или запятой!'
    ),
  body('transcription')
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Транскрипция не должна быть пустая!')
    .isString()
    .withMessage('У транскрипции неверный тип данных!')
    .isLength({ max: 50 })
    .withMessage('Длина транскрипции не должна превышать более 50 символов!')
    .matches(/^[ɑʌəεæɜʒıɪŋɔɒʃðθʤʊbdefghijklmnprʧstuvwz[\] ˌˈ:ː]+$/)
    .withMessage(
      'Транскрипция может содержать только специальные символы представленные доп. клавиатурой!'
    ),
  body('description')
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Описание не должно быть пустым!')
    .isString()
    .withMessage('У описания неверный тип данных!')
    .isLength({ max: 164 })
    .withMessage(
      'Длина описания слова или словосочетания не должна превышать более 164 символов!'
    )
    .custom((value) => {
      if (value.length == 0) return true;
      if (/^[а-яА-Яa-zA-Z \-.,!?]+$/.test(value)) return true;
      throw new Error(
        'Описание слова или словочетания может состоять только из букв русского и английского алфавита, пробела, дефиса и знаков препинания!'
      );
    }),
  body('example.*')
    .trim()
    .isString()
    .withMessage('У транскрипции неверный тип данных!')
    .isLength({ max: 100 })
    .withMessage(
      'Длина примера использования слова или словосочетания не должна превышать более 100 символов!'
    )
    .custom((value) => {
      if (value.length == 0) return true;
      if (/^[a-zA-Z  \-.,!?]+$/.test(value)) return true;
      throw new Error(
        'Пример использования слова или словочетания может состоять только из букв английского алфавита, пробела, дефиса и знаков препинания!'
      );
    }),
  body('example').custom((value) => {
    if (value.length > 3)
      throw new Error('Количество примеров не должно превышать 3-ех!');
    return true;
  }),
];
export const relevanceValidation = [
  body('words.*')
    .trim()
    .toLowerCase()
    .isString()
    .withMessage('Неверный тип данных!')
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Слово не должно быть пустым!')
    .isLength({ max: 50 })
    .withMessage(
      'Длина слова или словосочетания не должна превышать более 50 символов!'
    )
    .matches(/^[a-zA-Z\- ]+$/)
    .withMessage(
      'Слово или словосочетание может состоять только из букв английского алфавита, пробела и дефиса!'
    ),
  body('words').custom((value) => {
    if (value?.length == 0) throw new Error('Нет ни одного слова!');
    return true;
  }),
];

export const postCreateValidation = [
  body('title', 'Введите заголовок статьи').isLength({ min: 3 }).isString(),
  body('text', 'Введите текст статьи').isLength({ min: 3 }).isString(),
  body('tags', 'Неверный формат тэгов').optional().isString(),
  body('imageUrl', 'Неверная ссылка на изображение').optional().isString(),
];

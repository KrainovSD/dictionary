import { body } from 'express-validator';

const confirmValidation = [
  body('key', 'Key не прошел проверку на подлинность').isString(),
];

const loginValidation = [
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

const registerValidation = [
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
export const authValidation = {
  confirm: confirmValidation,
  login: loginValidation,
  register: registerValidation,
};

const forgotPasswordValidation = [
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

const newPasswordValidation = [
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

const infoValidation = [
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

const newEmailValidation = [
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

const messageValidation = [
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

const userInfoValidation = [
  body('userInfo')
    .customSanitizer((value) => {
      let userInfo = {
        knownWords: value.knownWords,
        categoriesToLearn: value.categoriesToLearn,
        wordsToStudy: value.wordsToStudy,
        wordsToRepeat: value.wordsToRepeat,
        relevance: value.relevance,
        statistics: value.statistics,
        options: value.options,
        signature: value.signature,
      };
      if (value.nickName) userInfo.nickName = value.nickName;
      return userInfo;
    })
    .custom((value) => {
      let validation = {
        isValidatedKnownWords: checkKnownWords(value.knownWords),
        isValidatedCategoriesToLearn: checkCategoriesToLearn(
          value.categoriesToLearn
        ),
        isValidatedWordsToStudy: checkWordsToStudy(value.wordsToStudy),
        isValidatedWordsToRepeat: checkWordsToRepeat(value.wordsToRepeat),
        isValidatedRelevance: checkRelevance(value.relevance),
        isValidatedStatistics: checkStatistics(value.statistics),
        isValidatedOptions: checkOptions(value.options),
        isValidatedSignature: checkSignature(value.signature),
      };
      console.log(validation);
      for (let key in validation) {
        if (!validation[key]) throw new Error('Данные повреждены!');
      }
      return true;
    })
    .withMessage('Данные повреждены!'),
];
function checkKnownWords(words) {
  if (!Array.isArray(words)) return false;
  if (words.length == 0) return true;
  let knownWords = words.map((item) => {
    let { offline, ...newArray } = item;
    return newArray;
  });
  const knownFields = [
    'word',
    'translate',
    'transcription',
    'description',
    'example',
    'wrongs',
    'irregularVerb',
    'lastRepeat',
    'lastReverseRepeat',
    'historyOfRepeat',
    'historyOfReverseRepeat',
    'dateOfKnown',
    '_id',
  ];
  for (let word of knownWords) {
    if (typeof word != 'object') return false;
    if (Array.isArray(word)) return false;
    if (Object.keys(word).length != 13) return false;
    for (let field in word) {
      if (!knownFields.includes(field)) return false;
      let fieldData = word[field];
      switch (field) {
        case 'word': {
          if (fieldData === '' || typeof fieldData != 'string') return false;
          if (!/^[a-zA-Z -]+$/.test(fieldData)) return false;
          if (fieldData.length > 50) return false;
          break;
        }
        case 'translate': {
          if (fieldData === '' || typeof fieldData != 'string') return false;
          if (!/^[а-яА-Я \-,]+$/.test(fieldData)) return false;
          if (fieldData.length > 50) return false;
          break;
        }
        case 'transcription': {
          if (fieldData === '' || typeof fieldData != 'string') return false;
          if (
            !/^[ɑaʌəεæɜʒıɪŋɔɒʃðθʤʊbdefghijklmnprʧstuvwz[\] ˌˈ:ː]+$/.test(
              fieldData
            )
          )
            return false;
          if (fieldData.length > 50) return false;
          break;
        }
        case 'description': {
          if (fieldData !== '' && typeof fieldData != 'string') return false;
          if (!/^[а-яА-Яa-zA-Z \-.,!?]+$/.test(fieldData) && fieldData !== '')
            return false;
          if (fieldData.length > 164) return false;
          break;
        }
        case 'example': {
          if (!Array.isArray(fieldData)) return false;
          if (fieldData.length != 3) return false;
          let error = false;
          fieldData.forEach((item) => {
            if (typeof item != 'string') error = true;
            if (!/^[a-zA-Z  \-.,!?]+$/.test(item) && item != '') error = true;
            if (item.length > 100) error = true;
          });
          if (error) return false;
          break;
        }
        case 'wrongs': {
          if (fieldData === '') return false;
          fieldData = +fieldData;
          if (typeof fieldData != 'number') return false;
          if (fieldData < 0) return false;
          break;
        }
        case 'irregularVerb': {
          if (typeof fieldData != 'boolean') return false;
          break;
        }
        case '_id': {
          if (
            !fieldData ||
            typeof fieldData != 'string' ||
            fieldData.trim()?.length == 0
          )
            return false;
          break;
        }
        case ['lastRepeat', 'lastReverseRepeat', 'dateOfKnown'].find(
          (item) => item === fieldData
        ): {
          if (fieldData === '') return false;
          fieldData = +fieldData;
          if (typeof fieldData != 'number') return false;
          if (fieldData < 0) return false;
          break;
        }
        case ['historyOfRepeat', 'historyOfReverseRepeat'].find(
          (item) => item === fieldData
        ): {
          if (!Array.isArray(fieldData)) return false;
          let error = false;
          fieldData.forEach((item) => {
            if (item === '') error = true;
            item = +item;
            if (typeof item != 'number') error = true;
            if (item < 0) error = true;
          });
          if (error) return false;
          break;
        }
      }
    }
  }

  return true;
}
function checkCategoriesToLearn(categories) {
  if (!Array.isArray(categories)) return false;
  if (categories.length == 0) return true;
  let studyCategories = categories.map((item) => {
    let { offline, ...newArray } = item;
    return newArray;
  });
  const categoriesFields = [
    'name',
    'regularityToRepeat',
    'icon',
    'lastRepeat',
    'lastReverseRepeat',
    'nextRepeat',
    'nextReverseRepeat',
    'historyOfRepeat',
    'historyOfReverseRepeat',
    'countOfRepeat',
    'countOfReverseRepeat',
    'startLearn',
    'dateOfStartLearn',
    '_id',
  ];
  for (let category of studyCategories) {
    if (typeof category != 'object') return false;
    if (Array.isArray(category)) return false;
    if (Object.keys(category).length != 14) return false;
    for (let field in category) {
      if (!categoriesFields.includes(field)) return false;
      let fieldData = category[field];
      switch (field) {
        case 'name': {
          if (fieldData === '' || typeof fieldData != 'string') return false;
          if (fieldData.length > 20 || fieldData.length < 5) return false;
          if (!/^[A-Za-zА-Яа-я0-9\- ]+$/.test(fieldData)) return false;
          break;
        }
        case 'regularityToRepeat': {
          if (!Array.isArray(fieldData)) return false;
          if (fieldData.length != 12) return false;
          let error = false;
          fieldData.forEach((item) => {
            if (item === '') error = true;
            item = +item;
            if (typeof item != 'number') error = true;
            if (item > 16 || item < 1) error = true;
          });
          if (error) return false;
          break;
        }
        case 'icon': {
          if (fieldData === '' || typeof fieldData != 'string') return false;
          if (!/^[A-Za-z\-.]+$/.test(fieldData)) return false;
          break;
        }
        case 'startLearn': {
          if (typeof fieldData != 'boolean') return false;
          break;
        }
        case '_id': {
          if (
            !fieldData ||
            typeof fieldData != 'string' ||
            fieldData.trim()?.length == 0
          )
            return false;
          break;
        }
        case [
          'lastRepeat',
          'lastReverseRepeat',
          'nextRepeat',
          'nextReverseRepeat',
          'countOfRepeat',
          'countOfReverseRepeat',
          'dateOfStartLearn',
        ].find((item) => item === fieldData): {
          if (fieldData === '') return false;
          fieldData = +fieldData;
          if (typeof fieldData != 'number') return false;
          if (fieldData < 0) return false;
          break;
        }
        case ['historyOfRepeat', 'historyOfReverseRepeat'].find(
          (item) => item === fieldData
        ): {
          if (!Array.isArray(fieldData)) return false;
          let error = false;
          fieldData.forEach((item) => {
            if (item === '') error = true;
            item = +item;
            if (typeof item != 'number') error = true;
            if (item < 0) error = true;
          });
          if (error) return false;
          break;
        }
      }
    }
  }

  return true;
}
function checkWordsToStudy(words) {
  if (!Array.isArray(words)) return false;
  if (words.length == 0) return true;
  let studyWords = words.map((item) => {
    let { offline, ...newArray } = item;
    return newArray;
  });
  const studyFields = [
    'word',
    'translate',
    'transcription',
    'description',
    'example',
    'wrongs',
    'irregularVerb',
    'category',
    '_id',
  ];
  for (let word of studyWords) {
    if (typeof word != 'object') return false;
    if (Array.isArray(word)) return false;
    if (Object.keys(word).length != 9) return false;
    for (let field in word) {
      if (!studyFields.includes(field)) return false;
      let fieldData = word[field];
      switch (field) {
        case 'word': {
          if (fieldData === '' || typeof fieldData != 'string') return false;
          if (!/^[a-zA-Z -]+$/.test(fieldData)) return false;
          if (fieldData.length > 50) return false;
          break;
        }
        case 'translate': {
          if (fieldData === '' || typeof fieldData != 'string') return false;
          if (!/^[а-яА-Я \-,]+$/.test(fieldData)) return false;
          if (fieldData.length > 50) return false;
          break;
        }
        case 'transcription': {
          if (fieldData === '' || typeof fieldData != 'string') return false;
          if (
            !/^[ɑaʌəεæɜʒıɪŋɔɒʃðθʤʊbdefghijklmnprʧstuvwz[\] ˌˈ:ː]+$/.test(
              fieldData
            )
          )
            return false;
          if (fieldData.length > 50) return false;
          break;
        }
        case 'description': {
          if (fieldData !== '' && typeof fieldData != 'string') return false;
          if (!/^[а-яА-Яa-zA-Z \-.,!?]+$/.test(fieldData) && fieldData !== '')
            return false;
          if (fieldData.length > 164) return false;
          break;
        }
        case 'example': {
          if (!Array.isArray(fieldData)) return false;
          if (fieldData.length != 3) return false;
          let error = false;
          fieldData.forEach((item) => {
            if (typeof item != 'string') error = true;
            if (!/^[a-zA-Z  \-.,!?]+$/.test(item) && item != '') error = true;
            if (item.length > 100) error = true;
          });
          if (error) return false;
          break;
        }
        case 'wrongs': {
          if (fieldData === '') return false;
          fieldData = +fieldData;
          if (typeof fieldData != 'number') return false;
          if (fieldData < 0) return false;
          break;
        }
        case 'irregularVerb': {
          if (typeof fieldData != 'boolean') return false;
          break;
        }
        case ['_id', 'category'].find((item) => item === fieldData): {
          if (
            !fieldData ||
            typeof fieldData != 'string' ||
            fieldData.trim()?.length == 0
          )
            return false;
          break;
        }
      }
    }
  }

  return true;
}
function checkWordsToRepeat(words) {
  if (!Array.isArray(words)) return false;
  if (words.length == 0) return true;
  let repeatWords = words.map((item) => {
    let { offline, ...newArray } = item;
    return newArray;
  });
  const repeatFields = [
    'word',
    'translate',
    'transcription',
    'description',
    'example',
    'irregularVerb',
    'lastRepeat',
    'lastReverseRepeat',
    'nextRepeat',
    'nextReverseRepeat',
    'historyOfRepeat',
    'historyOfReverseRepeat',
    'countOfRepeat',
    'countOfReverseRepeat',
    'dateOfCreation',
    '_id',
  ];
  for (let word of repeatWords) {
    if (typeof word != 'object') return false;
    if (Array.isArray(word)) return false;
    if (Object.keys(word).length != 16) return false;
    for (let field in word) {
      if (!repeatFields.includes(field)) return false;
      let fieldData = word[field];

      switch (field) {
        case 'word': {
          if (fieldData === '' || typeof fieldData != 'string') return false;
          if (!/^[a-zA-Z -]+$/.test(fieldData)) return false;
          if (fieldData.length > 50) return false;
          break;
        }
        case 'translate': {
          if (fieldData === '' || typeof fieldData != 'string') return false;
          if (!/^[а-яА-Я \-,]+$/.test(fieldData)) return false;
          if (fieldData.length > 50) return false;
          break;
        }
        case 'transcription': {
          if (fieldData === '' || typeof fieldData != 'string') return false;
          if (
            !/^[ɑaʌəεæɜʒıɪŋɔɒʃðθʤʊbdefghijklmnprʧstuvwz[\] ˌˈ:ː]+$/.test(
              fieldData
            )
          )
            return false;
          if (fieldData.length > 50) return false;
          break;
        }
        case 'description': {
          if (fieldData !== '' && typeof fieldData != 'string') return false;
          if (!/^[а-яА-Яa-zA-Z \-.,!?]+$/.test(fieldData) && fieldData !== '')
            return false;
          if (fieldData.length > 164) return false;
          break;
        }
        case 'example': {
          if (!Array.isArray(fieldData)) return false;
          if (fieldData.length != 3) return false;
          let error = false;
          fieldData.forEach((item) => {
            if (typeof item != 'string') error = true;
            if (!/^[a-zA-Z  \-.,!?]+$/.test(item) && item != '') error = true;
            if (item.length > 100) error = true;
          });
          if (error) return false;
          break;
        }
        case 'irregularVerb': {
          if (typeof fieldData != 'boolean') return false;
          break;
        }
        case '_id': {
          if (
            !fieldData ||
            typeof fieldData != 'string' ||
            fieldData.trim()?.length == 0
          )
            return false;
          break;
        }
        case [
          'lastRepeat',
          'lastReverseRepeat',
          'nextRepeat',
          'nextReverseRepeat',
          'countOfRepeat',
          'countOfReverseRepeat',
          'dateOfCreation',
        ].find((item) => item === fieldData): {
          if (fieldData === '') return false;
          fieldData = +fieldData;
          if (typeof fieldData != 'number') return false;
          if (fieldData < 0) return false;
          break;
        }
        case ['historyOfRepeat', 'historyOfReverseRepeat'].find(
          (item) => item === fieldData
        ): {
          if (!Array.isArray(fieldData)) return false;
          let error = false;
          fieldData.forEach((item) => {
            if (item === '') error = true;
            item = +item;
            if (typeof item != 'number') error = true;
            if (item < 0) error = true;
          });
          if (error) return false;
          break;
        }
      }
    }
  }

  return true;
}
function checkRelevance(words) {
  if (!Array.isArray(words)) return false;
  if (words.length == 0) return true;
  let relevanceWords = words.map((item) => {
    let { offline, ...newArray } = item;
    return newArray;
  });
  const relevanceFileds = [
    'word',
    'dateOfCreation',
    'dateOfDetected',
    'irregularVerb',
    '_id',
  ];
  for (let word of relevanceWords) {
    if (typeof word != 'object') return false;
    if (Array.isArray(word)) return false;
    if (Object.keys(word).length != 5) return false;
    for (let field in word) {
      if (!relevanceFileds.includes(field)) return false;
      let fieldData = word[field];
      switch (field) {
        case 'word': {
          if (typeof fieldData != 'string' || fieldData === '') return false;
          if (!/^[a-zA-Z -]+$/.test(fieldData)) return false;
          if (fieldData.length > 50) return false;
          break;
        }
        case 'dateOfCreation': {
          if (fieldData === '') return false;
          fieldData = +fieldData;
          if (typeof fieldData != 'number') return false;
          if (fieldData < 0) return false;
          break;
        }
        case 'dateOfDetected': {
          if (!Array.isArray(fieldData)) return false;
          let error = false;
          fieldData.forEach((item) => {
            if (item === '') error = true;
            item = +item;
            if (typeof item != 'number') error = true;
            if (item < 0) error = true;
          });
          if (error) return false;
          break;
        }
        case 'irregularVerb': {
          if (typeof fieldData != 'boolean') return false;
          break;
        }
        case '_id': {
          if (
            !fieldData ||
            typeof fieldData != 'string' ||
            fieldData.trim()?.length == 0
          )
            return false;
          break;
        }
      }
    }
  }

  return true;
}
function checkStatistics(statistics) {
  if (!Array.isArray(statistics)) return false;
  if (statistics.length != 1) return false;
  let statisticItems = statistics.map((item) => {
    let { offline, ...newArray } = item;
    return newArray;
  });
  statisticItems = statisticItems[0];
  if (typeof statisticItems != 'object') return false;
  if (Array.isArray(statisticItems)) return false;
  if (Object.keys(statisticItems).length != 8) return false;
  const statisticFields = [
    'bestStreak',
    'lastRepeatKnownWords',
    'lastReverseRepeatKnownWords',
    'historyOfRepeatKnownWords',
    'historyOfReverseRepeatKnownWords',
    'currentStreak',
    'dateOfLastStreak',
    'lastDailyCheckStreak',
  ];
  for (let field in statisticItems) {
    if (!statisticFields.includes(field)) return false;
    let fieldData = statisticItems[field];
    if (
      field != 'historyOfRepeatKnownWords' &&
      field != 'historyOfReverseRepeatKnownWords'
    ) {
      if (fieldData === '') return false;
      fieldData = +fieldData;
      if (typeof fieldData != 'number') return false;
      if (fieldData < 0) return false;
    } else {
      if (!Array.isArray(fieldData)) return false;
      let error = false;
      fieldData.forEach((item) => {
        if (item === '') error = true;
        item = +item;
        if (typeof item != 'number') error = true;
        if (item < 0) error = true;
      });
      if (error) return false;
    }
  }

  return true;
}
function checkOptions(options) {
  if (!Array.isArray(options)) return false;
  if (options.length != 1) return false;
  let optionItems = options.map((item) => {
    let { offline, ...newArray } = item;
    return newArray;
  });
  optionItems = optionItems[0];
  if (typeof optionItems != 'object') return false;
  if (Array.isArray(optionItems)) return false;
  if (Object.keys(optionItems).length != 5) return false;
  const optionFields = [
    'countKnownWordsAtOneTime',
    'countWrongsToAddToRepeat',
    'regularityToRepeat',
    'maxDateCheckRelevance',
    'maxCountCheckRelevance',
  ];

  for (let field in optionItems) {
    if (!optionFields.includes(field)) return false;
    let fieldData = optionItems[field];
    if (field != 'regularityToRepeat') {
      if (fieldData === '') return false;
      fieldData = +fieldData;
      if (typeof fieldData != 'number') return false;
      if (fieldData < 0) return false;
    }
    switch (field) {
      case 'countKnownWordsAtOneTime': {
        if (fieldData < 20 || fieldData > 99) {
          return false;
        }
        break;
      }
      case 'countWrongsToAddToRepeat': {
        if (fieldData < 3 || fieldData > 9) {
          return false;
        }
        break;
      }
      case 'maxCountCheckRelevance': {
        if (fieldData < 3 || fieldData > 9) {
          return false;
        }
        break;
      }
      case 'maxDateCheckRelevance': {
        if (fieldData < 10 || fieldData > 90) {
          return false;
        }
        break;
      }
      case 'regularityToRepeat': {
        if (!Array.isArray(fieldData)) return false;
        if (fieldData.length != 8) return false;
        let error = false;
        fieldData.forEach((item) => {
          if (item === '') {
            error = true;
          }
          item = +item;
          if (typeof item != 'number') {
            error = true;
          }

          if (item > 16 || item < 1) {
            error = true;
          }
        });
        if (error) return false;
        break;
      }
    }
  }

  return true;
}
function checkSignature(signatures) {
  if (typeof signatures != 'object') return false;
  if (Array.isArray(signatures)) return false;
  if (
    Object.keys(signatures).length != 8 &&
    Object.keys(signatures).length != 9
  )
    return false;
  let signatureFields = [
    'knownWords',
    'categoriesToLearn',
    'wordsToStudy',
    'wordsToRepeat',
    'relevance',
    'statistics',
    'options',
    'data',
    'nickName',
  ];
  for (let field in signatures) {
    if (!signatureFields.includes(field)) return false;
    if (typeof signatures[field] != 'string' || signatures[field] === '')
      return false;
  }
  return true;
}
export const userValidation = {
  forgotPass: forgotPasswordValidation,
  newPass: newPasswordValidation,
  info: infoValidation,
  newEmail: newEmailValidation,
  message: messageValidation,
  userInfo: userInfoValidation,
};

/* WORDS  */
const idValidation = [
  body('id')
    .custom((value) => {
      if (value.length == 0) throw new Error('Пустой массив');
      return true;
    })
    .withMessage('id не должно быть пустым!'),
  body('id.*')
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('id не должно быть пустым!')
    .isString()
    .withMessage('У id неверный тип данных!'),
];
const categoryValidation = [
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
const wordValidation = [
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
    .matches(/^[ɑaʌəεæɜʒıɪŋɔɒʃðθʤʊbdefghijklmnprʧstuvwz[\] ˌˈ:ː]+$/)
    .withMessage(
      'Транскрипция может содержать только специальные символы представленные доп. клавиатурой!'
    ),
  body('description')
    .trim()
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
const relevanceValidation = [
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
const answerValidation = [
  body('words.*.word')
    .trim()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Неверный формат ответа!')
    .isString()
    .withMessage('Неверный формат ответа!'),
  body('words.*.wrong')
    .optional()
    .not()
    .isEmpty({ ignore_whitespace: true })
    .withMessage('Неверный формат ответа!')
    .isBoolean()
    .withMessage('Неверный формат ответа!'),
  body('categoryID.*')
    .trim()
    .custom((value) => {
      if (value != 'undefined' && typeof value != 'string')
        throw new Error('Неверный формат ответа!');
      if (value === '') throw new Error('Неверный формат ответа!');
      return true;
    }),
];

export const wordsValidation = {
  category: categoryValidation,
  word: wordValidation,
  relevance: relevanceValidation,
  answer: answerValidation,
  id: idValidation,
};

import config from '../config.js';

import User from '../models/Users.js';

export const addCategory = async (req, res) => {
  try {
    let { name, icon, regularityToRepeat } = req.body;
    let user = await User.findOne({
      _id: req.userId,
      'categoriesToLearn.name': name,
    });
    if (user) {
      return res
        .status(400)
        .json({ message: `Такое имя уже есть у другой категории!` });
    }

    let newCategory = {
      name: name,
      regularityToRepeat: regularityToRepeat,
      icon: icon,
      lastRepeat: 0,
      lastReverseRepeat: 0,
      nextRepeat: 0,
      nextReverseRepeat: 0,
      historyOfRepeat: [],
      countOfRepeat: 0,
      startLearn: false,
    };
    user = await User.findOneAndUpdate(
      { _id: req.userId },
      { $push: { categoriesToLearn: newCategory } },
      { new: true, rawResult: true }
    );
    if (user.ok == 0)
      return res.status(400).json({
        message: `Couldn't perform add new Category`,
      });
    let userData = getUserInfoFromDoc(user.value._doc);

    res.json({ message: 'Новая категория успешно добавлена', user: userData });
  } catch (err) {
    return res.status(500).json({
      message: `Couldn't add new category!`,
    });
  }
};
export const addWord = async (req, res) => {
  try {
    let { category, word, translate, transcription, description, example } =
      req.body;
    let irregularVerbs = checkIrregularVerbs(word);
    let user = await User.findOne({
      _id: req.userId,
    });
    console.log();
    if (!user) {
      return res.status(400).json({
        message: "Couldn't perform to add new word!",
      });
    }
    let categories = user.categoriesToLearn;
    categories = categories.filter((item) => item._id == category);
    if (categories?.length == 0 || categories?.[0]?.startLearn == true) {
      return res.status(400).json({
        message: `Couldn't perform to add new word becouse для этой категории было начато обучение!`,
      });
    }
    user = await User.findOne({
      _id: req.userId,
      'wordsToStudy.word': word,
    });
    console.log(user);
    if (user) {
      return res.status(400).json({
        message:
          "Couldn't perform to add new word becouse такое слово уже есть!",
      });
    }

    let newWords = {
      word: word,
      translate: translate,
      transcription: transcription,
      description: description,
      example: example,
      wrongs: 0,
      irregularVerbs: irregularVerbs,
      category: category,
    };

    user = await User.findOneAndUpdate(
      { _id: req.userId },
      {
        $push: { wordsToStudy: newWords },
      },
      { new: true, rawResult: true }
    );
    if (user.ok == 0)
      return res.status(400).json({
        message: `Couldn't perform to add new word`,
      });
    let userData = getUserInfoFromDoc(user.value._doc);
    res.json({ message: 'Новое слово успешно добавлено', user: userData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Couldn't add new word!`,
    });
  }
};
export const startLearnCategory = async (req, res) => {
  try {
    let { id } = req.body;

    if (!id || typeof id != 'string' || id.trim()?.length == 0) {
      return res
        .status(400)
        .json({ message: `Couldn't perform the operation!` });
    }
    let user = await User.findOne({
      _id: req.userId,
      'wordsToStudy.category': id,
    });
    if (!user) {
      return res
        .status(400)
        .json({
          message: `Couldn't perform the operation, потому что нет слов в категории!`,
        });
    }

    user = await User.findOneAndUpdate(
      {
        _id: req.userId,
        'categoriesToLearn._id': id,
      },
      {
        $set: {
          'categoriesToLearn.$.startLearn': true,
        },
      },
      { new: true, rawResult: true }
    );
    console.log(user);
    if (user.ok == 0) {
      return res
        .status(400)
        .json({ message: `Couldn't perform the operation!` });
    }
    let userData = getUserInfoFromDoc(user.value._doc);
    res.json({ message: 'sosi', user: userData });
  } catch (err) {
    return res.status(500).json({
      message: `Couldn't perform the operation!`,
    });
  }
};

function checkIrregularVerbs(word) {
  if (!/--/g.test(word)) return false;
  let words = word.split('--');
  if (words.length != 3) return false;
  return true;
}
function getUserInfoFromDoc(doc) {
  let user = doc;
  let {
    hash,
    salt,
    refreshToken,
    resetPasswordKey,
    resetPasswordTime,
    confirmKey,
    confirmTime,
    emailToConfirm,
    confirmed,
    ...userData
  } = user;
  userData.email = replaceEmailToStar(userData.email);
  return userData;
}
function replaceEmailToStar(email) {
  let start;
  let length = email.length;
  let star = '*';
  if (length - 8 > 0) start = 5;
  else if (length - 6 > 0) start = 3;
  else if (length - 5 > 0) start = 2;
  else return email;
  let end = length - 3;
  for (let i = 1; i < end - start; i++) {
    star += '*';
  }
  return email.replace(email.slice(start, end), star);
}

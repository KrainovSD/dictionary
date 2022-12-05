import { signedCookies } from 'cookie-parser';
import config from '../config.js';

import User from '../models/Users.js';
/* 
1. StartLearnCategory: 
- не активная категория
- есть слова, хотябы одно
2. addCategory: 
- не повторяющееся имя
3. addWord: 
- не активная категория
- не повторяющиеся слово
4. updateCategory:
- не активная категория
- не менять имя на то которое есть
5. updateWord:
- не менять имя на то, которое есть
*/

export const startLearnCategory = async (req, res) => {
  try {
    let { id } = req.body;

    if (!id || typeof id != 'string' || id.trim()?.length == 0) {
      return res
        .status(400)
        .json({ message: `Не удалось выполнить операцию!` });
    }
    let user = await User.findOne({
      _id: req.userId,
      'wordsToStudy.category': id,
    });
    if (!user) {
      return res.status(400).json({
        message: `В категории нет слов!`,
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
      return res.status(400).json({ message: `Не удалось выполнить операцию` });
    }
    let userData = getUserInfoFromDoc(user.value._doc);
    res.json({ message: 'Операция успешно выполнена!', user: userData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};

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
        .json({ message: `Такое имя категории уже существует!` });
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
        message: `Не удалось выполнить операцию!`,
      });
    let userData = getUserInfoFromDoc(user.value._doc);

    res.json({ message: 'Операция успешно выполнена!', user: userData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
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
        message: `Не удалось выполнить операцию!`,
      });
    }
    let statusCategory = user.categoriesToLearn.filter(
      (item) => item._id == category
    );
    if (
      statusCategory?.length == 0 ||
      statusCategory?.[0]?.startLearn == true
    ) {
      return res.status(400).json({
        message: `Категория, в которую вы пытаетесь добавить слово, уже поставлена на изучение!`,
      });
    }
    let hasWord = user.wordsToStudy.filter((word) => word.word == word);
    if (hasWord?.length != 0) {
      return res.status(400).json({
        message: `Такое слово уже добавлено!`,
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
        message: `Не удалось выполнить операцию!`,
      });
    let userData = getUserInfoFromDoc(user.value._doc);
    res.json({ message: 'Операция успешно выполнена!', user: userData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    let { id, name, icon, regularityToRepeat } = req.body;
    let user = await User.findOne(
      {
        _id: req.userId,
      },
      {
        categoriesToLearn: {
          $elemMatch: { $and: [{ name: name }, { id: id }] },
        },
      }
    );
    console.log(user);
    if (!user) {
      return res
        .status(400)
        .json({ message: `Не удалось выполнить операцию!` });
    }

    /*
    let statusCategory = user.categoriesToLearn.filter((item) => item._id == id);
    if (statusCategory?.length == 0 || statusCategory?.[0]?.startLearn == true) {
      return res.status(400).json({
        message: `Категория уже поставлена на изучение!`,
      });
    }
    let similarName = user.categoriesToLearn.filter((item) => item.name == name);
    if (similarName?.length != 0 && similarName?.[0]?._id != id) {
      return res.status(400).json({
        message: `Такое имя категории уже существует!`,
      });
    }*/

    user = await User.findOneAndUpdate(
      {
        _id: req.userId,
        'categoriesToLearn._id': id,
      },
      {
        $set: {
          'categoriesToLearn.$.name': name,
          'categoriesToLearn.$.icon': icon,
          'categoriesToLearn.$.regularityToRepeat': regularityToRepeat,
        },
      },
      { new: true, rawResult: true }
    );
    if (user.ok == 0) {
      return res
        .status(400)
        .json({ message: `Не удалось выполнить операцию!` });
    }
    let userData = getUserInfoFromDoc(user.value._doc);
    res.json({ message: 'Операция успешно выполнена!', user: userData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};

export const updateWord = async (req, res) => {
  try {
    let { id, word, translate, transcription, description, example } = req.body;
    let irregularVerbs = checkIrregularVerbs(word);
    let hasWord = await User.findOne(
      {
        _id: req.userId,
      },
      { wordsToStudy: { $elemMatch: { word: word } } }
    );

    if (
      hasWord?.wordsToStudy?.length > 0 &&
      hasWord?.wordsToStudy?.[0]?._id != id
    ) {
      return res.status(400).json({
        message: `Такое слово уже добавлено!`,
      });
    }

    let user = await User.findOneAndUpdate(
      { _id: req.userId, 'wordsToStudy._id': id },
      {
        $set: {
          'wordsToStudy.$.word': word,
          'wordsToStudy.$.translate': translate,
          'wordsToStudy.$.transcription': transcription,
          'wordsToStudy.$.description': description,
          'wordsToStudy.$.example': example,
          'wordsToStudy.$.irregularVerbs': irregularVerbs,
        },
      },
      { new: true, rawResult: true }
    );
    if (user.ok == 0) {
      return res
        .status(400)
        .json({ message: `Не удалось выполнить операцию!` });
    }
    let userData = getUserInfoFromDoc(user.value._doc);
    res.json({ message: 'Операция успешно выполнена!', user: userData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    let { id } = req.params;

    if (!id || typeof id != 'string' || id.trim()?.length == 0) {
      return res
        .status(400)
        .json({ message: `Не удалось выполнить операцию!` });
    }

    let user = await User.findOneAndUpdate(
      { _id: req.userId, 'categoriesToLearn._id': id },
      {
        $pull: { categoriesToLearn: { _id: id } },
      },
      { new: true, rawResult: true }
    );
    if (user.ok == 0) {
      return res.status(400).json({
        message: `Не удалось выполнить операцию!`,
      });
    }
    let userData = getUserInfoFromDoc(user.value._doc);
    return res.json({ message: 'Операция успешно выполнена!', user: userData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};
export const deleteWord = async (req, res) => {
  try {
    let { id } = req.params;

    if (!id || typeof id != 'string' || id.trim()?.length == 0) {
      return res
        .status(400)
        .json({ message: `Не удалось выполнить операцию!` });
    }
    let user = await User.findOneAndUpdate(
      { _id: req.userId, 'wordsToStudy._id': id },
      {
        $pull: { wordsToStudy: { _id: id } },
      },
      { new: true, rawResult: true }
    );
    console.log(user);
    if (user.ok == 0) {
      return res.status(400).json({
        message: `Не удалось выполнить операцию!`,
      });
    }
    let userData = getUserInfoFromDoc(user.value._doc);
    return res.json({ message: 'Операция успешно выполнена!', user: userData });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};

export const addRelevance = async (req, res) => {
  try {
    let { words } = req.body;
    words = [...new Set(words)];
    /* Достаем из базы информацию о всех типах слов */
    let user = await User.findOne(
      { _id: req.userId },
      'knownWords wordsToStudy relevance'
    );
    if (!user)
      return res.status(400).json({
        message: `Не удалось выполнить операцию!`,
      });
    /*  Делаем из массива объектов массив только слов */
    let knownWords = Object.values(user?.knownWords).map((item) => item.word);
    let wordsToStudy = Object.values(user?.wordsToStudy).map(
      (item) => item.word
    );
    /* Находим уже имеюшиеся слова, которые добавлять не нужно*/
    let alreadyHaveWords = words.filter(
      (item) => knownWords.includes(item) || wordsToStudy.includes(item)
    );
    /* Находим уже имеющиеся в актуализаторе слова */
    let oldMeets = user?.relevance.filter(
      (item) => words.includes(item.word) && !alreadyHaveWords.includes(item)
    );
    /* Находим оставшиеся слова, которых нигде нет */
    words = words.filter(
      (item) =>
        !Object.values(oldMeets)
          .map((oldMeet) => oldMeet.word)
          .includes(item) && !alreadyHaveWords.includes(item)
    );
    /* Добавляем слова которых нигде нет*/

    let error = false;
    for (let item of words) {
      if (error) return;
      let result = await addNewRelevance(item, req.userId);
      if (!result) error = true;
    }
    /* Обновляем дату детекта уже имеющихся в актуализаторе слов */
    for (let item of oldMeets) {
      if (error) return;
      let result = await addOldRelevance(item._id, req.userId);
      if (!result) error = true;
    }

    /*Проверяем успешно ли добавились все слова */
    if (error)
      return res.status(400).json({
        message: `Не удалось выполнить операцию!`,
      });
    /*Получаем актуальный объект со всеми словами*/
    user = await User.findOne({ _id: req.userId });
    let userData = getUserInfoFromDoc(user._doc);
    /* Формируем сообщение */
    let message = 'Операция успешно завершена! ';
    if (words?.length > 0)
      message += `Новые слова, которые были добавлены: ${words.join(', ')}. `;
    if (oldMeets?.length > 0)
      message += `Слова с которыми вы уже встречались: ${Object.values(oldMeets)
        .map((item) => item.word)
        .join(', ')}. `;
    if (alreadyHaveWords?.length > 0)
      message += `Слова, которые не были добавлены, так как вы уже изучили/учите их: ${alreadyHaveWords.join(
        ', '
      )}. `;
    /* Приводим массив объектов к общему виду */
    words = words.map((item) => {
      return {
        word: item,
        dateOfCreation: Date.now(),
        dateOfDetected: [Date.now()],
        totalCountMeets: 1,
        countMeetsPerDays: 1,
      };
    });
    oldMeets = oldMeets.map((item) => {
      let millisecondsToDays = 1000 * 60 * 60 * 24;
      let maxDateCheckRelevance = userData?.options?.[0]?.maxDateCheckRelevance;
      let now = Date.now() / millisecondsToDays;
      let dateOfDetected = item?.dateOfDetected;
      dateOfDetected.push(Date.now());

      let totalCountMeets = dateOfDetected?.length;
      let countMeetsPerDays = dateOfDetected.filter(
        (date) => date / millisecondsToDays >= now - maxDateCheckRelevance
      );
      countMeetsPerDays = countMeetsPerDays?.length;

      return {
        word: item.word,
        dateOfCreation: item.dateOfCreation,
        dateOfDetected,
        totalCountMeets,
        countMeetsPerDays,
      };
    });
    words = [...words, ...oldMeets];
    res.json({
      message,
      user: userData,
      words,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};

async function addNewRelevance(word, userID) {
  try {
    let newRelevance = {
      word,
      dateOfCreation: Date.now(),
      dateOfDetected: [Date.now()],
    };

    let user = await User.updateOne(
      { _id: userID },
      {
        $push: { relevance: newRelevance },
      },
      { upsert: false }
    );
    if (user.modifiedCount == 0) return false;
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
async function addOldRelevance(id, userID) {
  try {
    let user = await User.updateOne(
      { _id: userID, 'relevance._id': id },
      {
        $push: {
          'relevance.$.dateOfDetected': Date.now(),
        },
      },
      { upsert: false }
    );
    if (user.modifiedCount == 0) return false;
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
function checkIrregularVerbs(word) {
  if (!/--/g.test(word)) return false;
  let words = word.split('--');
  if (words.length != 3) return false;
  return true;
}
function getUserInfoFromDoc(doc) {
  let user = doc;
  let {
    _id,
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

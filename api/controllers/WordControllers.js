import { signedCookies } from 'cookie-parser';

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
const countWordsToActiveCategory = 2;

export const startLearnCategory = async (req, res) => {
  try {
    let { id } = req.body;
    if (!id || typeof id != 'string' || id.trim()?.length == 0) {
      return res
        .status(400)
        .json({ message: `Не удалось выполнить операцию!` });
    }
    let user = await getUserInfo(req.userId, 'wordsToStudy categoriesToLearn');
    if (!user)
      return res
        .status(400)
        .json({ message: `Не удалось выполнить операцию!` });

    let index = user.categoriesToLearn.findIndex((item) => item._id == id);
    if (index == -1)
      return res.status(400).json({
        message: `Категории не существует!`,
      });

    let hasWordsInCategories = isHasWordsInCategories(id, user);
    if (!hasWordsInCategories)
      return res.status(400).json({
        message: `В категории меньше ${countWordsToActiveCategory} слов!`,
      });

    let activeCategory = isActiveCategory(id, user);
    if (activeCategory)
      return res
        .status(400)
        .json({ message: `Категория уже поставлена на обучение!` });

    let changeFields = {
      startLearn: true,
    };
    let userInfo = await setElement(
      'categoriesToLearn',
      id,
      changeFields,
      req.userId
    );
    if (!userInfo)
      return res
        .status(400)
        .json({ message: `Не удалось выполнить операцию!` });

    res.json({ message: 'Операция успешно выполнена!', user: userInfo });
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
      historyOfReverseRepeat: [],
      countOfRepeat: 0,
      countOfReverseRepeat: 0,
      startLearn: false,
    };

    let userInfo = await pushNewElement(
      'categoriesToLearn',
      newCategory,
      req.userId
    );
    if (!userInfo)
      return res.status(400).json({
        message: `Не удалось выполнить операцию!`,
      });

    res.json({ message: 'Операция успешно выполнена!', user: userInfo });
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
    let irregularVerb = checkIrregularVerb(word);
    if (irregularVerb) {
      word = fixIrregularVerb(word);
    }

    let user = await getUserInfo(
      req.userId,
      'categoriesToLearn knownWords wordsToStudy relevance'
    );
    if (!user) {
      return res.status(400).json({
        message: `Не удалось выполнить операцию!`,
      });
    }

    let statusCategory = isActiveCategory(category, user);
    if (statusCategory) {
      return res.status(400).json({
        message: `Категория, в которую вы пытаетесь добавить слово, уже поставлена на изучение!`,
      });
    }
    let hasWord = isAlreadyHasWord(word, null, user);
    if (hasWord) {
      return res.status(400).json({
        message: 'Такое слово уже на изучении или изучено!',
      });
    }
    let hasRelevance = isHasRelevance(word, user);
    if (hasRelevance) {
      let relevanceID = hasRelevance?.[0]?._id;
      let resultDelete = await pullElement(
        'relevance',
        relevanceID,
        req.userId
      );
      if (!resultDelete) {
        return res.status(400).json({
          message: `Не удалось выполнить операцию!`,
        });
      }
    }

    let newWord = {
      word: word,
      translate: translate,
      transcription: transcription,
      description: description,
      example: example,
      wrongs: 0,
      irregularVerb: irregularVerb,
      category: category,
    };

    let resultPush = await pushNewElement('wordsToStudy', newWord, req.userId);
    if (!resultPush)
      return res.status(400).json({
        message: `Не удалось выполнить операцию!`,
      });

    res.json({ message: 'Операция успешно выполнена!', user: resultPush });
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
    let user = await getUserInfo(req.userId, 'categoriesToLearn');
    if (!user)
      return res
        .status(400)
        .json({ message: `Не удалось выполнить операцию!` });

    let activeCategory = isActiveCategory(id, user);
    if (activeCategory)
      return res.status(400).json({
        message: `Категория уже поставлена на изучение!`,
      });
    let hasCategory = isHasCategory(name, id, user);
    if (hasCategory)
      return res.status(400).json({
        message: `Такое имя категории уже существует!`,
      });
    hasCategory = isHasCategory(name, null, user);
    if (!hasCategory)
      return res.status(400).json({
        message: `Категории не существует!`,
      });

    let changeFields = {
      name,
      icon,
      regularityToRepeat,
    };
    let userInfo = await setElement(
      'categoriesToLearn',
      id,
      changeFields,
      req.userId
    );
    if (!userInfo)
      return res
        .status(400)
        .json({ message: `Не удалось выполнить операцию!` });

    res.json({ message: 'Операция успешно выполнена!', user: userInfo });
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
    let irregularVerb = checkIrregularVerb(word);
    if (irregularVerb) word = fixIrregularVerb(word);

    let user = await getUserInfo(
      req.userId,
      'wordsToStudy knownWords relevance'
    );
    if (!user) {
      return res.status(400).json({
        message: `Не удалось выполнить операцию!`,
      });
    }

    let hasWord = isAlreadyHasWord(word, id, user);
    if (hasWord)
      return res.status(400).json({
        message: `Такое слово уже добавлено!`,
      });
    hasWord = isAlreadyHasWord(word, null, user);
    if (!hasWord)
      return res.status(400).json({
        message: `Слова не существует!`,
      });
    let hasRelevance = isHasRelevance(word, user);
    if (hasRelevance)
      return res.status(400).json({
        message: 'Такое слово находится в Актуализаторе!',
      });

    let changeFields = {
      word,
      translate,
      transcription,
      description,
      example,
      irregularVerb,
    };
    let userInfo = await setElement(
      'wordsToStudy',
      id,
      changeFields,
      req.userId
    );

    if (!userInfo)
      return res
        .status(400)
        .json({ message: `Не удалось выполнить операцию!` });

    res.json({ message: 'Операция успешно выполнена!', user: userInfo });
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

    if (!id || typeof id != 'string' || id.trim()?.length == 0)
      return res.status(400).json({ message: `Неверный тип ID!` });

    let user = await getUserInfo(req.userId, 'wordsToStudy categoriesToLearn');
    if (!user)
      return res
        .status(400)
        .json({ message: `Не удалось выполнить операцию!` });
    let wordsInCategory = user.wordsToStudy.filter(
      (item) => item.category == id
    );
    wordsInCategory = user.wordsToStudy.map((item) => item._id);

    let index = user.categoriesToLearn.findIndex((item) => item._id == id);
    if (index == -1)
      return res.status(400).json({
        message: `Категории не существует!`,
      });

    let userInfo = await pullElement('categoriesToLearn', id, req.userId);
    if (!userInfo)
      return res.status(400).json({
        message: `Не удалось выполнить операцию!`,
      });

    userInfo = await multiPullElement(
      'wordsToStudy',
      wordsInCategory,
      req.userId
    );
    if (!userInfo)
      return res.status(400).json({
        message: `Не удалось выполнить операцию!`,
      });
    return res.json({ message: 'Операция успешно выполнена!', user: userInfo });
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
      return res.status(400).json({ message: `Неверный тип ID!` });
    }
    let user = await getUserInfo(req.userId, 'wordsToStudy');
    if (!user)
      return res
        .status(400)
        .json({ message: `Не удалось выполнить операцию!` });

    let index = user.wordsToStudy.findIndex((item) => item._id == id);
    if (index == -1)
      return res.status(400).json({
        message: `Слова не существует!`,
      });

    let userInfo = await pullElement('wordsToStudy', id, req.userId);
    if (!userInfo)
      return res.status(400).json({
        message: `Не удалось выполнить операцию!`,
      });

    return res.json({ message: 'Операция успешно выполнена!', user: userInfo });
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
    let user = await getUserInfo(
      req.userId,
      'knownWords wordsToStudy relevance'
    );
    if (!user)
      return res.status(400).json({
        message: `Не удалось выполнить операцию!`,
      });

    /* Находим уже имеюшиеся слова, которые добавлять не нужно*/
    let hasWords = words.filter((item) => {
      let isHasWord = isAlreadyHasWord(item, null, user);
      if (!isHasWord) return false;
      return true;
    });
    /* Находим уже имеющиеся в актуализаторе слова */
    let hasRelevances = words.filter((item) => {
      let hasRelevance = isHasRelevance(item, user);
      if (!hasRelevance) return false;
      return true;
    });

    /* Находим оставшиеся слова, которых нигде нет */
    let newWords = words.filter(
      (item) => !hasWords.includes(item) && !hasRelevances.includes(item)
    );
    /* Добавляем слова которых нигде нет*/
    let newRelevances = newWords.map((item) => {
      let word = item;
      let irregularVerb = checkIrregularVerb(word);
      if (irregularVerb) {
        let word = fixIrregularVerb(word);
      }
      return {
        word,
        dateOfCreation: Date.now(),
        dateOfDetected: [Date.now()],
        irregularVerb,
      };
    });
    if (newRelevances?.length > 0) {
      let pushNewRelevances = await multiPushNewElement(
        'relevance',
        newRelevances,
        req.userId
      );
      if (!pushNewRelevances)
        return res.status(400).json({
          message: `Не удалось выполнить операцию!`,
        });
    }
    /* Обновляем дату детекта уже имеющихся в актуализаторе слов */
    if (hasRelevances?.length > 0) {
      let setOldRelevances = await multiSetOldRelevances(
        hasRelevances,
        req.userId
      );
      if (!setOldRelevances)
        return res.status(400).json({
          message: `Не удалось выполнить операцию!`,
        });
    }

    /* Формируем сообщение */
    let message = 'Операция успешно завершена! ';
    if (newWords?.length > 0)
      message += `Новые слова, которые были добавлены: ${newWords.join(
        ', '
      )}. `;
    if (hasRelevances?.length > 0)
      message += `Слова с которыми вы уже встречались: ${hasRelevances.join(
        ', '
      )}. `;
    if (hasWords?.length > 0)
      message += `Слова, которые не были добавлены, так как вы уже изучили/учите их: ${hasWords.join(
        ', '
      )}. `;
    /*Получаем актуальный объект со всеми словами*/
    user = await User.findOne({ _id: req.userId });
    let userInfo = getUserInfoFromDoc(user._doc);
    /* Приводим массив объектов к общему виду */
    newWords = newWords.map((item) => {
      return {
        word: item,
        totalCountMeets: 1,
        countMeetsPerDays: 1,
      };
    });
    hasRelevances = hasRelevances.map((oldRelevance) => {
      let millisecondsToDays = 1000 * 60 * 60 * 24;
      let now = Date.now() / millisecondsToDays;

      let word = user?.relevance.filter((item) => item.word == oldRelevance)[0];
      let totalCountMeets = word?.dateOfDetected?.length;

      let maxDateCheckRelevance = user?.options?.[0]?.maxDateCheckRelevance;
      let countMeetsPerDays = word?.dateOfDetected.filter(
        (date) => date / millisecondsToDays >= now - maxDateCheckRelevance
      );
      countMeetsPerDays = countMeetsPerDays?.length;

      return {
        word: oldRelevance,
        totalCountMeets,
        countMeetsPerDays,
      };
    });
    let addedWords = [...newWords, ...hasRelevances];

    res.json({
      message,
      user: userInfo,
      words: addedWords,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};

/* MONGO OPERATION */
async function getUserInfo(userID, showFields = '') {
  try {
    let user = await User.findOne(
      {
        _id: userID,
      },
      `${showFields}`
    );
    if (!user) return false;
    return user._doc;
  } catch (err) {
    console.log(err);
    return false;
  }
}
async function pushNewElement(field, newElement, userID) {
  try {
    let query = { _id: userID };
    let action = { $push: { [`${field}`]: newElement } };
    let option = { new: true, rawResult: true };

    let user = await User.findOneAndUpdate(query, action, option);
    if (user.ok == 0) return false;
    let userInfo = getUserInfoFromDoc(user.value._doc);
    return userInfo;
  } catch (err) {
    console.log(err);
    return false;
  }
}
async function multiPushNewElement(field, newElements, userID) {
  try {
    let query = { _id: userID };
    let action = {
      $push: {
        [`${field}`]: {
          $each: newElements,
        },
      },
    };
    let option = { new: true, rawResult: true };

    let user = await User.findOneAndUpdate(query, action, option);
    if (user.ok == 0) return false;
    let userInfo = getUserInfoFromDoc(user.value._doc);
    return userInfo;
  } catch (err) {
    console.log(err);
    return false;
  }
}
async function pullElement(field, elementID, userID) {
  try {
    let query = { _id: userID };
    let action = { $pull: { [field]: { _id: elementID } } };
    let option = { new: true, rawResult: true };

    let user = await User.findOneAndUpdate(query, action, option);

    if (user.ok == 0) {
      return false;
    }
    let userInfo = getUserInfoFromDoc(user.value._doc);
    return userInfo;
  } catch (err) {
    console.log(err);
    return false;
  }
}
async function multiPullElement(field, elementsID, userID) {
  try {
    let query = { _id: userID };
    let action = {
      $pull: {
        [field]: { _id: { $in: elementsID } },
      },
    };
    let option = { new: true, rawResult: true };

    let user = await User.findOneAndUpdate(query, action, option);
    if (user.ok == 0) {
      return false;
    }
    let userInfo = getUserInfoFromDoc(user.value._doc);
    return userInfo;
  } catch (err) {
    console.log(err);
    return false;
  }
}
async function setElement(field, elementID, changeFields, userID) {
  try {
    let setOption = {};
    Object.keys(changeFields).forEach((key) => {
      setOption[`${field}.$.${key}`] = changeFields[key];
    });

    let query = { _id: userID, [`${field}._id`]: elementID };
    let action = { $set: setOption };
    let option = { new: true, rawResult: true };

    let user = await User.findOneAndUpdate(query, action, option);
    if (user.ok == 0) {
      return false;
    }
    let userInfo = getUserInfoFromDoc(user.value._doc);
    return userInfo;
  } catch (err) {
    console.log(err);
    return false;
  }
}
// [{elementID: 'dsdsd', changeFields: { name: 'role'}}, ]
async function multiSetElement(field, multiSetOptions, userID) {
  try {
    let success = true;
    for (let multiSetOption of multiSetOptions) {
      if (!success) return;
      let setOption = {};
      for (let key in multiSetOption?.changeFields) {
        setOption[`${field}.$.${key}`] = multiSetOption?.changeFields[key];
      }
      console.log(setOption);
      let query = { _id: userID, [`${field}._id`]: multiSetOption?.elementID };
      let action = { $set: setOption };
      let option = { upsert: false };

      let user = await User.updateOne(query, action, option);
      if (user.modifiedCount == 0) {
        success = false;
      }
    }
    if (success) {
      success = await User.findOne({ _id: userID });
      success = getUserInfoFromDoc(success._doc);
    }
    return success;
  } catch (err) {
    console.log(err);
    return false;
  }
}
/* RELEVANCE OPERATION */
async function multiSetOldRelevances(words, userID) {
  try {
    let success = true;
    for (let word of words) {
      if (!success) return;
      let query = { _id: userID, 'relevance.word': word };
      let action = {
        $push: {
          'relevance.$.dateOfDetected': Date.now(),
        },
      };
      let option = { upsert: false };

      let user = await User.updateOne(query, action, option);
      if (user.modifiedCount == 0) success = false;
    }
    return success;
  } catch (err) {
    console.log(err);
    return false;
  }
}

/* GET ALLOWED FIELDS */
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

/* VALIDATION */
function checkIrregularVerb(word) {
  if (!/--/g.test(word)) return false;
  let words = word.split('--');
  if (words.length != 3) return false;
  return true;
}
function fixIrregularVerb(word) {
  let irregularVerbs = word.split('--');
  irregularVerbs = irregularVerbs.map((item) => item.trim().toLowerCase());
  return irregularVerbs.join('--');
}
function isAlreadyHasWord(word, id, userInfo) {
  let allWords = [...userInfo.wordsToStudy, ...userInfo.knownWords];
  let hasWord = allWords.filter((wordItem) => {
    if (checkIrregularVerb(word)) {
      let irregularVerbs = word.split('--');
      irregularVerbs = irregularVerbs.map((item) => item.toLowerCase().trim());
      if (wordItem.irregularVerb == false)
        return irregularVerbs.includes(wordItem.word) && wordItem._id != id;
      return wordItem.word == word && wordItem._id != id;
    }
    if (wordItem.irregularVerb == false)
      return wordItem.word == word && wordItem._id != id;

    let irregularVerbs = wordItem.word.split('--');
    irregularVerbs = irregularVerbs.map((item) => item.toLowerCase().trim());
    return irregularVerbs.includes(word) && wordItem._id != id;
  });
  if (hasWord?.length != 0) {
    return true;
  }
  return false;
}
function isHasRelevance(word, userInfo) {
  let hasRelevance = userInfo?.relevance.filter((relevanceItem) => {
    if (relevanceItem.irregularVerb == false) return relevanceItem.word == word;
    let irregularVerbs = relevanceItem.word.split('--');
    irregularVerbs = irregularVerbs.map((item) => item.toLowerCase().trim());
    return irregularVerbs.includes(word);
  });
  if (hasRelevance?.length != 0) {
    return hasRelevance;
  }
  return false;
}
function isActiveCategory(id, userInfo) {
  let statusCategory = userInfo.categoriesToLearn.filter(
    (item) => item._id == id
  );
  if (statusCategory?.[0]?.startLearn == true) {
    return true;
  }
  return false;
}
function isHasWordsInCategories(id, userInfo) {
  let hasWordsInCategories = userInfo?.wordsToStudy.filter(
    (item) => item.category == id
  );
  if (hasWordsInCategories.length < countWordsToActiveCategory) return false;
  return true;
}
function isHasCategory(name, id, userInfo) {
  let hasCategory = userInfo?.categoriesToLearn.filter(
    (item) => item.name == name && item._id != id
  );
  if (hasCategory.length == 0) return false;
  return true;
}

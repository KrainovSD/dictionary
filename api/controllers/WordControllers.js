import { signedCookies } from 'cookie-parser';

import User from '../models/Users.js';
import { message } from './UserControllers.js';
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
    if (!id || typeof id != 'string' || id.trim()?.length == 0)
      return sendResponseError(req, res);

    let user = await getUserInfo(req.userId, 'wordsToStudy categoriesToLearn');
    if (!user) return sendResponseError(req, res);

    let index = user.categoriesToLearn.findIndex((item) => item._id == id);
    if (index == -1)
      return sendResponseError(req, res, 'Категории не существует!');

    let hasWordsInCategories = isHasWordsInCategories(id, user);
    if (!hasWordsInCategories)
      return sendResponseError(
        req,
        res,
        `В категории меньше ${countWordsToActiveCategory} слов!`
      );

    let activeCategory = isActiveCategory(id, user);
    if (activeCategory)
      return sendResponseError(
        req,
        res,
        'Категория уже поставлена на обучение!'
      );

    let changeFields = {
      startLearn: true,
      dateOfStartLearn: Date.now(),
    };
    let userInfo = await setElement(
      'categoriesToLearn',
      id,
      changeFields,
      req.userId
    );
    if (!userInfo) return sendResponseError(req, res);

    res.json({ message: 'Операция успешно выполнена!', user: userInfo });
  } catch (err) {
    req.err = err;
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
    if (user)
      return sendResponseError(req, res, 'Имя категории уже существует!');

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
      dateOfStartLearn: 0,
    };

    let userInfo = await pushNewElement(
      'categoriesToLearn',
      newCategory,
      req.userId
    );
    if (!userInfo) return sendResponseError(req, res);

    res.json({ message: 'Операция успешно выполнена!', user: userInfo });
  } catch (err) {
    req.err = err;
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
    if (!user) return sendResponseError(req, res);

    let statusCategory = isActiveCategory(category, user);
    if (statusCategory)
      return sendResponseError(
        req,
        res,
        'Категория, в которую вы пытаетесь добавить слово, уже поставлена на изучение!'
      );

    let hasWord = isAlreadyHasWord(word, null, user);
    if (hasWord)
      return sendResponseError(
        req,
        res,
        'Такое слово уже на изучении или изучено!'
      );

    let hasRelevance = isHasRelevance(word, user);
    if (hasRelevance) {
      let relevanceID = hasRelevance?.[0]?._id;
      let resultDelete = await pullElement(
        'relevance',
        relevanceID,
        req.userId
      );
      if (!resultDelete) return sendResponseError(req, res);
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
    if (!resultPush) return sendResponseError(req, res);

    res.json({ message: 'Операция успешно выполнена!', user: resultPush });
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};

export const updateCategory = async (req, res) => {
  try {
    let { id, name, icon, regularityToRepeat } = req.body;
    let user = await getUserInfo(req.userId, 'categoriesToLearn');
    if (!user) return sendResponseError(req, res);

    let activeCategory = isActiveCategory(id, user);
    if (activeCategory)
      return sendResponseError(
        req,
        res,
        'Категория уже поставлена на изучение!'
      );

    let hasCategory = isHasCategory(name, id, user);
    if (hasCategory)
      return sendResponseError(req, res, 'Имя категории уже существует!');

    let index = user.categoriesToLearn.findIndex((item) => item._id == id);
    if (index == -1)
      return sendResponseError(req, res, 'Категории не существует!');

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
    if (!userInfo) return sendResponseError(req, res);

    res.json({ message: 'Операция успешно выполнена!', user: userInfo });
  } catch (err) {
    req.err = err;
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
    if (!user) return sendResponseError(req, res);

    let hasWord = isAlreadyHasWord(word, id, user);
    if (hasWord)
      return sendResponseError(req, res, 'Такое слово уже добавлено!');

    let index = user.wordsToStudy.findIndex((item) => item._id == id);
    if (index == -1) return sendResponseError(req, res, 'Слова не существует!');

    let hasRelevance = isHasRelevance(word, user);
    if (hasRelevance)
      return sendResponseError(
        req,
        res,
        'Такое слово находится в актуализаторе!'
      );

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

    if (!userInfo) return sendResponseError(req, res);

    res.json({ message: 'Операция успешно выполнена!', user: userInfo });
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};

export const deleteCategory = async (req, res) => {
  try {
    let { id } = req.params;

    if (!id || typeof id != 'string' || id.trim()?.length == 0)
      return sendResponseError(req, res, 'Неверный тип ID');

    let user = await getUserInfo(req.userId, 'wordsToStudy categoriesToLearn');
    if (!user) return sendResponseError(req, res);

    let wordsInCategory = user.wordsToStudy.filter(
      (item) => item.category == id
    );

    wordsInCategory = wordsInCategory.map((item) => item._id);

    let index = user.categoriesToLearn.findIndex((item) => item._id == id);
    if (index == -1)
      return sendResponseError(req, res, 'Категории не существует!');

    let userInfo = await pullElement('categoriesToLearn', id, req.userId);
    if (!userInfo) return sendResponseError(req, res);

    userInfo = await multiPullElement(
      'wordsToStudy',
      wordsInCategory,
      req.userId
    );
    if (!userInfo) return sendResponseError(req, res);

    return res.json({ message: 'Операция успешно выполнена!', user: userInfo });
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};
export const deleteWord = async (req, res) => {
  try {
    let { id } = req.body;

    let user = await getUserInfo(
      req.userId,
      'wordsToStudy categoriesToLearn knownWords'
    );
    if (!user) return sendResponseError(req, res);

    let knownWordsID = [];
    let studyWordsID = [];
    for (let item of id) {
      let index = user.knownWords.findIndex((word) => word._id == item);
      if (index != -1) {
        knownWordsID.push(item);
      }
    }
    for (let item of id) {
      let index = user.wordsToStudy.findIndex((word) => word._id == item);
      if (index != -1) {
        studyWordsID.push(item);
      }
    }

    let activeCategoriesID = user.categoriesToLearn.filter(
      (item) => item.startLearn == true
    );
    activeCategoriesID = activeCategoriesID.map((item) => item._id);
    let studyWordsInfo = user.wordsToStudy.filter((item) =>
      studyWordsID.includes(item._id)
    );
    let wordsInActiveCategory = studyWordsInfo.filter((item) =>
      activeCategoriesID.includes(item.category)
    );
    if (wordsInActiveCategory.length > 0)
      return sendResponseError(req, res, 'Слово в активной категории!');

    if (knownWordsID.lenght == 0 && studyWordsID.length == 0)
      return sendResponseError(req, res, 'Нет выбранных слов!');

    let userInfo;
    if (knownWordsID.length > 0) {
      userInfo = await multiPullElement('knownWords', knownWordsID, req.userId);
      if (!userInfo) return sendResponseError(req, res);
    }
    if (studyWordsID.length > 0) {
      userInfo = await multiPullElement(
        'wordsToStudy',
        studyWordsID,
        req.userId
      );
      if (!userInfo) return sendResponseError(req, res);
    }

    return res.json({ message: 'Операция успешно выполнена!', user: userInfo });
  } catch (err) {
    req.err = err;
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
    if (!user) return sendResponseError(req, res);

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
      if (!pushNewRelevances) return sendResponseError(req, res);
    }
    /* Обновляем дату детекта уже имеющихся в актуализаторе слов */
    if (hasRelevances?.length > 0) {
      let setOldRelevances = await multiSetOldRelevances(
        hasRelevances,
        req.userId
      );
      if (!setOldRelevances) return sendResponseError(req, res);
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
      let now = millisecondsToDays(Date.now());

      let word = user?.relevance.filter((item) => item.word == oldRelevance)[0];
      let totalCountMeets = word?.dateOfDetected?.length;

      let maxDateCheckRelevance = user?.options?.[0]?.maxDateCheckRelevance;
      let countMeetsPerDays = word?.dateOfDetected.filter(
        (date) => millisecondsToDays(date) >= now - maxDateCheckRelevance
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
    req.err = err;
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};

export const learnAnswer = async (req, res) => {
  try {
    /* Получение данных от пользователя и информации о пользователе */
    let { categoryID, words } = req.body;
    let user = await getUserInfo(req.userId, 'categoriesToLearn wordsToStudy');
    if (!user) return sendResponseError(req, res);
    let wordsWithWrong = words.filter((item) => {
      if (item.wrong && typeof item?.wrong == 'boolean') return true;
      return false;
    });
    wordsWithWrong = wordsWithWrong.map((item) => item.word);
    wordsWithWrong = user.wordsToStudy.filter((item) =>
      wordsWithWrong.includes(item._id.toString())
    );
    let studiedCategory = [];
    let wrongsCategory = [];
    let successCategory = [];
    let message = '';
    for (let id of categoryID) {
      /* Проверка на сущесвтование категории */
      let index = user.categoriesToLearn.findIndex((item) => {
        return item._id.toString() == id;
      });
      if (index == -1)
        return sendResponseError(req, res, `Категории не существует!`);
      let category = user.categoriesToLearn[index];
      let categoryName = category.name;
      /* Проверка на активность категории */
      let activeCategory = isActiveCategory(id, user);
      if (!activeCategory)
        return sendResponseError(
          req,
          res,
          `Категория ${categoryName} не активна!`
        );
      /* Проверка на актуальность повторения */
      let nextRepeat = millisecondsToDays(category.nextRepeat);
      if (millisecondsToDays(Date.now()) < nextRepeat)
        return sendResponseError(
          req,
          res,
          `День повторения категории ${categoryName} не наступил! Прогресс не будет сохранен!`
        );
      /* Проверка на ошибки в словах */
      let currentWordsWithWrongs = wordsWithWrong.filter(
        (item) => item.category == id
      );
      if (currentWordsWithWrongs.length > 0) {
        wrongsCategory.push(id);
        currentWordsWithWrongs = currentWordsWithWrongs.map(
          (item) => item.word
        );
        currentWordsWithWrongs = currentWordsWithWrongs.join(', ');
        message += `Категория ${categoryName}: В словах были допущены ошибки, повторение не засчитано, попробуйте еще раз! В следуюших словах была допущена ошибка: ${currentWordsWithWrongs}!\n\n `;
        continue;
      }
      /* Проверка на количество повторений категории */
      let countOfRepeat = category.countOfRepeat + 1;
      let countOfReverseRepeat = category.countOfReverseRepeat;
      if (countOfRepeat >= 13 && countOfReverseRepeat >= 13) {
        studiedCategory.push(id);
        message += `Категория ${categoryName}: успешно изучена и удалена! Все слова перенесены во вкладку 'Изученные'!\n\n`;
        continue;
      }
      if (countOfRepeat > 13) {
        message += `Категория ${categoryName}: Вы достигли необходимого количества обычных повторений! Чтобы слова переместились в категорию изученных, вам требуется достигнуть необходимого количества реверсивных повторений!\n\n`;
        continue;
      }
      /* Сбор новых параметров категории*/
      let nextPattern;
      if (countOfRepeat == 13) nextPattern = daysToMilliseconds(365);
      else {
        nextPattern = daysToMilliseconds(
          category.regularityToRepeat[countOfRepeat - 1]
        );
      }
      let historyOfRepeat = category.historyOfRepeat;
      historyOfRepeat.push(Date.now());
      let changeFields = {
        lastRepeat: Date.now(),
        countOfRepeat,
        nextRepeat: nextPattern + Date.now(),
        historyOfRepeat,
      };
      successCategory.push({ elementID: id, changeFields });
      if (countOfRepeat == 13)
        message += `Категория ${categoryName}: Вы достигли необходимого количества обычных повторений! Чтобы слова переместились в категорию изученных, вам требуется достигнуть необходимого количества реверсивных повторений!\n\n`;
      else
        message += `Категория ${categoryName}: Обычное повторение категории успешно завершено!\n\n`;
    }

    if (studiedCategory.length > 0) {
      let res = await pullStudiedCategory(req, studiedCategory);
      if (!res) return sendResponseError(req, res);
    }
    if (successCategory.length > 0) {
      let res = await multiSetElement(
        'categoriesToLearn',
        successCategory,
        req.userId
      );
      if (!res) return sendResponseError(req, res);
    }
    if (wordsWithWrong.length > 0) {
      let res = await pushWrongsInWords(wordsWithWrong, 'wordsToStudy', req);
      if (!res.status) return sendResponseError(req, res, pushWrongs.message);
      message += res.message;
    }
    let checkStreak = await isSuccessStreak(req.userId);
    if (checkStreak.ok) {
      message += '\nПоздравляем, непрерывная серия повторения была увеличена!';
    }
    if (checkStreak.resetStreak) {
      message += '\nК сожалению, серия повторения была прервана!';
    }
    let userInfo = await User.findOne({ _id: req.userId });
    if (!userInfo) return sendResponseError(req, res);
    userInfo = getUserInfoFromDoc(userInfo._doc);

    return res.json({
      message,
      user: userInfo,
    });
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};
export const reLearnAnswer = async (req, res) => {
  try {
    /* Получение данных от пользователя и информации о пользователе */
    let { categoryID, words } = req.body;
    let user = await getUserInfo(req.userId, 'categoriesToLearn wordsToStudy');
    if (!user) return sendResponseError(req, res);
    let wordsWithWrong = words.filter((item) => {
      if (item.wrong && typeof item?.wrong == 'boolean') return true;
      return false;
    });
    wordsWithWrong = wordsWithWrong.map((item) => item.word);
    wordsWithWrong = user.wordsToStudy.filter((item) =>
      wordsWithWrong.includes(item._id.toString())
    );
    let studiedCategory = [];
    let wrongsCategory = [];
    let successCategory = [];
    let message = '';
    for (let id of categoryID) {
      /* Проверка на сущесвтование категории */
      let index = user.categoriesToLearn.findIndex((item) => {
        return item._id.toString() == id;
      });
      if (index == -1)
        return sendResponseError(req, res, `Категории не существует!`);
      let category = user.categoriesToLearn[index];
      let categoryName = category.name;
      /* Проверка на активность категории */
      let activeCategory = isActiveCategory(id, user);
      if (!activeCategory)
        return sendResponseError(
          req,
          res,
          `Категория ${categoryName} не активна!`
        );
      /* Проверка на актуальность повторения */
      let nextReverseRepeat = millisecondsToDays(category.nextReverseRepeat);
      if (millisecondsToDays(Date.now()) < nextReverseRepeat)
        return sendResponseError(
          req,
          res,
          `День повторения категории ${categoryName} не наступил! Прогресс не будет сохранен!`
        );
      /* Проверка на ошибки в словах */
      let currentWordsWithWrongs = wordsWithWrong.filter(
        (item) => item.category == id
      );
      if (currentWordsWithWrongs.length > 0) {
        wrongsCategory.push(id);
        currentWordsWithWrongs = currentWordsWithWrongs.map(
          (item) => item.word
        );
        currentWordsWithWrongs = currentWordsWithWrongs.join(', ');
        message += `Категория ${categoryName}: В словах были допущены ошибки, повторение не засчитано, попробуйте еще раз! В следуюших словах была допущена ошибка: ${currentWordsWithWrongs}!\n\n `;
        continue;
      }
      /* Проверка на количество повторений категории */
      let countOfRepeat = category.countOfRepeat;
      let countOfReverseRepeat = category.countOfReverseRepeat + 1;
      if (countOfRepeat >= 13 && countOfReverseRepeat >= 13) {
        studiedCategory.push(id);
        message += `Категория ${categoryName}: Успешно изучена и удалена! Все слова перенесены во вкладку 'Изученные'!\n\n`;
        continue;
      }
      if (countOfReverseRepeat > 13) {
        message += `Категория ${categoryName}: Вы достигли необходимого количества реверсивных повторений! Чтобы слова переместились в категорию изученных, вам требуется достигнуть необходимого количества обычных повторений!\n\n`;
        continue;
      }
      /* Сбор новых параметров категории*/
      let nextPattern;
      if (countOfReverseRepeat == 13) nextPattern = daysToMilliseconds(365);
      else {
        nextPattern = daysToMilliseconds(
          category.regularityToRepeat[countOfReverseRepeat - 1]
        );
      }
      let historyOfReverseRepeat = category.historyOfReverseRepeat;
      historyOfReverseRepeat.push(Date.now());
      let changeFields = {
        lastReverseRepeat: Date.now(),
        countOfReverseRepeat,
        nextReverseRepeat: nextPattern + Date.now(),
        historyOfReverseRepeat,
      };
      successCategory.push({ elementID: id, changeFields });
      if (countOfReverseRepeat == 13)
        message += `Категория ${categoryName}: Вы достигли необходимого количества реверсивных повторений! Чтобы слова переместились в категорию изученных, вам требуется достигнуть необходимого количества обычных повторений!\n\n`;
      else
        message += `Категория ${categoryName}: Реверсивное повторение категории успешно завершено!\n\n`;
    }

    if (studiedCategory.length > 0) {
      let res = await pullStudiedCategory(req, studiedCategory);
      if (!res) return sendResponseError(req, res);
    }
    if (successCategory.length > 0) {
      let res = await multiSetElement(
        'categoriesToLearn',
        successCategory,
        req.userId
      );
      if (!res) return sendResponseError(req, res);
    }
    if (wordsWithWrong.length > 0) {
      let res = await pushWrongsInWords(wordsWithWrong, 'wordsToStudy', req);
      if (!res.status) return sendResponseError(req, res, pushWrongs.message);
      message += res.message;
    }
    let checkStreak = await isSuccessStreak(req.userId);
    if (checkStreak.ok) {
      message += '\nПоздравляем, непрерывная серия повторения была увеличена!';
    } else if (checkStreak.resetStreak) {
      message += '\nК сожалению, серия повторения была прервана!';
    }
    let userInfo = await User.findOne({ _id: req.userId });
    if (!userInfo) return sendResponseError(req, res);
    userInfo = getUserInfoFromDoc(userInfo._doc);

    return res.json({
      message,
      user: userInfo,
    });
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};
const pullStudiedCategory = async (req, categoryID) => {
  try {
    /* Сбор информации о пользователе и ID категории */
    let user = await getUserInfo(
      req.userId,
      'categoriesToLearn wordsToStudy knownWords'
    );
    if (!user) return false;
    /* Проверка нет ли слов из категории во вкладке Изученные */
    let words = user.wordsToStudy.filter((item) =>
      categoryID.includes(item.category)
    );
    let wordsName = words.map((item) => item.word);
    let knownWords = user.knownWords.filter((item) =>
      wordsName.includes(item.word)
    );
    if (knownWords.length > 0) return false;
    /* Удаление категории */
    let userInfo = await multiPullElement(
      'categoriesToLearn',
      categoryID,
      req.userId
    );
    if (!userInfo) return false;

    /* Удаление слов из категории Изучаемые */
    let wordsID = words.map((item) => item._id);
    userInfo = await multiPullElement('wordsToStudy', wordsID, req.userId);
    if (!userInfo) return false;
    /* Добавление слов в категорию Изученные */
    let newWords = words.map((item) => {
      return {
        word: item.word,
        translate: item.translate,
        transcription: item.transcription,
        description: item.description,
        example: item.example,
        wrongs: item.wrongs,
        irregularVerb: item.irregularVerb,
        _id: item._id,
        dateOfKnown: Date.now(),
        lastRepeat: 0,
        lastReverseRepeat: 0,
        historyOfRepeat: [],
        historyOfReverseRepeat: [],
      };
    });
    userInfo = await multiPushNewElement('knownWords', newWords, req.userId);
    if (!userInfo) return false;

    return true;
  } catch (err) {
    req.err = err;
    return false;
  }
};
export const knownAnswer = async (req, res) => {
  try {
    /* Сбор информации о пользователе и списке слов */
    let { words } = req.body;
    let message = 'Слова успешно повторены!\n';
    let user = await getUserInfo(req.userId, 'knownWords statistics');
    if (!user) return sendResponseError(req, res);
    /* Обработка слов с ошибками */
    let wordsWithWrong = words.filter((item) => {
      if (item.wrong && typeof item?.wrong == 'boolean') return true;
      return false;
    });
    if (wordsWithWrong.length > 0) {
      wordsWithWrong = wordsWithWrong.map((item) => item.word);
      wordsWithWrong = user.knownWords.filter((item) =>
        wordsWithWrong.includes(item._id.toString())
      );
      let pushWords = await pushWrongsInWords(
        wordsWithWrong,
        'knownWords',
        req
      );
      wordsWithWrong = wordsWithWrong.map((item) => item.word);
      wordsWithWrong = wordsWithWrong.join(', ');
      message += `В следуюших словах была допущена ошибка: ${wordsWithWrong}! Прогресс слов, в которых допущена ошибка, не изменяется!\n`;
      if (!pushWords.status)
        return sendResponseError(req, res, pushWords.message);
      if (pushWords.message.length > 0) message += `${pushWords.message}`;
    }
    /* Изменение статуса последнего повторения */
    words = words.filter((item) => !item.wrong);

    let historyOfRepeatKnownWords =
      user.statistics[0].historyOfRepeatKnownWords;
    historyOfRepeatKnownWords.push(Date.now());
    let updateStatistic = await User.findOneAndUpdate(
      { _id: req.userId },
      {
        $set: {
          [`statistics.0.lastRepeatKnownWords`]: Date.now(),
          [`statistics.0.historyOfRepeatKnownWords`]: historyOfRepeatKnownWords,
        },
      },
      { new: true, rawResult: true }
    );
    if (updateStatistic.ok == 0) return sendResponseError(req, res);
    /* Получение новых параметров слов */
    words = words.map((item) => item.word);
    let multiSetOptions = [];
    for (let word of words) {
      let elementID = word;
      let index = user.knownWords.findIndex((item) => item._id == word);
      if (index == -1) continue;
      let historyOfRepeat = user.knownWords[index].historyOfRepeat;
      historyOfRepeat.push(Date.now());

      let changeFields = {
        lastRepeat: Date.now(),
        historyOfRepeat,
      };

      multiSetOptions.push({ elementID, changeFields });
    }
    /* Установка новых параметров слов */
    let userInfo = await multiSetElement(
      'knownWords',
      multiSetOptions,
      req.userId
    );
    if (!userInfo) return sendResponseError(req, res);

    let checkStreak = await isSuccessStreak(req.userId);
    if (checkStreak.ok) {
      message += '\nПоздравляем, непрерывная серия повторения была увеличена!';
      userInfo = checkStreak.userInfo;
    }
    if (checkStreak.resetStreak) {
      userInfo = await User.findOne({ _id: req.userId });
      if (!userInfo) return sendResponseError(req, res);
      userInfo = getUserInfoFromDoc(userInfo._doc);
      message += '\nК сожалению, серия повторения была прервана!';
    }

    res.json({ message, user: userInfo });
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};
export const reKnownAnswer = async (req, res) => {
  try {
    /* Сбор информации о пользователе и списке слов */
    let { words } = req.body;
    let message = 'Слова успешно повторены!\n';
    let user = await getUserInfo(req.userId, 'knownWords statistics');
    if (!user) return sendResponseError(req, res);
    /* Обработка слов с ошибками */
    let wordsWithWrong = words.filter(
      (item) => item.wrong && typeof item?.wrong == 'boolean'
    );
    if (wordsWithWrong.length > 0) {
      wordsWithWrong = wordsWithWrong.map((item) => item.word);
      wordsWithWrong = user.knownWords.filter((item) =>
        wordsWithWrong.includes(item._id.toString())
      );
      let pushWords = await pushWrongsInWords(
        wordsWithWrong,
        'knownWords',
        req
      );
      wordsWithWrong = wordsWithWrong.map((item) => item.word);
      wordsWithWrong = wordsWithWrong.join(', ');
      message += `В следуюших словах была допущена ошибка: ${wordsWithWrong}! Прогресс слов, в которых допущена ошибка, не изменяется!\n`;
      if (!pushWords.status)
        return sendResponseError(req, res, pushWords.message);
      if (pushWords.message.length > 0) message += `${pushWords.message}`;
    }
    /* Изменение статуса последнего повторения */
    words = words.filter((item) => !item.wrong);

    let historyOfReverseRepeatKnownWords =
      user.statistics[0].historyOfReverseRepeatKnownWords;
    historyOfReverseRepeatKnownWords.push(Date.now());
    let updateStatistic = await User.findOneAndUpdate(
      { _id: req.userId },
      {
        $set: {
          [`statistics.0.lastReverseRepeatKnownWords`]: Date.now(),
          [`statistics.0.historyOfReverseRepeatKnownWords`]:
            historyOfReverseRepeatKnownWords,
        },
      },
      { new: true, rawResult: true }
    );
    if (updateStatistic.ok == 0) return sendResponseError(req, res);
    /* Получение новых параметров слов */
    words = words.map((item) => item.word);
    let multiSetOptions = [];
    for (let word of words) {
      let elementID = word;
      let index = user.knownWords.findIndex((item) => item._id == word);
      if (index == -1) continue;
      let historyOfReverseRepeat =
        user.knownWords[index].historyOfReverseRepeat;
      historyOfReverseRepeat.push(Date.now());

      let changeFields = {
        lastReverseRepeat: Date.now(),
        historyOfReverseRepeat,
      };

      multiSetOptions.push({ elementID, changeFields });
    }
    /* Установка новых параметров слов */
    let userInfo = await multiSetElement(
      'knownWords',
      multiSetOptions,
      req.userId
    );
    if (!userInfo) return sendResponseError(req, res);

    let checkStreak = await isSuccessStreak(req.userId);
    if (checkStreak.ok) {
      message += '\nПоздравляем, непрерывная серия повторения была увеличена!';
      userInfo = checkStreak.userInfo;
    }
    if (checkStreak.resetStreak) {
      userInfo = await User.findOne({ _id: req.userId });
      if (!userInfo) return sendResponseError(req, res);
      userInfo = getUserInfoFromDoc(userInfo._doc);
      message += '\nК сожалению, серия повторения была прервана!';
    }

    res.json({ message, user: userInfo });
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};
export const repeatAnswer = async (req, res) => {
  try {
    /* Получение информации о пользователе и списке слов */
    let { words } = req.body;
    let message = 'Обучение пройдено успешно!\n';
    let user = await getUserInfo(req.userId, 'wordsToRepeat options');
    if (!user) return sendResponseError(req, res);
    /* Обработка слов с ошибками */
    let wordsWithWrong = words.filter(
      (item) => item.wrong && typeof item?.wrong == 'boolean'
    );
    wordsWithWrong = wordsWithWrong.map((item) => item.word);
    wordsWithWrong = user.wordsToRepeat.filter((item) =>
      wordsWithWrong.includes(item._id.toString())
    );
    wordsWithWrong = wordsWithWrong.map((item) => item.word);

    if (wordsWithWrong.length > 0) {
      wordsWithWrong = wordsWithWrong.join(', ');
      message += `В следующих словах была допущена ошибка: ${wordsWithWrong}! Слова, в которых допущена ошибка должны быть пройдены повторно!\n`;
    }
    /* Получение новых параметров слова */
    words = words.filter((item) => !item.wrong);
    let regularityToRepeat = user.options[0].regularityToRepeat;
    let finishedWords = [];
    let standartFinishedWords = [];
    let multiSetOptions = [];
    for (let item of words) {
      let elementID = item.word;
      let index = user.wordsToRepeat.findIndex((item) => item._id == elementID);
      if (index == -1) continue;

      let countOfReverseRepeat = user.wordsToRepeat[index].countOfReverseRepeat;
      let countOfRepeat = user.wordsToRepeat[index].countOfRepeat + 1;
      if (countOfReverseRepeat >= 9 && countOfRepeat >= 9) {
        finishedWords.push(elementID);
        continue;
      }

      let nextRepeat;
      if (countOfRepeat == 9) {
        standartFinishedWords.push(elementID);
        nextRepeat = daysToMilliseconds(365) + Date.now();
      } else
        nextRepeat =
          daysToMilliseconds(regularityToRepeat[countOfRepeat - 1]) +
          Date.now();

      let historyOfRepeat = user.wordsToRepeat[index].historyOfRepeat;
      historyOfRepeat.push(Date.now());

      let changeFields = {
        lastRepeat: Date.now(),
        nextRepeat,
        historyOfRepeat,
        countOfRepeat,
      };
      multiSetOptions.push({ elementID, changeFields });
    }
    /* Установка новых параметров слова */
    let userInfo;
    if (multiSetOptions.length > 0) {
      userInfo = await multiSetElement(
        'wordsToRepeat',
        multiSetOptions,
        req.userId
      );
      if (!userInfo) return sendResponseError(req, res);
    }
    /* Удаление повторенных слов */
    if (finishedWords.length > 0) {
      userInfo = await multiPullElement(
        'wordsToRepeat',
        finishedWords,
        req.userId
      );
      if (!userInfo) return sendResponseError(req, res);
    }
    /* Формирование ответа */
    if (standartFinishedWords.length > 0) {
      standartFinishedWords = user.wordsToRepeat.filter((item) =>
        standartFinishedWords.includes(item._id.toString())
      );
      standartFinishedWords = standartFinishedWords.map((item) => item.word);
      standartFinishedWords = standartFinishedWords.join(', ');
      message += `Слова, в которых закончился полный цикл обычных повторений: ${standartFinishedWords}. Закончите для этих слов цикл реверсивных повторений, чтобы убрать их из категории "Повторяемые"!\n`;
    }

    if (finishedWords.length > 0) {
      finishedWords = user.wordsToRepeat.filter((item) =>
        finishedWords.includes(item._id.toString())
      );
      finishedWords = finishedWords.map((item) => item.word);
      finishedWords = finishedWords.join(', ');
      message += `Слова с полностью завершенными циклами повторений обоих типов: ${finishedWords}! Эти слова были удалены их категории "Повторяемые"\n`;
    }
    let checkStreak = await isSuccessStreak(req.userId);
    if (checkStreak.ok) {
      message += '\nПоздравляем, непрерывная серия повторения была увеличена!';
      userInfo = checkStreak.userInfo;
    }
    if (checkStreak.resetStreak) {
      userInfo = await User.findOne({ _id: req.userId });
      if (!userInfo) return sendResponseError(req, res);
      userInfo = getUserInfoFromDoc(userInfo._doc);
      message += '\nК сожалению, серия повторения была прервана!';
    }

    res.json({
      message,
      user: userInfo,
    });
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};
export const reRepeatAnswer = async (req, res) => {
  try {
    /* Получение информации о пользователе и списке слов */
    let { words } = req.body;
    let message = 'Обучение пройдено успешно!\n';
    let user = await getUserInfo(req.userId, 'wordsToRepeat options');
    if (!user) return sendResponseError(req, res);
    /* Обработка слов с ошибками */
    let wordsWithWrong = words.filter(
      (item) => item.wrong && typeof item?.wrong == 'boolean'
    );
    wordsWithWrong = wordsWithWrong.map((item) => item.word);
    wordsWithWrong = user.wordsToRepeat.filter((item) =>
      wordsWithWrong.includes(item._id.toString())
    );
    wordsWithWrong = wordsWithWrong.map((item) => item.word);

    if (wordsWithWrong.length > 0) {
      wordsWithWrong = wordsWithWrong.join(', ');
      message += `В следующих словах была допущена ошибка: ${wordsWithWrong}! Слова, в которых допущена ошибка должны быть пройдены повторно!\n`;
    }
    /* Получение новых параметров слова */
    words = words.filter((item) => !item.wrong);
    let regularityToRepeat = user.options[0].regularityToRepeat;
    let finishedWords = [];
    let reverseFinishedWords = [];
    let multiSetOptions = [];
    for (let item of words) {
      let elementID = item.word;
      let index = user.wordsToRepeat.findIndex((item) => item._id == elementID);
      if (index == -1) continue;

      let countOfReverseRepeat =
        user.wordsToRepeat[index].countOfReverseRepeat + 1;
      let countOfRepeat = user.wordsToRepeat[index].countOfRepeat;
      if (countOfReverseRepeat >= 9 && countOfRepeat >= 9) {
        finishedWords.push(elementID);
        continue;
      }

      let nextReverseRepeat;
      if (countOfReverseRepeat == 9) {
        reverseFinishedWords.push(elementID);
        nextReverseRepeat = daysToMilliseconds(365) + Date.now();
      } else
        nextReverseRepeat =
          daysToMilliseconds(regularityToRepeat[countOfReverseRepeat - 1]) +
          Date.now();

      let historyOfReverseRepeat =
        user.wordsToRepeat[index].historyOfReverseRepeat;
      historyOfReverseRepeat.push(Date.now());

      let changeFields = {
        lastReverseRepeat: Date.now(),
        nextReverseRepeat,
        historyOfReverseRepeat,
        countOfReverseRepeat,
      };
      multiSetOptions.push({ elementID, changeFields });
    }
    /* Установка новых параметров слова */
    let userInfo;
    if (multiSetOptions.length > 0) {
      userInfo = await multiSetElement(
        'wordsToRepeat',
        multiSetOptions,
        req.userId
      );
      if (!userInfo) return sendResponseError(req, res);
    }
    /* Удаление повторенных слов */
    if (finishedWords.length > 0) {
      userInfo = await multiPullElement(
        'wordsToRepeat',
        finishedWords,
        req.userId
      );
      if (!userInfo) return sendResponseError(req, res);
    }
    /* Формирование ответа */
    if (reverseFinishedWords.length > 0) {
      reverseFinishedWords = user.wordsToRepeat.filter((item) =>
        reverseFinishedWords.includes(item._id.toString())
      );
      reverseFinishedWords = reverseFinishedWords.map((item) => item.word);
      reverseFinishedWords = reverseFinishedWords.join(', ');
      message += `Слова, в которых закончился полный цикл реверсивных повторений: ${reverseFinishedWords}. Закончите для этих слов цикл обычных повторений, чтобы убрать их из категории "Повторяемые"!\n`;
    }

    if (finishedWords.length > 0) {
      finishedWords = user.wordsToRepeat.filter((item) =>
        finishedWords.includes(item._id.toString())
      );
      finishedWords = finishedWords.map((item) => item.word);
      finishedWords = finishedWords.join(', ');
      message += `Слова с полностью завершенными циклами повторений обоих типов: ${finishedWords}! Эти слова были удалены их категории "Повторяемые"\n`;
    }
    let checkStreak = await isSuccessStreak(req.userId);
    if (checkStreak.ok) {
      message += '\nПоздравляем, непрерывная серия повторения была увеличена!';
      userInfo = checkStreak.userInfo;
    }
    if (checkStreak.resetStreak) {
      userInfo = await User.findOne({ _id: req.userId });
      if (!userInfo) return sendResponseError(req, res);
      userInfo = getUserInfoFromDoc(userInfo._doc);
      message += '\nК сожалению, серия повторения была прервана!';
    }

    res.json({
      message,
      user: userInfo,
    });
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};
const pushWrongsInWords = async (words, typeWords, req) => {
  try {
    let message = '';
    let user = await getUserInfo(req.userId, `options`);
    if (!user)
      return {
        message: 'Не удалось найти информацию о пользователе!',
        status: false,
      };
    const maxWrongs = user.options[0].countWrongsToAddToRepeat;

    let multiSetOptions = [];
    let wordsForRepeat = [];
    for (let item of words) {
      let wrongs = item.wrongs + 1;
      if (wrongs >= maxWrongs) {
        wordsForRepeat.push(item._id.toString());
        wrongs = 0;
      }
      let elementID = item._id.toString();
      let changeFields = {
        wrongs,
      };
      multiSetOptions.push({ elementID, changeFields });
    }

    if (wordsForRepeat.length > 0) {
      let pushWordInRepeat = await pushWordsInRepeat(wordsForRepeat, req);
      if (!pushWordInRepeat)
        return {
          message: 'Не удалось добавить слова в категорию повторения!',
          status: false,
        };

      wordsForRepeat = words.filter((item) =>
        wordsForRepeat.includes(item._id.toString())
      );
      wordsForRepeat = wordsForRepeat.map((item) => item.word);
      wordsForRepeat = wordsForRepeat.join(', ');
      message += `Следующие слова были поставлены на повторения из за большого количество накопившихся ошибок: ${wordsForRepeat}!`;
    }

    let userInfo;
    if (multiSetOptions.length > 0) {
      userInfo = await multiSetElement(typeWords, multiSetOptions, req.userId);
      if (!userInfo)
        return {
          message: 'Не удалось увеличить количество ошибок на словах!',
          status: false,
        };
    }

    return { message, status: true, user: userInfo };
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};
const pushWordsInRepeat = async (wordsWithWrong, req) => {
  try {
    let user = await getUserInfo(
      req.userId,
      'wordsToStudy knownWords wordsToRepeat'
    );
    if (!user) false;

    let hasWordsInRepeat = user.wordsToRepeat.filter((item) =>
      wordsWithWrong.includes(item._id.toString())
    );
    if (hasWordsInRepeat.length > 0) {
      let hasWordsInRepeatID = hasWordsInRepeat.map((item) => item._id);
      let pullOldItem = await multiPullElement(
        'wordsToRepeat',
        hasWordsInRepeatID,
        req.userId
      );
      if (!pullOldItem) false;
    }

    let allWords = [...user.wordsToStudy, ...user.knownWords];
    allWords = allWords.filter((item) =>
      wordsWithWrong.includes(item._id.toString())
    );
    let newWords = allWords.map((item) => {
      return {
        word: item.word,
        translate: item.translate,
        transcription: item.transcription,
        description: item.description,
        example: item.example,
        irregularVerb: item.irregularVerb,
        _id: item._id,
        lastRepeat: 0,
        lastReverseRepeat: 0,
        nextRepeat: 0,
        nextReverseRepeat: 0,
        historyOfRepeat: [],
        historyOfReverseRepeat: [],
        countOfRepeat: 0,
        countOfReverseRepeat: 0,
        dateOfCreation: Date.now(),
      };
    });

    let push = await multiPushNewElement('wordsToRepeat', newWords, req.userId);
    if (!push) return false;
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
};
export const checkStreak = async (req, res) => {
  try {
    let message = '';
    let checkStreak = await isSuccessStreak(req.userId);
    if (checkStreak.ok) {
      message += 'Поздравляем, непрерывная серия повторения была увеличена!';
    } else if (checkStreak.resetStreak) {
      message += 'К сожалению, серия повторения была прервана!';
    } else {
      message += 'Активности не завершены!';
    }

    let userInfo = await User.findOneAndUpdate(
      { _id: req.userId },
      {
        $set: {
          [`statistics.0.lastDailyCheckStreak`]: Date.now(),
        },
      },
      { new: true, rawResult: true }
    );
    if (userInfo.ok == 0) return sendResponseError(req, res);

    userInfo = getUserInfoFromDoc(userInfo.value._doc);
    res.json({
      message,
      user: userInfo,
    });
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};

function sendResponseError(
  req,
  res,
  message = 'Не удалось выполнить операцию!',
  status = 400
) {
  req.err = new Error(`${message}`);
  return res.status(status).json({ message });
}
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
      if (!success) return false;
      let setOption = {};
      for (let key in multiSetOption?.changeFields) {
        setOption[`${field}.$.${key}`] = multiSetOption?.changeFields[key];
      }
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

/* TRANSFORM DATA */
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
function millisecondsToDays(millisecond) {
  let day = 1000 * 60 * 60 * 24;
  return Math.floor(millisecond / day);
}
function daysToMilliseconds(days) {
  let day = 1000 * 60 * 60 * 24;
  return days * day;
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
async function isSuccessStreak(userID) {
  try {
    const user = await getUserInfo(
      userID,
      'statistics categoriesToLearn wordsToRepeat knownWords options'
    );
    //console.log(user);
    let dateOfLastStreak = millisecondsToDays(
      user.statistics[0].dateOfLastStreak
    );
    if (dateOfLastStreak == millisecondsToDays(Date.now())) return false;

    let success = true;

    let checkKnownWords = await isStreakInKnownWords(
      user.statistics[0],
      user.knownWords.length,
      userID
    );
    //console.log(checkKnownWords);
    if (!checkKnownWords) success = false;
    if (checkKnownWords.resetStreak) return { resetStreak: true };
    let checkWordsToStudy = await isStreakInWordsToStudy(
      user.categoriesToLearn,
      user.statistics[0],
      userID
    );
    //console.log(checkWordsToStudy);
    if (!checkWordsToStudy) success = false;
    if (checkWordsToStudy.resetStreak) return { resetStreak: true };
    let checkWordsToRepeat = await isStreakInWordsToRepeat(
      user.wordsToRepeat,
      user.statistics[0],
      user.options[0],
      userID
    );
    //console.log(checkWordsToRepeat);
    if (!checkWordsToRepeat) success = false;
    if (checkWordsToRepeat.resetStreak) return { resetStreak: true };

    if (!success) return false;

    let streak = await increaseStreak(userID, user.statistics[0]);
    if (!streak) return false;

    let userInfo = await User.findOne({ _id: userID });
    if (!userInfo) return false;
    userInfo = getUserInfoFromDoc(userInfo._doc);

    return { ok: true, userInfo };
  } catch (err) {
    console.log(err);
    return false;
  }
}
async function isStreakInKnownWords(info, wordsLength, userID) {
  try {
    if (wordsLength == 0) return true;

    let lastRepeat = millisecondsToDays(info.lastRepeatKnownWords);
    let lastReverseRepeat = millisecondsToDays(
      info.lastReverseRepeatKnownWords
    );
    let now = millisecondsToDays(Date.now());
    let historyOfRepeat = info.historyOfRepeatKnownWords.map((item) =>
      millisecondsToDays(item)
    );
    let historyOfReverseRepeat = info.historyOfReverseRepeatKnownWords.map(
      (item) => millisecondsToDays(item)
    );

    let isSuccess = true;
    let isResetStreak = false;

    if (lastRepeat == now) {
      if (
        historyOfRepeat.length > 1 &&
        diffOfLastTwoElements(historyOfRepeat) > 1
      )
        isResetStreak = true;
    } else isSuccess = false;
    if (lastReverseRepeat == now) {
      if (
        historyOfReverseRepeat.length > 1 &&
        diffOfLastTwoElements(historyOfReverseRepeat) > 1
      )
        isResetStreak = true;
    } else isSuccess = false;

    if (isResetStreak) {
      await resetStreak(userID, info);
      return { resetStreak: true };
    }
    if (!isSuccess) return false;
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
async function isStreakInWordsToStudy(info, statistics, userID) {
  try {
    info = info.filter((item) => item.startLearn == true);
    if (info.length == 0) return true;
    let now = millisecondsToDays(Date.now());
    let isResetStreak = false;
    let isSuccess = true;

    for (let item of info) {
      let lastRepeat = millisecondsToDays(item.lastRepeat);
      let lastReverseRepeat = millisecondsToDays(item.lastReverseRepeat);
      let nextRepeat = millisecondsToDays(item.nextRepeat);
      let nextReverseRepeat = millisecondsToDays(item.nextReverseRepeat);
      let historyOfRepeat = item.historyOfRepeat.map((i) =>
        millisecondsToDays(i)
      );
      let historyOfReverseRepeat = item.historyOfReverseRepeat.map((i) =>
        millisecondsToDays(i)
      );
      let regularityToRepeat = item.regularityToRepeat;
      let dateOfCreation = millisecondsToDays(item.dateOfStartLearn);
      let diffOfRepeat =
        historyOfRepeat.length > 1
          ? regularityToRepeat[historyOfRepeat.length - 2]
          : 0;
      let diffOfReverseRepeat =
        historyOfReverseRepeat.length > 1
          ? regularityToRepeat[historyOfReverseRepeat.length - 2]
          : 0;

      if (nextRepeat > now) {
        if (lastRepeat == now) {
          if (
            historyOfRepeat.length <= 1 &&
            historyOfRepeat?.[0] - dateOfCreation > 1
          ) {
            isResetStreak = true;
            break;
          }
          if (
            historyOfRepeat.length > 1 &&
            diffOfLastTwoElements(historyOfRepeat) != diffOfRepeat
          ) {
            isResetStreak = true;
            break;
          }
        }
      } else isSuccess = false;

      if (nextReverseRepeat > now) {
        if (lastReverseRepeat == now) {
          if (
            historyOfReverseRepeat.length <= 1 &&
            historyOfReverseRepeat?.[0] - dateOfCreation > 1
          ) {
            isResetStreak = true;
            break;
          }
          if (
            historyOfReverseRepeat.length > 1 &&
            diffOfLastTwoElements(historyOfReverseRepeat) != diffOfReverseRepeat
          ) {
            isResetStreak = true;
            break;
          }
        }
      } else isSuccess = false;
    }

    if (isResetStreak) {
      await resetStreak(userID, statistics);
      return { resetStreak: true };
    }
    if (!isSuccess) return false;
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
async function isStreakInWordsToRepeat(info, statistics, options, userID) {
  try {
    if (info.length == 0) return true;
    const regularityToRepeat = options.regularityToRepeat;
    const now = millisecondsToDays(Date.now());
    let isResetStreak = false;
    let isSuccess = true;

    for (let item of info) {
      let lastRepeat = millisecondsToDays(item.lastRepeat);
      let lastReverseRepeat = millisecondsToDays(item.lastReverseRepeat);
      let nextRepeat = millisecondsToDays(item.nextRepeat);
      let nextReverseRepeat = millisecondsToDays(item.nextReverseRepeat);
      let historyOfRepeat = item.historyOfRepeat.map((i) =>
        millisecondsToDays(i)
      );
      let historyOfReverseRepeat = item.historyOfReverseRepeat.map((i) =>
        millisecondsToDays(i)
      );
      let dateOfCreation = millisecondsToDays(item.dateOfCreation);
      let diffOfRepeat =
        historyOfRepeat.length > 1
          ? regularityToRepeat[historyOfRepeat.length - 2]
          : 0;
      let diffOfReverseRepeat =
        historyOfReverseRepeat.length > 1
          ? regularityToRepeat[historyOfReverseRepeat.length - 2]
          : 0;

      if (nextRepeat > now) {
        if (lastRepeat == now) {
          if (
            historyOfRepeat.length <= 1 &&
            historyOfRepeat?.[0] - dateOfCreation > 1
          ) {
            isResetStreak = true;
            break;
          }
          if (
            historyOfRepeat.length > 1 &&
            diffOfLastTwoElements(historyOfRepeat) != diffOfRepeat
          ) {
            isResetStreak = true;
            break;
          }
        }
      } else isSuccess = false;

      if (nextReverseRepeat > now) {
        if (lastReverseRepeat == now) {
          if (
            historyOfReverseRepeat.length <= 1 &&
            historyOfReverseRepeat?.[0] - dateOfCreation > 1
          ) {
            isResetStreak = true;
            break;
          }
          if (
            historyOfReverseRepeat.length > 1 &&
            diffOfLastTwoElements(historyOfReverseRepeat) != diffOfReverseRepeat
          ) {
            isResetStreak = true;
            break;
          }
        }
      } else isSuccess = false;
    }

    if (isResetStreak) {
      await resetStreak(userID, statistics);
      return { resetStreak: true };
    }
    if (!isSuccess) return false;
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
function diffOfLastTwoElements(array) {
  let length = array.length;
  if (length == 1) return false;
  return array[length - 1] - array[length - 2];
}
async function resetStreak(userID, statistics) {
  try {
    if (statistics.bestStreak < statistics.currentStreak) {
      let bestStreak = await User.findOneAndUpdate(
        { _id: userID },
        {
          $set: {
            [`statistics.0.bestStreak`]: statistics.currentStreak,
          },
        },
        { new: true, rawResult: true }
      );
      if (bestStreak.ok == 0) console.log('не удалось изменить бест стрик');
    }

    let currentStreak = await User.findOneAndUpdate(
      { _id: userID },
      {
        $set: {
          [`statistics.0.currentStreak`]: 0,
          [`statistics.0.dateOfLastStreak`]: Date.now(),
        },
      },
      { new: true, rawResult: true }
    );
    if (currentStreak.ok == 0) console.log('не удалось обнулить streak');
  } catch (err) {
    console.log(err);
    return false;
  }
}
async function increaseStreak(userID, statistics) {
  try {
    let increaseStreak = await User.findOneAndUpdate(
      { _id: userID },
      {
        $set: {
          [`statistics.0.currentStreak`]: statistics.currentStreak + 1,
          [`statistics.0.dateOfLastStreak`]: Date.now(),
        },
      },
      { new: true, rawResult: true }
    );
    if (increaseStreak.ok == 0) {
      console.log('не удалось инкризнуть');
      return false;
    }
    if (statistics.currentStreak + 1 > statistics.bestStreak) {
      increaseStreak = await User.findOneAndUpdate(
        { _id: userID },
        {
          $set: {
            [`statistics.0.bestStreak`]: statistics.currentStreak + 1,
          },
        },
        { new: true, rawResult: true }
      );
      if (increaseStreak.ok == 0) {
        console.log('не удалось инкризнуть');
        return false;
      }
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

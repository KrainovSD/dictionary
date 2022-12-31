import store from "../store/index";
const countWordsToActiveCategory = 2;
/*
let userInfo = store.getters.userInfo;
store.commit("resetAuth");*/

export default function () {
  return {
    addCategory(data) {
      let { name, icon, regularityToRepeat } = data;
      let userInfo = getUserInfoFromLocalStorage();

      let hasCategory = isHasCategory(name, null, userInfo);
      if (hasCategory) throw new Error("Такое имя категории уже существует!");

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
        _id: makeID(),
        offline: "add",
      };
      userInfo?.categoriesToLearn.push(newCategory);
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      store.commit("resetAuth");
      return { message: "Операция успешно выполнена!" };
    },
    updateCategory(data) {
      let { id, name, icon, regularityToRepeat } = data;
      let userInfo = getUserInfoFromLocalStorage();

      let activeCategory = isActiveCategory(id, userInfo);
      if (activeCategory)
        throw new Error("Категория уже поставлена на изучение!");

      let hasCategory = isHasCategory(name, id, userInfo);
      if (hasCategory) throw new Error("Такое имя категории уже существует!");

      let index = userInfo?.categoriesToLearn.findIndex(
        (item) => item._id == id
      );
      if (index == -1) throw new Error("Категории не существует!");
      userInfo.categoriesToLearn[index].name = name;
      userInfo.categoriesToLearn[index].icon = icon;
      userInfo.categoriesToLearn[index].regularityToRepeat = regularityToRepeat;
      if (!userInfo.categoriesToLearn[index].offline)
        userInfo.categoriesToLearn[index].offline = "update";

      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      store.commit("resetAuth");
      return { message: "Операция успешно выполнена!" };
    },
    deleteCategory(data) {
      let id = data;
      if (!id || typeof id != "string" || id.trim()?.length == 0)
        throw new Error("Неверный тип ID!");
      let userInfo = getUserInfoFromLocalStorage();

      let index = userInfo?.categoriesToLearn.findIndex(
        (item) => item._id == id
      );
      if (index == -1) throw new Error("Категории не существует!");
      if (userInfo.categoriesToLearn[index].offline == "add")
        userInfo.categoriesToLearn = userInfo.categoriesToLearn.filter(
          (item) => item._id != id
        );
      else userInfo.categoriesToLearn[index].offline = "delete";

      let wordsInCategory = userInfo.wordsToStudy.filter(
        (item) => item.category == id
      );
      for (let word of wordsInCategory) {
        let index = userInfo.wordsToStudy.findIndex(
          (item) => item._id == word._id
        );
        if (index == -1) continue;
        if (userInfo.wordsToStudy[index].offline == "add")
          userInfo.wordsToStudy = userInfo.wordsToStudy.filter(
            (item) => item._id != word._id
          );
        else userInfo.wordsToStudy[index].offline = "delete";
      }

      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      store.commit("resetAuth");
      return { message: "Операция успешно выполнена!" };
    },
    addWord(data) {
      let { category, word, translate, transcription, description, example } =
        data;
      let irregularVerb = checkIrregularVerb(word);
      if (irregularVerb) word = fixIrregularVerb(word);
      let userInfo = getUserInfoFromLocalStorage();

      let statusCategory = isActiveCategory(category, userInfo);
      if (statusCategory)
        throw new Error(
          "Категория, в которую вы пытаетесь добавить слово, уже поставлена на изучение!"
        );

      let hasWord = isAlreadyHasWord(word, null, userInfo);
      if (hasWord) throw new Error("Такое слово уже на изучении или изучено!");

      let hasRelevance = isHasRelevance(word, userInfo);
      if (hasRelevance) {
        let index = userInfo?.relevance.findIndex(
          (item) => item._id == hasRelevance[0]._id
        );
        if (userInfo.relevance[index].offline == "add")
          userInfo.relevance = userInfo.relevance.filter(
            (item) => item._id != hasRelevance[0]._id
          );
        else userInfo.relevance[index].offline = "delete";
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
        _id: makeID(),
        offline: "add",
      };
      let newWordsToStudy = userInfo?.wordsToStudy;
      newWordsToStudy.push(newWord);
      userInfo.wordsToStudy = newWordsToStudy;
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      store.commit("resetAuth");
      return { message: "Операция успешно выполнена!" };
    },
    updateWord(data) {
      let { id, word, translate, transcription, description, example } = data;
      let irregularVerb = checkIrregularVerb(word);
      if (irregularVerb) word = fixIrregularVerb(word);
      let userInfo = getUserInfoFromLocalStorage();

      let hasWord = isAlreadyHasWord(word, id, userInfo);
      if (hasWord) throw new Error("Такое слово уже на изучении или изучено!");

      let hasRelevance = isHasRelevance(word, userInfo);
      if (hasRelevance)
        throw new Error("Такое слово находится в Актуализаторе!");

      let index = userInfo?.wordsToStudy.findIndex((item) => item._id == id);
      if (index == -1) throw new Error("Слова не существует!");
      userInfo.wordsToStudy[index].word = word;
      userInfo.wordsToStudy[index].translate = translate;
      userInfo.wordsToStudy[index].transcription = transcription;
      userInfo.wordsToStudy[index].description = description;
      userInfo.wordsToStudy[index].example = example;
      userInfo.wordsToStudy[index].irregularVerb = irregularVerb;
      if (!userInfo.wordsToStudy[index].offline)
        userInfo.wordsToStudy[index].offline = "update";

      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      store.commit("resetAuth");
      return { message: "Операция успешно выполнена!" };
    },
    deleteWord(data) {
      let id = data;
      if (!id || typeof id != "string" || id.trim()?.length == 0)
        throw new Error("Неверный тип ID!");
      let userInfo = getUserInfoFromLocalStorage();

      let index = userInfo?.wordsToStudy.findIndex((item) => item._id == id);
      if (index == -1) throw new Error("Слова не существует!");
      if (userInfo.wordsToStudy[index].offline == "add")
        userInfo.wordsToStudy = userInfo.wordsToStudy.filter(
          (item) => item._id != id
        );
      else userInfo.wordsToStudy[index].offline = "delete";

      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      store.commit("resetAuth");
      return { message: "Операция успешно выполнена!" };
    },
    startLearnCategory(data) {
      let { id } = data;
      let userInfo = getUserInfoFromLocalStorage();

      let hasWordsInCategory = isHasWordsInCategory(id, userInfo);
      if (!hasWordsInCategory)
        throw new Error(
          `В категории менее ${countWordsToActiveCategory} слов!`
        );
      let activeCategory = isActiveCategory(id, userInfo);
      if (activeCategory)
        throw new Error(`Категория уже поставлена на изучение!`);

      let index = userInfo?.categoriesToLearn.findIndex(
        (item) => item._id == id
      );
      if (index == -1) throw new Error(`Категории не существует!`);
      userInfo.categoriesToLearn[index].startLearn = true;
      userInfo.categoriesToLearn[index].offline = "update";

      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      store.commit("resetAuth");
      return { message: "Операция успешно выполнена!" };
    },
    addRelevance(data) {
      let { words } = data;
      words = [...new Set(words)];
      let userInfo = getUserInfoFromLocalStorage();
      /* Находим уже имеюшиеся слова, которые добавлять не нужно*/
      let hasWords = words.filter((item) => {
        let isHasWord = isAlreadyHasWord(item, null, userInfo);
        if (!isHasWord) return false;
        return true;
      });
      /* Находим уже имеющиеся в актуализаторе слова */
      let hasRelevances = words.filter((item) => {
        let hasRelevance = isHasRelevance(item, userInfo);
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
          _id: makeID(),
          word,
          dateOfCreation: Date.now(),
          dateOfDetected: [Date.now()],
          irregularVerb,
          offline: "add",
        };
      });
      if (newRelevances.length > 0) {
        userInfo.relevance = userInfo.relevance.concat(newRelevances);
      }
      /* Обновляем дату детекта уже имеющихся в актуализаторе слов */
      if (hasRelevances?.length > 0) {
        for (let item of hasRelevances) {
          let index = userInfo.relevance.findIndex((word) => word.word == item);
          if (index == -1) continue;
          userInfo.relevance[index].dateOfDetected.push(Date.now());
          if (!userInfo.relevance[index].offline)
            userInfo.relevance[index].offline = "update";
        }
      }

      /* Формируем сообщение */
      let message = "Операция успешно завершена! ";
      if (newWords?.length > 0)
        message += `Новые слова, которые были добавлены: ${newWords.join(
          ", "
        )}. `;
      if (hasRelevances?.length > 0)
        message += `Слова с которыми вы уже встречались: ${hasRelevances.join(
          ", "
        )}. `;
      if (hasWords?.length > 0)
        message += `Слова, которые не были добавлены, так как вы уже изучили/учите их: ${hasWords.join(
          ", "
        )}. `;

      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      store.commit("resetAuth");
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
        let now = Math.floor(Date.now() / millisecondsToDays);

        let word = userInfo?.relevance.filter(
          (item) => item.word == oldRelevance
        )[0];
        let totalCountMeets = word?.dateOfDetected?.length;

        let maxDateCheckRelevance =
          userInfo?.options?.[0]?.maxDateCheckRelevance;
        let countMeetsPerDays = word?.dateOfDetected.filter(
          (date) =>
            Math.floor(date / millisecondsToDays) >= now - maxDateCheckRelevance
        );
        countMeetsPerDays = countMeetsPerDays?.length;

        return {
          word: oldRelevance,
          totalCountMeets,
          countMeetsPerDays,
        };
      });
      let addedWords = [...newWords, ...hasRelevances];

      return { message, words: addedWords };
    },
    pushLearnAnswers(data) {
      let { categoryID, words } = data;
      let user = getUserInfoFromLocalStorage();

      let activeCategory = isActiveCategory(categoryID, user);
      if (!activeCategory) throw new Error("Категория не активна!");

      let index = user.categoriesToLearn.findIndex(
        (item) => item._id == categoryID && item?.offline != "delete"
      );
      if (index == -1) throw new Error("Категория не существует!");

      let category = user.categoriesToLearn[index];
      let nextRepeat = millisecondsToDays(category.nextRepeat);
      if (millisecondsToDays(Date.now()) < nextRepeat)
        throw new Error(
          "День повторения категории не наступил! Прогресс не будет сохранен!"
        );

      let wordsWithWrong = words.filter(
        (item) => item.wrong && typeof item?.wrong == "boolean"
      );
      if (wordsWithWrong.length > 0) {
        wordsWithWrong = wordsWithWrong.map((item) => item.word);
        wordsWithWrong = user.wordsToStudy.filter((item) =>
          wordsWithWrong.includes(item._id.toString())
        );
        let pushWrongs = pushWrongsInWords(
          wordsWithWrong,
          "wordsToStudy",
          user
        );
        wordsWithWrong = wordsWithWrong.map((item) => item.word);
        wordsWithWrong = wordsWithWrong.join(", ");
        let message =
          "В словах были допущены ошибки, повторение не засчитано, попробуйте еще раз!";
        message += ` В следуюших словах была допущена ошибка: ${wordsWithWrong}!`;
        if (!pushWrongs.status) throw new Error(pushWrongs.message);
        if (pushWrongs.message.length > 0) message += ` ${pushWrongs.message}`;
        localStorage.setItem("userInfo", JSON.stringify(pushWrongs.user));
        store.commit("resetAuth");
        return { message };
      }
      /* Проверка на количество повторений категории */
      let countOfRepeat = category.countOfRepeat + 1;
      let countOfReverseRepeat = category.countOfReverseRepeat;
      if (countOfRepeat >= 13 && countOfReverseRepeat >= 13)
        return pullStudiedCategory(categoryID, user);

      /* Сбор новых параметров категории*/
      let nextPattern;
      if (countOfRepeat >= 13) nextPattern = daysToMilliseconds(365);
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
      /* Изменение параметров категории */
      user = setElement("categoriesToLearn", categoryID, changeFields, user);

      let message = "";
      if (countOfRepeat >= 13)
        message =
          "Вы достигли необходимого количества обычных повторений! Чтобы слова переместились в категорию изученных, вам требуется достигнуть необходимого количества реверсивных повторений!";
      else message = "Обычное повторение категории успешно завершено!";

      localStorage.setItem("userInfo", JSON.stringify(user));
      store.commit("resetAuth");
      return { message };
    },
    pushReLearnAnswers(data) {
      let { categoryID, words } = data;
      let user = getUserInfoFromLocalStorage();

      let activeCategory = isActiveCategory(categoryID, user);
      if (!activeCategory) throw new Error("Категория не активна!");

      let index = user.categoriesToLearn.findIndex(
        (item) => item._id == categoryID && item?.offline != "delete"
      );
      if (index == -1) throw new Error("Категория не существует!");

      let category = user.categoriesToLearn[index];
      let nextReverseRepeat = millisecondsToDays(category.nextReverseRepeat);
      if (millisecondsToDays(Date.now()) < nextReverseRepeat)
        throw new Error(
          "День повторения категории не наступил! Прогресс не будет сохранен!"
        );

      let wordsWithWrong = words.filter(
        (item) => item.wrong && typeof item?.wrong == "boolean"
      );
      if (wordsWithWrong.length > 0) {
        wordsWithWrong = wordsWithWrong.map((item) => item.word);
        wordsWithWrong = user.wordsToStudy.filter((item) =>
          wordsWithWrong.includes(item._id.toString())
        );
        let pushWrongs = pushWrongsInWords(
          wordsWithWrong,
          "wordsToStudy",
          user
        );
        wordsWithWrong = wordsWithWrong.map((item) => item.word);
        wordsWithWrong = wordsWithWrong.join(", ");
        let message =
          "В словах были допущены ошибки, повторение не засчитано, попробуйте еще раз!";
        message += ` В следуюших словах была допущена ошибка: ${wordsWithWrong}!`;
        if (!pushWrongs.status) throw new Error(pushWrongs.message);
        if (pushWrongs.message.length > 0) message += ` ${pushWrongs.message}`;
        localStorage.setItem("userInfo", JSON.stringify(pushWrongs.user));
        store.commit("resetAuth");
        return { message };
      }
      /* Проверка на количество повторений категории */
      let countOfRepeat = category.countOfRepeat;
      let countOfReverseRepeat = category.countOfReverseRepeat + 1;
      if (countOfRepeat >= 13 && countOfReverseRepeat >= 13)
        return pullStudiedCategory(categoryID, user);
      /* Сбор новых параметров категории*/
      let nextPattern;
      if (countOfReverseRepeat >= 13) nextPattern = daysToMilliseconds(365);
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
      /* Изменение параметров категории */
      user = setElement("categoriesToLearn", categoryID, changeFields, user);

      let message = "";
      if (countOfReverseRepeat >= 13)
        message =
          "Вы достигли необходимого количества реверсивных повторений! Чтобы слова переместились в категорию изученных, вам требуется достигнуть необходимого количества обычных повторений!";
      else message = "Реверсивное повторение категории успешно завершено!";

      localStorage.setItem("userInfo", JSON.stringify(user));
      store.commit("resetAuth");
      return { message };
    },
    pushKnownAnswers(data) {
      console.log(data);
      let userInfo = getUserInfoFromLocalStorage();
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      store.commit("resetAuth");
      return { message: "Операция успешно выполнена!" };
    },
    pushReKnownAnswers(data) {
      console.log(data);
      let userInfo = getUserInfoFromLocalStorage();
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      store.commit("resetAuth");
      return { message: "Операция успешно выполнена!" };
    },
    pushRepeatAnswers(data) {
      console.log(data);
      let userInfo = getUserInfoFromLocalStorage();
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      store.commit("resetAuth");
      return { message: "Операция успешно выполнена!" };
    },
    pushReRepeatAnswers(data) {
      console.log(data);
      let userInfo = getUserInfoFromLocalStorage();
      userInfo = setSignature(userInfo);
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      store.commit("resetAuth");
      return { message: "Операция успешно выполнена!" };
    },
  };
}
function pullStudiedCategory(categoryID, user) {
  /* Проверка нет ли слов из категории во вкладке Изученные */
  let words = user.wordsToStudy.filter((item) => item.category == categoryID);
  let wordsName = words.map((item) => item.word);
  let knownWords = user.knownWords.filter((item) =>
    wordsName.includes(item.word)
  );
  if (knownWords.length > 0)
    throw new Error('Слово из категории присутствует во вкладке "Изученные"');

  /* Удаление категории */
  user = pullElement("categoriesToLearn", categoryID, user);
  if (!user) throw new Error("Не удалось удалить категорию!");

  /* Удаление слов из категории Изучаемые */
  let wordsID = words.map((item) => item._id);
  user = multiPullElement("wordsToStudy", wordsID, user);
  if (!user) throw new Error("Не удалось удалить слова!");

  /* Добавление слов в категорию Изученные */
  let newKnownWords = words.map((item) => {
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
  user = multiPushNewElement("knownWords", newKnownWords, user);
  if (!user) throw new Error("Не удалось перенести слова из категории!");

  localStorage.setItem("userInfo", JSON.stringify(user));
  store.commit("resetAuth");
  return {
    message:
      "Категория успешно изучена и удалена! Все слова перенесены во вкладку 'Изученные'!",
  };
}
function pushWrongsInWords(words, typeWords, user) {
  let message = "";
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
    user = pushWordsInRepeat(wordsForRepeat, user);
    if (!user)
      return {
        message: "Не удалось добавить слова в категорию повторения!",
        status: false,
      };

    wordsForRepeat = words.filter((item) =>
      wordsForRepeat.includes(item._id.toString())
    );
    wordsForRepeat = wordsForRepeat.map((item) => item.word);
    wordsForRepeat = wordsForRepeat.join(", ");
    message += ` Следующие слова были поставлены на повторения из за большого количество накопившихся ошибок: ${wordsForRepeat}!`;
  }

  if (multiSetOptions.length > 0) {
    user = multiSetElement(typeWords, multiSetOptions, user);
    if (!user)
      return {
        message: "Не удалось увеличить количество ошибок на словах!",
        status: false,
      };
  }
  return { message, status: true, user };
}
function pushWordsInRepeat(wordsWithWrong, user) {
  let hasWordsInRepeat = user.wordsToRepeat.filter(
    (item) =>
      wordsWithWrong.includes(item._id.toString()) && item?.offline != "delete"
  );
  if (hasWordsInRepeat.length > 0) {
    let hasWordsInRepeatID = hasWordsInRepeat.map((item) => item._id);
    user = multiPullElement("wordsToRepeat", hasWordsInRepeatID, user);
    if (!user) false;
  }

  let allWords = [...user.wordsToStudy, ...user.knownWords];
  let newRepeatWords = allWords.filter(
    (item) =>
      wordsWithWrong.includes(item._id.toString()) && item?.offline != "delete"
  );

  newRepeatWords = newRepeatWords.map((item) => {
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
    };
  });

  user = multiPushNewElement("wordsToRepeat", newRepeatWords, user);
  if (!user) return false;
  return user;
}

function setElement(field, elementID, changeFields, userInfo) {
  try {
    let index = userInfo[field].findIndex(
      (item) => item._id == elementID && item?.offline != "delete"
    );
    if (index == -1) return false;
    for (let key in changeFields) {
      userInfo[field][index][key] = changeFields[key];
    }
    if (userInfo[field][index].offline != "add")
      userInfo[field][index].offline = "update";
    return userInfo;
  } catch (err) {
    return false;
  }
}
function pullElement(field, elementID, userInfo) {
  try {
    let index = userInfo[field].findIndex(
      (item) => item._id == elementID && item?.offline != "delete"
    );
    if (index == -1) return false;
    if (userInfo[field][index].offline == "add")
      userInfo = userInfo[field][index].filter((item) => item._id != elementID);
    else userInfo[field][index].offline = "delete";
    return userInfo;
  } catch (err) {
    return false;
  }
}
function multiSetElement(field, changeFields, userInfo) {
  try {
    // changeFields = ({ elementID, [changeFields] });
    for (let element of changeFields) {
      let index = userInfo[field].findIndex(
        (item) => item._id == element.elementID && item?.offline != "delete"
      );
      if (index == -1) return false;
      for (let key in element.changeFields) {
        userInfo[field][index][key] = element.changeFields[key];
      }
      if (userInfo[field][index].offline != "add")
        userInfo[field][index].offline = "update";
    }
    return userInfo;
  } catch (err) {
    return false;
  }
}
function multiPullElement(field, elemetsID, userInfo) {
  try {
    for (let id of elemetsID) {
      let index = userInfo[field].findIndex(
        (item) => item._id == id && item?.offline != "delete"
      );
      if (index == -1) return false;
      if (userInfo[field][index].offline == "add")
        userInfo = userInfo[field].filter((item) => item._id != id);
      else userInfo[field][index].offline = "delete";
    }
    return userInfo;
  } catch (err) {
    return false;
  }
}
function multiPushNewElement(field, newWords, userInfo) {
  try {
    for (let word of newWords) {
      word.offline = "add";
      userInfo[field].push(word);
    }
    return userInfo;
  } catch (err) {
    return false;
  }
}

function makeID() {
  let result = "";
  let characters = "abcdef0123456789";
  let charactersLength = characters.length;
  for (let i = 0; i < 24; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
function getUserInfoFromLocalStorage() {
  try {
    let userInfo = {};
    let info = JSON.parse(localStorage.getItem("userInfo"));
    if (typeof info != "object" && info != null)
      throw new Error("Данные повреждены");
    if (info != null) userInfo = info;
    else {
      userInfo = {
        knownWords: [],
        wordsToStudy: [],
        wordsToRepeat: [],
        relevance: [],
        options: [
          {
            countKnownWordsAtOneTime: 50,
            countWrongsToAddToRepeat: 3,
            regularityToRepeat: [2, 2, 2, 4, 4, 4, 8, 8],
            maxDateCheckRelevance: 45,
            maxCountCheckRelevance: 3,
          },
        ],
        categoriesToLearn: [],
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
    }
    return userInfo;
  } catch (err) {
    console.log(err);
    console.log("Данные сломаны");
    localStorage.clear();
    let userInfo = {
      knownWords: [],
      wordsToStudy: [],
      wordsToRepeat: [],
      relevance: [],
      options: [
        {
          countKnownWordsAtOneTime: 50,
          countWrongsToAddToRepeat: 3,
          regularityToRepeat: [2, 2, 2, 4, 4, 4, 8, 8],
          maxDateCheckRelevance: 45,
          maxCountCheckRelevance: 3,
        },
      ],
      categoriesToLearn: [],
    };
    localStorage.setItem("userInfo", JSON.stringify(userInfo));
    return userInfo;
  }
}
function checkIrregularVerb(word) {
  if (!/--/g.test(word)) return false;
  let words = word.split("--");
  if (words.length != 3) return false;
  return true;
}
function fixIrregularVerb(word) {
  let irregularVerbs = word.split("--");
  irregularVerbs = irregularVerbs.map((item) => item.trim().toLowerCase());
  return irregularVerbs.join("--");
}
function isAlreadyHasWord(word, id, userInfo) {
  let allWords = [...userInfo.wordsToStudy, ...userInfo.knownWords];
  let hasWord = allWords.filter((wordItem) => {
    if (wordItem.irregularVerb == false)
      return (
        wordItem.word == word &&
        wordItem._id != id &&
        wordItem?.offline != "delete"
      );
    let irregularVerbs = wordItem.word.split("--");
    irregularVerbs = irregularVerbs.map((item) => item.toLowerCase().trim());
    return (
      irregularVerbs.includes(word) &&
      wordItem._id != id &&
      wordItem?.offline != "delete"
    );
  });
  if (hasWord?.length != 0) {
    return true;
  }
  return false;
}
function isHasRelevance(word, userInfo) {
  let hasRelevance = userInfo?.relevance.filter((relevanceItem) => {
    if (relevanceItem.irregularVerb == false)
      return relevanceItem.word == word && relevanceItem?.offline != "delete";
    let irregularVerbs = relevanceItem.word.split("--");
    irregularVerbs = irregularVerbs.map((item) => item.toLowerCase().trim());
    return irregularVerbs.includes(word) && relevanceItem?.offline != "delete";
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
function isHasWordsInCategory(id, userInfo) {
  let hasWordsInCategories = userInfo?.wordsToStudy.filter(
    (item) => item.category == id && item?.offline != "delete"
  );
  if (hasWordsInCategories.length < countWordsToActiveCategory) return false;
  return true;
}
function isHasCategory(name, id, userInfo) {
  let hasCategory = userInfo?.categoriesToLearn.filter(
    (item) => item.name == name && item._id != id && item?.offline != "delete"
  );
  if (hasCategory.length == 0) return false;
  return true;
}
function millisecondsToDays(millisecond) {
  let day = 1000 * 60 * 60 * 24;
  return Math.floor(millisecond / day);
}
function daysToMilliseconds(days) {
  let day = 1000 * 60 * 60 * 24;
  return days * day;
}
function setSignature(userInfo) {
  return userInfo;
}

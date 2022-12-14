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

      let activeCategory = isActiveCaregory(id, userInfo);
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
      userInfo.categoriesToLearn[index].offline = "delete";

      let wordsInCategory = userInfo.wordsToStudy.filter(
        (item) => item.category == id
      );
      let indexes = [];
      for (let word of wordsInCategory) {
        let index = userInfo.wordsToStudy.findIndex(
          (item) => item._id == word._id
        );
        if (index != -1) indexes.push(index);
      }
      for (let index of indexes) {
        userInfo.wordsToStudy[index].offline = "delete";
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

      let statusCategory = isActiveCaregory(category, userInfo);
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
        userInfo.relevance[index].offline = "delete";
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
      userInfo.wordsToStudy[index].offline = "delete";

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
      let activeCategory = isActiveCaregory(id, userInfo);
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
        let now = Date.now() / millisecondsToDays;

        let word = userInfo?.relevance.filter(
          (item) => item.word == oldRelevance
        )[0];
        let totalCountMeets = word?.dateOfDetected?.length;

        let maxDateCheckRelevance =
          userInfo?.options?.[0]?.maxDateCheckRelevance;
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

      return { message, words: addedWords };
    },
  };
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
function isActiveCaregory(id, userInfo) {
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

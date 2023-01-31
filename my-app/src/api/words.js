export default function (instance, instanceToken) {
  return {
    addCategory(data) {
      return instanceToken.post("/words/category", data);
    },
    updateCategory(data) {
      return instanceToken.put("/words/category", data);
    },
    deleteCategory(data) {
      return instanceToken.delete(`/words/category/${data}`);
    },
    addWord(data) {
      return instanceToken.post("/words/word", data);
    },
    updateWord(data) {
      return instanceToken.put("/words/word", data);
    },
    deleteWord(data) {
      return instanceToken.delete(`/words/word/${data}`);
    },
    multipleDeleteWord(data) {
      return instanceToken.post("/words/delete-words", data);
    },
    startLearnCategory(data) {
      return instanceToken.post("/words/startLearnCategory", data);
    },
    addRelevance(data) {
      return instanceToken.post("/words/relevance", data);
    },
    pushLearnAnswers(data) {
      return instanceToken.post("/words/learnAnswer", data);
    },
    pushReLearnAnswers(data) {
      return instanceToken.post("/words/reLearnAnswer", data);
    },
    pushKnownAnswers(data) {
      return instanceToken.post("/words/knownAnswer", data);
    },
    pushReKnownAnswers(data) {
      return instanceToken.post("/words/reKnownAnswer", data);
    },
    pushRepeatAnswers(data) {
      return instanceToken.post("/words/repeatAnswer", data);
    },
    pushReRepeatAnswers(data) {
      return instanceToken.post("/words/reRepeatAnswer", data);
    },
    async translateAPI(word) {
      try {
        let response = await instance.post("/words/translateAPI");
        let API_KEY = response.data.API_KEY;

        response = await fetch(
          `https://speller.yandex.net/services/spellservice.json/checkText?text=${word}&lang=en`
        );
        let result = await response.json();

        let adviceWord = result.length > 0 ? result?.[0].s[0] || "" : "";

        response = await fetch(
          `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${API_KEY}&lang=en-ru&text=${word}`
        );
        result = await response.json();

        let adviceTranscription = "";
        let adviceTranslate = [];
        if (result?.def?.length > 0) {
          let def = result.def;
          for (let item of def) {
            if (item.text == word) {
              adviceTranscription =
                item.ts?.length > 0 && item.ts != "undefined"
                  ? `[${item.ts}]`
                  : adviceTranscription;
              let tr = item.tr.map((item) => item.text);
              adviceTranslate.push(...tr);
            }
          }
        }

        return { adviceWord, adviceTranslate, adviceTranscription };
      } catch (err) {
        console.log(err);
        return { adviceWord: "", adviceTranslate: [], adviceTranscription: "" };
      }
    },
    checkStreak() {
      return instanceToken.post("/words/streak");
    },
  };
}

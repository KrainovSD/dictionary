export default function (instance, instanceToken) {
  return {
    addCategory(data) {
      return instanceToken.post("/category", data);
    },
    updateCategory(data) {
      return instanceToken.put("/category", data);
    },
    deleteCategory(data) {
      return instanceToken.delete(`/category/${data}`);
    },
    addWord(data) {
      return instanceToken.post("/word", data);
    },
    updateWord(data) {
      return instanceToken.put("/word", data);
    },
    deleteWord(data) {
      return instanceToken.delete(`/word/${data}`);
    },
    startLearnCategory(data) {
      return instanceToken.post("/startLearnCategory", data);
    },
    addRelevance(data) {
      return instanceToken.post("/relevance", data);
    },
    pushLearnAnswers(data) {
      return instanceToken.post("/learnAnswer", data);
    },
    pushReLearnAnswers(data) {
      return instanceToken.post("/reLearnAnswer", data);
    },
    pushKnownAnswers(data) {
      return instanceToken.post("/knownAnswer", data);
    },
    pushReKnownAnswers(data) {
      return instanceToken.post("/reKnownAnswer", data);
    },
    pushRepeatAnswers(data) {
      return instanceToken.post("/repeatAnswer", data);
    },
    pushReRepeatAnswers(data) {
      return instanceToken.post("/reRepeatAnswer", data);
    },
    async translateAPI(word) {
      try {
        let response = await instance.post("/translateAPI");
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
                adviceTranscription.length > 0
                  ? adviceTranscription
                  : `[${item.ts}]`;
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
      return instanceToken.post("/streak");
    },
  };
}

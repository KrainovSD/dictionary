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
      return instanceToken.post("/test", data);
    },
    pushReLearnAnswers(data) {
      return instanceToken.post("/test", data);
    },
    pushKnownAnswers(data) {
      return instanceToken.post("/test", data);
    },
    pushReKnownAnswers(data) {
      return instanceToken.post("/test", data);
    },
    pushRepeatAnswers(data) {
      return instanceToken.post("/test", data);
    },
    pushReRepeatAnswers(data) {
      return instanceToken.post("/test", data);
    },
  };
}

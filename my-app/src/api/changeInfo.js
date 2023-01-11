export default function (instance, instanceToken) {
  return {
    forgot(data) {
      return instance.post("/forgot", data);
    },
    password(data) {
      return instance.post("/password", data);
    },
    info(data) {
      return instanceToken.post("/info", data);
    },
    email(data) {
      return instanceToken.post("/email", data);
    },
    avatar(data) {
      return instanceToken.post("/avatar", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    export() {
      return instanceToken.post("/export");
    },
    syncInfo(data) {
      let knownWords = data.knownWords.filter((item) => item.offline);
      let categoriesToLearn = data.categoriesToLearn.filter(
        (item) => item.offline
      );
      let wordsToStudy = data.wordsToStudy.filter((item) => item.offline);
      let wordsToRepeat = data.wordsToRepeat.filter((item) => item.offline);
      let relevance = data.relevance.filter((item) => item.offline);
      let statistics = data.statistics.filter((item) => item.offline);
      let options = data.options.filter((item) => item.offline);
      if (
        knownWords.length > 0 ||
        categoriesToLearn.length > 0 ||
        wordsToStudy.length > 0 ||
        wordsToRepeat.length > 0 ||
        relevance.length > 0 ||
        statistics.length > 0 ||
        options.length > 0
      )
        return instanceToken.post("/syncInfo", { userInfo: data });
      throw new Error("Синхронизация не требуется!");
    },
  };
}

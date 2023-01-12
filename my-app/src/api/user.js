export default function (instance, instanceToken) {
  return {
    forgot(data) {
      return instance.post("/user/forgot", data);
    },
    password(data) {
      return instance.post("/user/password", data);
    },
    info(data) {
      return instanceToken.post("/user/info", data);
    },
    email(data) {
      return instanceToken.post("/user/email", data);
    },
    avatar(data) {
      return instanceToken.post("/user/avatar", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    export() {
      return instanceToken.post("/user/export");
    },
    import(data) {
      return instanceToken.post("/user/import", data);
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
        return instanceToken.post("/user/syncInfo", { userInfo: data });
      throw new Error("Синхронизация не требуется!");
    },
    message(data) {
      return instanceToken.post("/user/message", data);
    },
  };
}

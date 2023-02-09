export default function (instanceToken) {
  return {
    getUserList() {
      return instanceToken.post("/admin/user-list");
    },
    addNewKnownWords(data) {
      return instanceToken.post("/admin/known-words", data);
    },
  };
}

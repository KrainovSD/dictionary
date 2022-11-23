export default function (instance) {
  return {
    login(data) {
      return instance.post("/login", data);
    },
    register(data) {
      return instance.post("/register", data);
    },
    logout() {
      return instance.post("/logout");
    },
    checkAuth() {
      return instance.post("/tokens");
    },
    confirm(data) {
      return instance.post("/confirm", data);
    },
  };
}

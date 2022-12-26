export default function (instance, instanceToken) {
  return {
    login(data) {
      return instance.post("/login", data);
    },
    register(data) {
      return instance.post("/register", data);
    },
    logout() {
      return instanceToken.post("/logout");
    },
    checkAuth() {
      return instance.post("/tokens");
    },
    confirm(data) {
      return instance.post("/confirm", data);
    },
  };
}

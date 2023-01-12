export default function (instance, instanceToken) {
  return {
    login(data) {
      return instance.post("/auth/login", data);
    },
    register(data) {
      return instance.post("/auth/register", data);
    },
    logout() {
      return instanceToken.post("/auth/logout");
    },
    checkAuth() {
      return instance.post("/auth/tokens");
    },
    confirm(data) {
      return instance.post("/auth/confirm", data);
    },
  };
}

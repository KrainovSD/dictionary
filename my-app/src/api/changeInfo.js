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
  };
}

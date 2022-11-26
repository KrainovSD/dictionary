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
  };
}

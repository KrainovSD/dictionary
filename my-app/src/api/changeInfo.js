export default function (instance, instanceToken) {
  return {
    forgot(data) {
      return instance.post("/forgot", data);
    },
    password(data) {
      return instance.post("/password", data);
    },
    changeInfo(data) {
      return instanceToken.post("/info", data);
    },
  };
}

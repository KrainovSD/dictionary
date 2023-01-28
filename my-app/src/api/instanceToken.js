import axios from "axios";
import store from "../store/index";
const HEADER = "Authorization";
//store.commit("setAccessToken", "dsdsdsd");
//store.getters.getAccessToken
axios.defaults.withCredentials = true; // DEV MOD
const instance = axios.create({
  timeout: 5000,
});

instance.interceptors.request.use(async function (request) {
  let accessToken = store.getters.getAccessToken;
  if (accessToken && accessToken.length > 0) {
    request.headers[HEADER] = `Bearer ${accessToken}`;
    return request;
  }
  return request;
});

instance.interceptors.response.use(
  (response) => response,
  async (err) => {
    try {
      if (err.response.status != 401) return Promise.reject(err);
      await refreshToken();
      const originalRequestConfig = err.config;
      delete originalRequestConfig.headers[HEADER];
      return instance.request(originalRequestConfig);
    } catch (error) {
      return Promise.reject(error);
    }
  }
  /*(err) => {
    if (err.response.status != 401) return Promise.reject(err);
    return refreshToken()
      .then(() => {
        const originalRequestConfig = err.config;
        delete originalRequestConfig.headers[HEADER];
        return instance.request(originalRequestConfig);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }*/
);

export default instance;

function refreshToken() {
  return new Promise((resolve, reject) => {
    axios
      .post(`/auth/tokens`)
      .then((res) => {
        let accessToken = res.data.token;
        store.commit("setAccessToken", accessToken);
        resolve(accessToken);
      })
      .catch((err) => {
        store.commit("resetAuth");
        reject(err);
      });
  });
}

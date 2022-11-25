import axios from "axios";
import config from "../../config";
import store from "../store/index";

//store.commit("setAccessToken", "dsdsdsd");
//store.getters.getAccessToken
axios.defaults.withCredentials = true; // DEV MOD
const instance = axios.create({
  baseURL: config.UI.host,
});

instance.interceptors.request.use(async function (request) {
  let accessToken = store.getters.getAccessToken;
  console.log(accessToken);
  if (!accessToken) {
    accessToken = refreshToken();
    accessToken
      .then((accessToken) => {
        request.headers.Authorization = `Bearer ${accessToken}`;
        return request;
      })
      .catch((err) => {
        console.log(err);
        store.commit("resetAuth");
        return {
          ...request,
          signal: AbortSignal.abort(), //
        };
      });
  }
  request.headers.Authorization = `Bearer ${accessToken}`;
  return request;
});

////////
instance.interceptors.response.use(
  (response) => {
    console.log(response);
    return response;
  },
  (err) => {
    console.log(err);
    return Promise.reject(err);
  }
);

export default instance;

function refreshToken() {
  return new Promise((resolve, reject) => {
    axios
      .post(`${config.UI.host}/tokens`)
      .then((res) => {
        if (res.data.code === 401) {
          reject("Need auth");
        }
        let accessToken = res.data.token;
        store.commit("setAccessToken", accessToken);
        resolve(accessToken);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
}

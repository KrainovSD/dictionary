import axios from "axios";
let instance;
const PRODUCTION = process.env.NODE_ENV == "production" ? true : false;
if (PRODUCTION) {
  instance = axios.create({
    timeout: 5000,
  });
} else {
  axios.defaults.withCredentials = true; // DEV MOD
  instance = axios.create({
    baseURL: "http://192.168.0.103:3000/",
    timeout: 5000,
  });
}
export default instance;

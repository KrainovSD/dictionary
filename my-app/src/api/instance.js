import axios from "axios";
axios.defaults.withCredentials = true; // DEV MOD
const instance = axios.create({
  timeout: 5000,
});
export default instance;

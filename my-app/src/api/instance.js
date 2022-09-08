import axios from 'axios';
import config from '../../config';
axios.defaults.withCredentials = true; // DEV MOD
const instance = axios.create({
    baseURL: config.UI.host
})
export default instance;
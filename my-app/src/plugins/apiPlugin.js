import api from '../api/index';
export default {
    install(Vue){
        Vue.config.globalProperties.$api = api
    }
}
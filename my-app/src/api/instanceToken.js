import axios from 'axios';
import config from '../../config';
import store from '../store/index';

axios.defaults.withCredentials = true; // DEV MOD
const instance = axios.create({
    baseURL: config.UI.host
})

instance.interceptors.request.use(async function(request){
    let tokenInfo = store.getters.getAccessToken();
    console.log(tokenInfo);
    if (tokenInfo) {
        let {accessToken, timeExist} = tokenInfo;
        if (Date.now() < timeExist) {
            request.headers.Authorization = `Bearer ${accessToken}`;
            return request;
        }
        accessToken = await refreshToken();
        request.headers.Authorization = `Bearer ${accessToken}`;
        return request;
    }
    let accessToken = await refreshToken();
    console.log(accessToken)
    request.headers.Authorization = `Bearer ${accessToken}`;
    return request;
})

export default instance;

function findTimeExistToken(option){
    let figure = option.slice(0, option.search(/\D/));
    let timeType = option.replace(figure, '');
    let newTimeExist; 
    switch (timeType){
        case 'm': 
            newTimeExist = figure * 60 * 1000;
            break;
        case 'h': 
            newTimeExist = figure * 60 * 60 * 1000;
            break;
        case 'd': 
            newTimeExist = figure * 24 * 60 * 60 * 1000;
            break;
        default: 
            console.log("somethingWrong");
            break; 
    }
    newTimeExist += Date.now();
    return newTimeExist;

}
function refreshToken(){
    return new Promise((resolve, reject)=>{
        axios.put(`${config.UI.host}/token`).then( res => {
            switch (res.status){
                case 200: {
                    let accessToken = res.data;
                    let timeExist = findTimeExistToken(config.common.lifeTimeAccessToken);
                    let tokenInfo = {accessToken: accessToken, timeExist: timeExist};
                    store.commit("setAccessToken", tokenInfo);
                    //localStorage.setItem('accessToken', JSON.stringify(tokenInfo));
                    //request.headers.Authorization = `Bearer ${accessToken}`;
                    resolve(accessToken);
                    break;
                }  
                case 203: {
                    let accessToken = res.data;
                    resolve(accessToken);
                    break;
                }       
                default:
                    console.log('something wrong');
                    break
            }//
            
        }).catch( err => reject(err));
    })
    
    
}
import axios from 'axios';
import config from '../../config';

const instance = axios.create({
    baseURL: config.UI.host
})

instance.interceptors.request.use(async function(request){
    let tokenInfo = localStorage?.getItem('accessToken');
    if (tokenInfo) {
        let {accessToken, timeExist} = JSON.parse(tokenInfo);
        if (Date.now() < timeExist) {
            request.headers.Authorization = `Bearer ${accessToken}`;
            return request;
        }
        accessToken = await refreshToken(request);
        request.headers.Authorization = `Bearer ${accessToken}`;
        return request;
    }
    let accessToken = await refreshToken(request);
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
function refreshToken(request){
    return new Promise((resolve, reject)=>{
        axios.put(`${config.UI.host}/token`).then( res => {
            switch (res.data.type){
                case 1: {
                    let accessToken = res.data.message;
                    let timeExist = findTimeExistToken(config.common.lifeTimeAccessToken);
                    let tokenInfo = {accessToken: accessToken, timeExist: timeExist};
                    localStorage.setItem('accessToken', JSON.stringify(tokenInfo));
                    request.headers.Authorization = `Bearer ${accessToken}`;
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
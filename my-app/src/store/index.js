import {createStore} from 'vuex'


const store = createStore({
    state(){
        return{
            auth: false,
            nickName: '',
            userName: '',
            role: 'guest',
            dataRegistration: '',
            avatar: '',
            accessToken: '',
            timeExistToken: '',
        }
    },
    getters: {
        getInfo(state){
            let user = {
                auth: state.auth,
                nickName: state.nickName,
                userName: state.userName,
                role: state.role,
                dataRegistration: state.dataRegistration,
                avatar: state.avatar,
                accessToken: state.accessToken,
                timeExistToken: state.timeExistToken,
            }
            return user;
        },
        getAccessToken(state){ 
            let accessToken = state.accessToken;
            let timeExistToken = state.timeExistToken;
            if (accessToken == '' || timeExistToken == '') return false;
            else return {accessToken: accessToken, timeExistToken: timeExistToken};
        },
        getAuth(state){
            return state.auth
        },
    },
    mutations: {
        setAccessToken(state, payload){
            let {accessToken, timeExistToken} = payload;
            if (typeof accessToken == 'string' && typeof timeExistToken == "string") {
            state.accessToken = accessToken;
            state.timeExistToken = timeExistToken; }
        },
        setAuth(state, payload) {
            if (typeof payload == 'boolean') state.auth = payload;
        },
        setUserInfo(state, payload){ 
            if (typeof payload.nickName === 'string' && typeof payload.userName === 'string' && typeof payload.role === 'string'){
                state.nickName = payload.nickName;
                state.userName = payload.userName;
                state.role = payload.role;
                state.dataRegistration = payload.dataRegistration;
                state.avatar = payload.avatar;
                state.auth = true;
            }
        },
        resetAuth(state){
            state.auth =  false;
            state.nickName = '';
            state.userName = '';
            state.role = 'guest';
            state.dataRegistration = '';
            state.avatar = '';
            state.accessToken = '';
            state.timeExistToken = '';
        },
    }

})

export default store;
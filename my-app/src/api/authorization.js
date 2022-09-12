export default function(instance){
    return{
        signIn(data){ 
            return instance.post('/login', data);
        },
        signUp(data){
            return instance.post('/signUp', data);
        },
        signOut(){
            return instance.post('/logout');
        },
        checkAuth(){
            return instance.put('/token');
        },

    }
}
export default function(instance){
        return{
            testGet(){
                return instance.get('/info');
            },
            testPost(payLoad){
                return instance.post('/info', payLoad);
            }
        }
        
    }

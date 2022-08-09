const express = require ('express'); 
const app = express();
//app.use(express.static('public'));
app.use(express.json()); // req.body only for application/json
// incorrect writting ^ may brings very big trouble 
app.use(express.urlencoded({extended: true})); // req.body only for application/x-www-form-urlencoded

const cookieParser = require('cookie-parser');
app.use(cookieParser()); // req.cookies

const fs = require('fs');
const {secretTokenKey} = JSON.parse(fs.readFileSync('./info.txt',  {encoding:'utf8', flag:'r'}));

const jwt = require('jsonwebtoken');

const path = require('path');
const url = require('url'); // req.url 
const config = require('./config.js');

const mongoose = require('mongoose');
connectToDB().catch( err => console.log(err));
async function connectToDB(){
    mongoose.connect(`mongodb://${config.server.dbHost}/${config.server.dbName}`, err => {
    if (err) throw err; 
    console.log('server has connected to MongoDB');
    })
}
const tokensSchema = new mongoose.Schema({
    token: {type: string, required: true}
}, {
    methods: {
        findSimiliarToken(cb){
            return mongoose.model('Tokens').find({token: this.token}, cb);
        }
    }
});
const usersSchema = new mongoose.Schema({
    userName: {type: string, required: true},
    nickName: {type: string, required: true},
    login: {type: string, required: true},
    password: {type: string, required: true},
    globalWord: {},
    categories: {},
    repeat: {}
});
const Tokens = mongoose.model('Tokens', tokensSchema);




/*
users: {
    id : string,
    userName: string, 
    nickName: string, 
    login: string,
    password: string, 
    globalWord: {
        word: {
                    transcription: string,
                    translate: string,
                }
    }
    categories: {
        nameCategory: {
            words: {
                word: {
                    transcription: string,
                    translate: string,
                }
            }
            options: {
                nameOption: string,
            }
        } 
    }
    repeat: {
        words: {
                word: {
                    transcription: string,
                    translate: string,
                }
            }
            options: {
                nameOption: string,
            }
    }
}
*/ 



app.listen(config.server.port, config.server.host, function(){ 
    console.log(`Server has started on port ${config.server.port} and host ${config.server.host}`)
});
/* middleware set headers to allow for another resources could send request */
app.use((request, response, next) => {
    response.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE,GET,POST,PUT',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization'
    });
    next();
});


/*GET — получение ресурса
POST — создание ресурса
PUT — обновление ресурса
DELETE — удаление ресурса */

app.get('/', (req,res)=>{
    console.log('work');
    res.send('Node.js and Express REST API');
})
app.get('/info', (req, res)=>{
    console.log(req.url);
    console.log(req.headers);
    res.send('1')
})    
app.post('/info', (req, res)=>{
    console.log(req.body)
    res.json('1');
})



app.put('/token', (req, res)=>{
    let refreshToken = req.cookies?.refreshToken; //
    console.log(refreshToken);
    
    const accessToken = jwt.sign({ userId: 'userID', username: 'user.username', role: 'user.role' }, secretTokenKey, { expiresIn: `${config.common.lifeTimeAccessToken}` });
    res.json({type: 1, message: accessToken});
})
app.post('/login', (req, res)=>{
    let {login, password} = req.body; //
    console.log(login, password) 

    const refreshToken = jwt.sign({ userId: 'userID', username: 'user.username', role: 'user.role' }, secretTokenKey);
    const token = new Tokens({token: refreshToken});

    const timeExistToken = getTimeExistToken(config.server.lifeTimeRefreshToken);
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        expires: timeExistToken
        // sameSite: strict - if UI exist inside domain
        // secure: true - if app use https protocol
    })
    res.json({type: 1, message: 'Login has completed successfully'})
})
app.post('/logout', (req, res) => {
    let refreshToken = req.cookies?.refreshToken;
    if (refreshToken) {
        const token = new Tokens({token: refreshToken});
        token.findSimiliarToken((err, token) => {
            console.log(token);
            res.send(1);
        })
    }
    

});

app.post('/logup', (req, res)=>{
    res.json(1);
})

function getTimeExistToken(options){
    let figure = options.slice(0, options.search(/\D/));
    let timeType = options.replace(figure, '');
    let timeExistToken = new Date();
    switch (timeType){
        case 'd': 
            timeExistToken.setDate(timeExistToken.getDate() + figure);
            break;
        case 'm': 
            timeExistToken.setMonth(timeExistToken.getMonth() + figure);
            break;
        case 'y': 
            timeExistToken.setFullYear(timeExistToken.getFullYear() + figure);
            break;
        default:
            console.log('something wrong');
            break
    }
    return timeExistToken.toUTCString();
    
}

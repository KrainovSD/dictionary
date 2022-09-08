const config = require('./config.js');
const express = require ('express'); 
const app = express();
//app.use(express.static('public'));
app.use(express.json()); // req.body only for application/json
// incorrect writting ^ may brings very big trouble 
app.use(express.urlencoded({extended: true})); // req.body only for application/x-www-form-urlencoded
module.exports = app;
const path = require('path');
const url = require('url'); // req.url 

const mongoose = require('mongoose');


const e = require('express');
const { NONAME } = require('dns');
connectToDB().catch( err => console.log(err));
async function connectToDB(){
    mongoose.connect(`mongodb://${config.server.dbHost}/${config.server.dbName}`, err => {
    if (err) throw err; 
    console.log('server has connected to MongoDB');
    })
}

app.listen(config.server.port, config.server.host, function(){ 
    console.log(`Server has started on port ${config.server.port} and host ${config.server.host}`)
});
/* middleware set headers to allow for another resources could send request
    CORS and Same-origin policy 
*/
app.use((request, response, next) => {
    //res.set('Access-Control-Allow-Credentials', 'true') - разрешение на куки 
    response.header({
        'Access-Control-Allow-Origin': 'http://127.0.0.1:8080',
        'Access-Control-Allow-Methods': 'DELETE,GET,POST,PUT',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Access-Control-Allow-Credentials' : "true",
        
    });
    next();
});
const routes = require('./routes/index.js');
app.use('/', routes.auth);

/*const cors = require('cors');
app.use(cors({credentials: true, origin: 'http://127.0.0.1:8080/'}))*/


/*GET — получение ресурса
POST — создание ресурса
PUT — обновление ресурса
DELETE — удаление ресурса */

/*const auth = require('./routes/auth.js');
app.use('/', auth);*/


/*
users: {
iserid: string,
userName: string,
nickName: string,
email: string,
hash: string,
salt: string,
role: string,
registration: string,
avatar: src, 
token: string, 
statistics:{
    startLearning: string,
    lastLearning: string,
    bestStreak: string,
}
en:{
    here all below
}
knownWorlds: {
    word:{
        translate: string,
        transcript: string,
        image: string,
        description: string,
        example: [of string],
        lastRepeat: string,
        lastReverseRepeat: string,
        dateOfCreation: string
    }
}
categories: {
    nameCategory: {
        regularityToRepeat:[of string],
        deleteAfterLearning: boolean,
        nextRepeat: string,
        lastRepeat: string,?
        storyRepeat:[of string]

    }
}
wordsOfCategories:{
    word:{
        translate: string,
        transcript: string,
        image: string,
        description: string,
        example: [of string],
        categories: [of string],
        dateOfCreation: string,
    }
}
repeatWords: {
    words:{
        word:{
            translate: string,
            transcript: string,
            image: string,
            description: string,
            example: [of string],
            nextRepeat: string,
            lastRepeat: string,?
            storyRepeat:[of string]

        }
    }
    options: {
        automaticallyAddToRepeat: boolean,
        regularityToRepeat: [of string]
        }
    }
}


*/ 













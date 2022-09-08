const config = require('../config.js');
const express = require('express');
const router = express.Router();
const app = require('../app');
const path = require('path');
const url = require('url'); // req.url 

require('mongoose');
const User = require('../schemas/user');

const crypto = require('node:crypto'); 
const iterations = 10000;
const { pbkdf2, pbkdf2Sync } = require('crypto');

const fs = require('fs');
const {secretAccessToken, secretRefreshToken, secretPassword} = JSON.parse(fs.readFileSync('./info.txt',  {encoding:'utf8', flag:'r'}));
console.log(secretAccessToken, secretRefreshToken, secretPassword)

const jwt = require('jsonwebtoken');

const cookieParser = require('cookie-parser');
app.use(cookieParser()); // req.cookies

const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: config.server.postLog,
      pass: config.server.postPass, // !!
    },
    tls: {
        rejectUnauthorized: false
    },
});





router.put('/token', (req, res)=>{
    let refreshToken = req.cookies?.refreshToken; //
    if (typeof refreshToken == 'string'){
        jwt.verify(refreshToken, secretRefreshToken, (err, token) => {
            if (err) {
                if (/jwt expired/.test(err)) {
                    res.status(203);
                    return res.json('Need authorization')
                }
                else { 
                    console.log(err);
                    res.status(202);
                    return res.json('Something wrong')
                }
                
            }
            
            console.log(token);
            User.find({token: refreshToken}, (err, docs) =>{
                if (err) console.log(err);
                else if (typeof docs !== 'undefined' && docs.length > 0){
                    console.log(docs);
                    if (token.nickName == docs[0].nickName){
                        const accessToken = jwt.sign({ userId: docs[0]._id, username: docs[0].userName, role: docs[0].role, access: 'true'}, secretAccessToken, { expiresIn: `${config.common.liveTimeAccessToken}` });
                        res.status(200);
                        res.json(accessToken);
                    } 
                }
                else {
                    res.status(203);
                    res.json('Need authorization')
                }
                
            })
 
        })
    }
    else {
        res.status(203);
        res.json('Need authorization')
    }
    
    
})
router.post('/login', (req, res)=>{
    let {nickName, password} = req.body; //validate
    User.find({nickName: nickName}, (err, docs) => {
        if (err) console.log(err);
        docs = docs[0];
        let userInfo = {
            nickName: docs.nickName,
            userName: docs.userName, 
            role: docs.role,
        };
        let hash = pbkdf2Sync(password+docs.salt, secretPassword+docs.salt, iterations, 512, 'sha512');
        hash = hash.toString('hex');
        if (hash != docs.hash) {
            res.status(202);
            res.json('Password is not correct');   
        }
        else if (docs.confirmed == false) {
            res.status(203);
            res.json('Account is not confirmed. Please, check your email and follow instruction'); 
        }
        else {
            const refreshToken = jwt.sign({ nickName: docs.nickName, username: docs.userName, role: docs.role}, secretRefreshToken, {expiresIn: `${config.server.liveTimeRefreshToken}`});
            User.updateOne(
                {nickName: docs.nickName}, 
                {token: refreshToken}, 
                {upsert: false}, 
                (err, docs) => {
                if (err) console.log(err);
                if (docs.modifiedCount > 0) {
                    let timeExistCookies = getTimeExistCoockies(config.server.liveTimeRefreshToken);
                    console.log(timeExistCookies);
                    res.cookie('refreshToken', refreshToken, {
                        httpOnly: true,
                        expires: timeExistCookies,
                        sameSite: 'None', // DEV OPTIONS
                        secure: true, // DEV OPTIONS
                        // sameSite: strict - if UI exist inside domain
                        // secure: true - if app use https protocol
                    })
                    res.status(200);
                    res.json({type: 1, message: 'Login has completed successfully', userInfo: userInfo});
                 }
                 else {
                     res.status(201);
                     res.json('Something wrong');
                 }  
            })
        }
    })



    


    
})
router.post('/logout', (req, res) => {
    let refreshToken = req.cookies?.refreshToken;
    console.log(refreshToken);
    if (typeof refreshToken == 'string'){
        jwt.verify(refreshToken, secretRefreshToken, (err, token) => {
            if (/jwt expired/.test(err) || !err) {
                User.updateOne(
                    {token: refreshToken}, 
                    {token: 'none'}, 
                    {upset: true},
                    (err, docs) => {
                        if (err) console.log(err);
                        if (docs.modifiedCount > 0) {
                            res.status(200);
                            res.json('you have successfully logged out') 
                        }
                        else {
                            res.status(201);
                            res.json('something wrong');
                        }
                    })
            }
            else if (err) console.log(err);

        })
    }
    else {
        res.status(202);
        res.json('You are not authorized');
    }
});


router.get('/confirm', (req,res)=>{
    let id = req.query.id;
    User.updateOne(
        {_id: id}, 
        {confirmed: true}, 
        {upsert: false, // Если не будет найдена запись, проигнорирует обновление, если true добавит запись новую запись со значением
        useFindAndModify: true}, // ???Обновит документ и возвратит его
        (err, docs) => {
            if (err) console.log(err);
            if (docs.modifiedCount > 0) {
            res.status(200);
            res.json('Account has been confirmed successfully') 
            }
            else if (docs.matchedCount > 0){
                res.status(201);
                res.json('Account had been confirmed');
            }
            else {
                res.status(404);
                res.json('Page Not Found');
            }
        
    })
    
})

router.post('/signUp', (req, res)=>{
    let {nickName, userName, email, password} = req.body; // validate

    User.find({$or: [{nickName: nickName}, {email: email}]}, (err, docs) => {
        if (err) console.log('ERRROR: '+err);
        else {
            if (typeof docs !== 'undefined' && docs.length > 0){
                let similarEmail = false;
                let similarNickName = false;
                Object.keys(docs).forEach( el => {
                    if (docs[el].email === email) similarEmail = true;
                    if (docs[el].nickName === nickName) similarNickName = true;
                })
                if (similarEmail && similarNickName){
                    res.status(201);
                    res.json('nickName and Email has been used by another user')
                }
                else if (similarEmail) {
                    res.status(201);
                    res.json('Email has been used by another user')
                }
                else if (similarNickName){
                    res.status(201);
                    res.json('nickName has been used by another user')   
                }
            }
            else{
                let salt = crypto.randomBytes(128).toString('base64');
                let hash = pbkdf2Sync(password+salt, secretPassword+salt, iterations, 512, 'sha512');
                hash = hash.toString('hex');

                

                // send EMAIL and check existing EMAIL !@!!!
                const new_user = new User({
                    userName: userName,
                    nickName: nickName,
                    email: email,
                    hash: hash,
                    salt: salt,
                    dateRegistration: Date.now(),
                    role: 'user',
                    confirmed: false,
                    avatar: 'none',
                    token: 'none',
                })
                const message = {
                    from: config.server.postLog,
                    to: email,
                    subject: `Confirmation`,
                    text: `follow the link in order to confirm your account http://${config.server.host}:${config.server.port}/confirm?id=${new_user._id.toString('hex')}`,
                    html: `follow the link in order to confirm your account <a href="http://${config.server.host}:${config.server.port}/confirm?id=${new_user._id.toString('hex')}">Confirm</a> `,
                };
                transporter.sendMail(message, (err, info) => {
                    if (err) console.log(err);
                    else {
                        //console.log(info);
                        new_user.save((err,result) => {
                            if (err){
                                console.log("errror:  "+err);
                            }
                            else{
                                res.status(200);
                                res.json('Registration has completed successfully. We have sent message to your email. Check message and follow instruction in order to confirm your account');
                            }
                        })
                    }
                })


                
            }
            
        }
    });
    
})

function getTimeExistCoockies(options){
    let figure = options.slice(0, options.search(/\D/));
    let timeType = options.replace(figure, '');
    let timeExistToken = new Date();
    figure = +figure;
    switch (timeType){
        case 'd': 
            timeExistToken.setDate(timeExistToken.getDate() + figure);
            break;
        case 'm': 
            timeExistToken.setMinutes(timeExistToken.getMinutes() + figure);
            break;
        case 'h': 
            timeExistToken.setHours(timeExistToken.getHours() + figure);
            break;
        default:
            console.log('something wrong');
            break;
    }
    return timeExistToken;
    
}


module.exports = router;
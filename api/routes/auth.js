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
                    return res.json({type: 2, message: 'Need authorization'})
                }
                else { 
                    console.log(err);//
                    res.status(500);
                    return res.json({type: 500, message: err});
                }
                
            }
            
            console.log(token);
            User.find({token: refreshToken}, (err, docs) =>{
                if (err) {
                    res.status(500);
                    res.json({type: 500, message: err});
                    console.log(err);//
                }
                else if (typeof docs !== 'undefined' && docs.length > 0){
                    console.log(docs);
                    if (token.nickName == docs[0].nickName){
                        const accessToken = jwt.sign({ userId: docs[0]._id, username: docs[0].userName, role: docs[0].role, access: 'true'}, secretAccessToken, { expiresIn: `${config.common.liveTimeAccessToken}` });
                        let userInfo = {
                            nickName : docs[0].nickName,
                            userName: docs[0].userName,
                            role: docs[0].role,
                            dataRegistration: docs[0].dataRegistration,
                            avatar: docs[0].avatar,
                        }
                        res.status(200);
                        res.json({type: 1, token: accessToken, userInfo: userInfo});
                        //res.json(accessToken,);
                    } 
                }
                else {
                    res.json({type: 2, message: 'Need authorization'})
                }
                
            })
 
        })
    }
    else {
        res.json({type: 2, message: 'Need authorization'})
    }
    
    
})
router.post('/login', (req, res)=>{
    let {nickName, password} = req.body; //validate
    User.find({nickName: nickName}, (err, docs) => {
        if (err) {
            res.status(500);
            res.json({type: 500, message: err});
            console.log(err);//
        }
        console.log(docs);
        if (docs.length == 0) {
            res.json({type: 4, message: 'Account is not exist'});  
        }
        else {
            docs = docs[0];
            let userInfo = {
                nickName: docs.nickName,
                userName: docs.userName, 
                role: docs.role,
                dataRegistration: docs.dataRegistration,
                avatar: docs.avatar,
            };
            let hash = pbkdf2Sync(password+docs.salt, secretPassword+docs.salt, iterations, 512, 'sha512');
            hash = hash.toString('hex');
            if (hash != docs.hash) {
                res.json({type: 2, message: 'Password is not correct'});  
            }
            else if (docs.confirmed == false) {
                res.json({type: 3, message: 'Account is not confirmed. Please, check your email and follow instruction'});
            }
            else {
                const refreshToken = jwt.sign({ nickName: docs.nickName, username: docs.userName, role: docs.role}, secretRefreshToken, {expiresIn: `${config.server.liveTimeRefreshToken}`});
                User.updateOne(
                    {nickName: docs.nickName}, 
                    {token: refreshToken}, 
                    {upsert: false}, 
                    (err, docs) => {
                    if (err) {
                        res.status(500);
                        res.json({type: 500, message: err});
                        console.log(err);//
                    }
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
                        res.status(500);
                        res.json('Something wrong');
                    }  
                })
            }
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
                        if (err) {
                            res.status(500);
                            res.json({type: 500, message: err});
                            console.log(err);//
                        }
                        if (docs.modifiedCount > 0) {
                            res.status(200);
                            res.json({type: 1, message: 'you have successfully logged out'}) 
                        }
                        else {
                            res.json({type: 2, message: 'You are not authorized'}) 
                        }
                    })
            }
            else if  (!/jwt expired/.test(err)) {
                res.status(500);
                res.json({type: 500, message: err});
                console.log(err);//
            }

        })
    }
    else {
        res.json({type: 2, message: 'You are not authorized'}) 
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
            if (err) {
                res.status(500);
                res.json({type: 500, message: err});
                console.log(err);//
            }
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
    let validatedErrors = validateForm(req.body);
    if (validatedErrors.length > 0) {
        res.json({type: 2, message: validatedErrors});
    }
    else { 
        User.find({$or: [{nickName: nickName}, {email: email}]}, (err, docs) => {
            if (err) {
                res.status(500);
                res.json({type: 500, message: err});
                console.log(err);//
            }
            else {
                if (typeof docs !== 'undefined' && docs.length > 0){
                    let similarEmail = false;
                    let similarNickName = false;
                    Object.keys(docs).forEach( el => {
                        if (docs[el].email === email) similarEmail = true;
                        if (docs[el].nickName === nickName) similarNickName = true;
                    })
                    if (similarEmail && similarNickName){
                        res.json({type: 2, message: 'nickName and Email has been used by another user'});
                    }
                    else if (similarEmail) {
                        res.json({type: 2, message: 'Email has been used by another user'});
                    }
                    else if (similarNickName){
                        res.json({type: 2, message: 'nickName has been used by another user'});
                    }
                }
                else {
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
                        if (err) {
                            res.status(500);
                            res.json({type: 500, message: err});
                            console.log(err);//
                        }
                        else {
                            //console.log(info);
                            new_user.save((err,result) => {
                                if (err) {
                                    res.status(500);
                                    res.json({type: 500, message: err});
                                    console.log(err);//
                                }
                                else{
                                    res.status(200);
                                    res.json({type: 1, message: 'Registration has completed successfully. We have sent message to your email. Check message and follow instruction in order to confirm your account'});
                                }
                            })
                        }
                    })


                    
                }
                
            }
    
        });
    } 
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
function validateForm(form) {
    let errors = {};
    Object.keys(form).forEach((key) => {
      if (typeof form[key] !== "string") {
        errors[key] = `Неверный тип данных у поля ${key}!`;
        return;
      }
      if (form[key].length == 0) {
        errors[key] = `Поле ${key} обязательно для заполнения!`;
        return;
      }
      switch (key) {
        case "nickName":
          if (!/^([A-Za-z0-9_]+)$/.test(form[key])) {
            errors[key] =
              "NickName должнен состоять только из латинских букв, цифр или символа нижнего подчеркивания!";
            return;
          }
          if (form[key].length < 3 && form[key].length > 25) {
            errors[key] =
              "Длина NickName не должна превышать 25 символов или быть меньше, чем 3 символа!";
            return;
          }
          break;
        case "userName":
          if (!/^([A-Za-zА-Яа-я]+)$/.test(form[key])) {
            errors[key] =
              "Имя может содержать только латинские или русские буквы!";
            return;
          }
          if (form[key].length < 2 && form[key].length > 15) {
            errors[key] =
              "Длина Имени не должна превышать 15 символов или быть меньше, чем 2 символа! Если ваше имя содержит более 15-ти символов, используйте, пожалуйста, сокращенную версию!";
            return;
          }
          break;
        case "email":
          if (
            !/^[a-z0-9][a-z0-9-_.]+@([a-z]|[a-z0-9]?[a-z0-9-]+[a-z0-9]).[a-z0-9]{2,10}(?:.[a-z]{2,10})?$/.test(
              form[key]
            )
          ) {
            errors[key] = "Неверный формат введенного Email!";
            return;
          }
          break;
        case "password":
          if (form[key].length < 8) {
            errors[key] =
              "Пароль должен состоять не менее, чем из 8 символов!";
            return;
          }
          break;
        case "repeatPassword":
          if (!(form[key] === form.password)) {
            errors[key] = "Пароли не совпадают!";
            return;
          }
          break;
        default:
          break;
      }
    });
    let info = '';
    if (errors.length > 0) {
        
        Object.keys(errors).forEach( key => {
            info = `${errors[key]} /n`;
        })
    }
    return info;
}

module.exports = router;
import config from '../config.js';

import User from "../models/Users.js";

import crypto from "node:crypto";
const iterations = 10000;
import { pbkdf2, pbkdf2Sync } from 'crypto';

import fs from 'fs';
const {secretAccessToken, secretRefreshToken, secretPassword} = JSON.parse(fs.readFileSync('./info.txt',  {encoding:'utf8', flag:'r'}));
console.log(secretAccessToken, secretRefreshToken, secretPassword)

import jwt from 'jsonwebtoken';

import nodemailer from "nodemailer";
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


export const register = async(req, res) => {
    try {
        let users = await User.find({$or: [{nickName: req.body.nickName}, {email: req.body.email}]});
        if (users.length > 0) { 
            return res.status(400).json({
                message: checkSimilarField(users, req.body)
            });
        }
        let salt = crypto.randomBytes(128).toString('base64');
        let hash = pbkdf2Sync(req.body.password+salt, secretPassword+salt, iterations, 512, 'sha512');
        hash = hash.toString('hex');

        const doc = new User({
            userName: req.body.userName,
            nickName: req.body.nickName,
            email: req.body.email,
            hash,
            salt,
            dateRegistration: Date.now(),
            role: 'user',
            confirmed: false,
            avatar: 'none',
            token: 'none',
        });
        const user = await doc.save();
        console.log(user);

        const message = {
            from: config.server.postLog,
            to: req.body.email,
            subject: `Confirmation`,
            text: `follow the link in order to confirm your account http://${config.server.host}:${config.server.port}/confirm?id=${user._id}`,
            html: `follow the link in order to confirm your account <a href="http://${config.server.host}:${config.server.port}/confirm?id=${user._id}">Confirm</a> `,
        };
        await transporter.sendMail(message);

        res.json({
            message: 'Registration has completed successfully. We have sent message to your email. Check message and follow instruction in order to confirm your account'
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Couldn't register"
        }); 
    }
};

export const confirm = async(req, res) =>{
    try {

        let user = await User.updateOne(
            {
                _id: req.query.id,
            }, 
            {
                confirmed: true
            }, 
            {
                upsert: false, // Если не будет найдена запись, проигнорирует обновление, если true добавит запись новую запись со значением
                useFindAndModify: true
            }
        );
        if (user.modifiedCount == 0) {
            return res.status(404).json("Not Found"); 
        }
        return res.json("Account has been confirmed successfully");
    } catch (err) {
        console.log(err);
        return res.status(404).json("Not Found"); 
    }
};

export const login = async(req, res) => {
    try {
        let user = await User.findOne({nickName: req.body.nickName});
        if (!user) {
            return res.status(400).json({
                message: "Login or password isn't correct"
            });
        }
        let reqHash = pbkdf2Sync(req.body.password+user.salt, secretPassword+user.salt, iterations, 512, 'sha512');
        reqHash = reqHash.toString('hex');
        
        if (reqHash != user.hash) {
            return res.status(400).json({
                message: "Login or password isn't correct"
            });
        }
        if (user.confirmed == false) {
            return res.status(400).json({
                message: "Account is not confirmed. Please, check your email and follow instruction"
            });
        }
        const refreshToken = jwt.sign({ id: user._id}, secretRefreshToken, {expiresIn: `${config.server.liveTimeRefreshToken}`});
        await User.updateOne(
            {
                nickName: user.nickName
            }, 
            {
                token: refreshToken
            }, 
            {
                upsert: false
            }
        );
        const timeExistCookies = getTimeExistCoockies(config.server.liveTimeRefreshToken);
        console.log(timeExistCookies);
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            expires: timeExistCookies,
            sameSite: 'None', // DEV OPTIONS
            secure: true, // DEV OPTIONS
            // sameSite: strict - if UI exist inside domain
            // secure: true - if app use https protocol
        });
        const userInfo = {
            nickName: user.nickName,
            userName: user.userName, 
            role: user.role,
            dateRegistration: user.dateRegistration,
            avatar: user.avatar,
        };
        res.json(userInfo);      

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Couldn't login"
        });
    }
};

export const logout = async(req, res) => {
    try {
        let refreshToken = req.cookies?.refreshToken;
        if (!refreshToken) {
            return res.status(400).json({
                message: "You are already not authorized"
            });
        }
        try {
            let decoded = jwt.verify(refreshToken, secretRefreshToken);
        } catch (err) {
            return res.status(400).json({
                message: "You are already not authorized"
            });
        }
        let user = await User.updateOne(
            {
                token: refreshToken
            }, 
            {
                token: 'none'
            }, 
            {
                upset: true
            }
        );
        if (user.modifiedCount == 0) {
            return res.status(400).json({
                message: "You are already not authorized"
            });
        }
        return res.json({
            message: "You have successfully logout"
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Something wrong"
        });
    }
};

export const updateAccessToken = async(req, res) => {
    try {
        let refreshToken = req.cookies?.refreshToken;
        console.log(refreshToken);
        if (!refreshToken) {
            return res.status(403).json({
                message: "Need authorization"
            });
        };

        try {
            let decoded = jwt.verify(refreshToken, secretRefreshToken);     
        } catch (err) {
            console.log(err);
            return res.status(403).json({
                message: "Need authorization"
            });
        }
        
        let user = await User.findOne({token: refreshToken});
        console.log(user);
        if (!user) { 
            return res.status(403).json({
                message: "Need authorization"
            });
        }
        const accessToken = jwt.sign(
            { 
                userId: user._id
            }, 
            secretAccessToken, 
            { 
                expiresIn: `${config.common.liveTimeAccessToken}` 
            }
        );
        const userInfo = {
            nickName: user.nickName,
            userName: user.userName, 
            role: user.role,
            dateRegistration: user.dateRegistration,
            avatar: user.avatar,
        };
        console.log('done')
        return res.json({
            token: accessToken, 
            userInfo
        });  

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Couldn't update token"
        });
    };
};



function checkSimilarField(users, reqData){
    let similarEmail = false;
    let similarNickName = false;
    users.forEach( user => {
        if (user.nickName === reqData.nickName && user.email === reqData.email) {
            similarEmail = true;
            similarNickName = true;
        } else if (user.nickName === reqData.nickName) {
            similarNickName = true;
        } else if (user.email === reqData.email) {
            similarEmail = true;
        }
    });
    if (similarEmail && similarNickName) {
        return "Email and NickName is already used";
    } else if (similarNickName) {
        return "NickName is already used";
    } else if (similarEmail) {
        return "Email is already used";
    }
}
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
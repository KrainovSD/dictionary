require('mongoose');
const User = require('../schemas/user');

const crypto = require('node:crypto'); 
const iterations = 10000;
const { pbkdf2, pbkdf2Sync } = require('crypto');

const config = require('../config.js');
const fs = require('fs');
const {secretAccessToken, secretRefreshToken, secretPassword} = JSON.parse(fs.readFileSync('./info.txt',  {encoding:'utf8', flag:'r'}));
console.log(secretAccessToken, secretRefreshToken, secretPassword)


const jwt = require('jsonwebtoken');

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



function tokenVerify(refreshToken){
    return new Promise((resolve, reject)=> {
        if (typeof refreshToken == 'string'){
            jwt.verify(refreshToken, secretRefreshToken, (err, token) => {
                if (err) {
                    if (/jwt expired/.test(err)) {
                        reject({type: 2, message: 'Need authorization'});
                    }
                    else { 
                        console.log(err);//
                        res.status(500);
                        reject({type: 500, message: err});
                    };
                }
                else{
                    findUser('token', refreshToken)
                    .then( docs => {
                        const accessToken = jwt.sign({ userId: docs._id, username: docs.userName, role: docs.role, access: 'true'}, secretAccessToken, { expiresIn: `${config.common.liveTimeAccessToken}` });
                        const userInfo = {
                        nickName : docs.nickName,
                        userName: docs.userName,
                        role: docs.role,
                        dataRegistration: docs.dataRegistration,
                        avatar: docs.avatar,
                        }
                        resolve({type: 1, token: accessToken, userInfo: userInfo});  
                    })
                    .catch( err => {
                        console.log(err);//
                        if (err.type == 2) { 
                            reject ({type: 2, message: 'Need authorization'})    
                        }
                        else {
                            reject(err);
                        };
                    });
                };
            });
        }
        else {
            reject({type: 2, message: 'Need authorization'});
        };
    });

};

function findUser(field, dataField){
    return new Promise((resolve, reject)=>{
        User.find({[field]: dataField}, (err, docs) => {
            if (err) {
                console.log(err);//
                reject({type: 500, message: err});
            }
            else if (typeof docs !== 'undefined' && docs.length > 0){
                resolve(docs[0]);
            }
            else {
                reject({type: 2, message: 'Have not user'})
            };
        });
    });

};


module.exports = {
    findUser: findUser,
    tokenVerify: tokenVerify,
}
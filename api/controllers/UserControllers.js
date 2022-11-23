import config from '../config.js';

import User from '../models/Users.js';

import crypto from 'node:crypto';
const iterations = 10000;
import { pbkdf2, pbkdf2Sync } from 'crypto';

import fs from 'fs';
const { secretAccessToken, secretRefreshToken, secretPassword } = JSON.parse(
  fs.readFileSync('./info.txt', { encoding: 'utf8', flag: 'r' })
);
console.log(secretAccessToken, secretRefreshToken, secretPassword);

import jwt from 'jsonwebtoken';

import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.server.postLog,
    pass: config.server.postPass, // !!
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const register = async (req, res) => {
  try {
    let users = await User.find({
      $or: [{ nickName: req.body.nickName }, { email: req.body.email }],
    });
    if (users.length > 0) {
      return res.status(400).json({
        message: checkSimilarField(users, req.body),
      });
    }
    let salt = crypto.randomBytes(128).toString('base64');
    let hash = pbkdf2Sync(
      req.body.password + salt,
      secretPassword + salt,
      iterations,
      512,
      'sha512'
    );
    hash = hash.toString('hex');

    const doc = new User({
      userName: req.body.userName,
      nickName: req.body.nickName,
      email: req.body.email,
      hash,
      salt,
      role: 'user',
      dateOfPassword: Date.now(),
      resetPasswordKey: 'none',
      resetPasswordTime: 0,
      confirmed: false,
      dateRegistration: Date.now(),
      avatar: 'none',
      refreshToken: 'none',
      lastLogin: 0,
      statistics: [
        {
          lastLearning: 0,
          bestStreak: 0,
        },
      ],
      knownWords: [],
      categoriesToLean: [],
      wordsToStudy: [],
      wordsToRepeat: [],
      relevance: [],
      options: [
        {
          countKnownWordsAtOneTime: 50,
          countWrongsToAddToRepeat: 3,
          regularityToRepeat: [2, 2, 2, 4, 4, 4, 8, 8],
          maxDateChekRelevance: 45,
          maxCountCheckRelevance: 3,
        },
      ],
    });
    const user = await doc.save();
    console.log(user);

    const message = {
      from: config.server.postLog,
      to: req.body.email,
      subject: `Confirmation`,
      text: `follow the link in order to confirm your account http://${config.server.host}:${config.server.port}/confirm/${user._id}`,
      html: `follow the link in order to confirm your account <a href="http://${config.server.host}:${config.server.port}/confirm/${user._id}">Confirm</a> `,
    };
    console.log(message.text, message.html, message);
    await transporter.sendMail(message);

    res.json({
      message:
        'Registration has completed successfully. We have sent message to your email. Check message and follow instruction in order to confirm your account',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Couldn't register",
    });
  }
};

export const confirm = async (req, res) => {
  try {
    let user = await User.updateOne(
      {
        _id: req.body.id,
      },
      {
        confirmed: true,
      },
      {
        upsert: false, // Если не будет найдена запись, проигнорирует обновление, если true добавит запись новую запись со значением
      }
    );
    if (user.modifiedCount == 0) {
      return res.status(404).json({ message: 'Not Found account' });
    }
    return res.json({ message: 'Account has been confirmed successfully' });
  } catch (err) {
    console.log(err);
    return res.status(404).json({ message: 'Not Found account' });
  }
};

export const login = async (req, res) => {
  try {
    let user = await User.findOne({ nickName: req.body.nickName });
    if (!user) {
      return res.status(400).json({
        message: "Login or password isn't correct",
      });
    }
    let reqHash = pbkdf2Sync(
      req.body.password + user.salt,
      secretPassword + user.salt,
      iterations,
      512,
      'sha512'
    );
    reqHash = reqHash.toString('hex');

    if (reqHash != user.hash) {
      return res.status(400).json({
        message: "Login or password isn't correct",
      });
    }
    if (user.confirmed == false) {
      return res.status(400).json({
        message:
          'Account is not confirmed. Please, check your email and follow instruction',
      });
    }
    const refreshTokenToSetCoockies = jwt.sign(
      { id: user._id },
      secretRefreshToken,
      {
        expiresIn: `${config.server.liveTimeRefreshToken}`,
      }
    );
    await User.updateOne(
      {
        nickName: user.nickName,
      },
      {
        refreshToken: refreshTokenToSetCoockies,
      },
      {
        upsert: false,
      }
    );
    const timeExistCookies = getTimeExistCoockies(
      config.server.liveTimeRefreshToken
    );
    res.cookie('refreshToken', refreshTokenToSetCoockies, {
      httpOnly: true,
      expires: timeExistCookies,
      sameSite: 'None', // DEV OPTIONS
      secure: true, // DEV OPTIONS
      // sameSite: strict - if UI exist inside domain
      // secure: true - if app use https protocol
    });
    let {
      _id,
      hash,
      salt,
      refreshToken,
      resetPasswordKey,
      resetPasswordTime,
      confirmed,
      ...userData
    } = user._doc;
    userData.email = replaceEmailToStar(userData.email);
    res.json(userData);
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Couldn't login",
    });
  }
};

export const logout = async (req, res) => {
  try {
    let refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(400).json({
        message: 'You are already not authorized',
      });
    }
    try {
      let decoded = jwt.verify(refreshToken, secretRefreshToken);
    } catch (err) {
      return res.status(400).json({
        message: 'You are already not authorized',
      });
    }
    let user = await User.updateOne(
      {
        refreshToken: refreshToken,
      },
      {
        refreshToken: 'none',
      },
      {
        upset: true,
      }
    );
    if (user.modifiedCount == 0) {
      return res.status(400).json({
        message: 'You are already not authorized',
      });
    }
    return res.json({
      message: 'You have successfully logout',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Something wrong',
    });
  }
};

export const updateAccessToken = async (req, res) => {
  try {
    let refreshTokenFromCoockies = req.cookies?.refreshToken;
    if (!refreshTokenFromCoockies) {
      return res.status(401).json({
        message: 'Need authorization',
      });
    }

    try {
      let decoded = jwt.verify(refreshTokenFromCoockies, secretRefreshToken);
    } catch (err) {
      console.log(err);
      return res.status(401).json({
        message: 'Need authorization',
      });
    }

    let user = await User.findOne({ token: refreshTokenFromCoockies });
    if (!user) {
      return res.status(401).json({
        message: 'Need authorization',
      });
    }
    const accessToken = jwt.sign(
      {
        userId: user._id,
      },
      secretAccessToken,
      {
        expiresIn: `${config.common.liveTimeAccessToken}`,
      }
    );
    let { _id, hash, salt, refreshToken, ...userData } = user._doc;
    userData.email = replaceEmailToStar(userData.email);
    return res.json({
      token: accessToken,
      user: userData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Couldn't update token",
    });
  }
};

function checkSimilarField(users, reqData) {
  let similarEmail = false;
  let similarNickName = false;
  users.forEach((user) => {
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
    return 'Email and NickName is already used';
  } else if (similarNickName) {
    return 'NickName is already used';
  } else if (similarEmail) {
    return 'Email is already used';
  }
}
function getTimeExistCoockies(options) {
  let figure = options.slice(0, options.search(/\D/));
  let timeType = options.replace(figure, '');
  let timeExistToken = new Date();
  figure = +figure;
  switch (timeType) {
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
function replaceEmailToStar(email) {
  let start;
  let length = email.length;
  let star = '*';
  if (length - 8 > 0) start = 5;
  else if (length - 6 > 0) start = 3;
  else if (length - 5 > 0) start = 2;
  else return email;
  let end = length - 3;
  for (let i = 1; i < end - start; i++) {
    star += '*';
  }
  return email.replace(email.slice(start, end), star);
}

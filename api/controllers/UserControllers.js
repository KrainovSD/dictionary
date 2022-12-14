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

import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

    let confirmKey = crypto.randomBytes(128).toString('base64');
    confirmKey = confirmKey.replace(/\//g, '');

    const doc = new User({
      userName: req.body.userName,
      nickName: req.body.nickName,
      email: '',
      hash,
      salt,
      role: 'user',
      dateOfPassword: Date.now(),
      resetPasswordKey: '',
      resetPasswordTime: 0,
      confirmed: false,
      dateOfConfirm: 0,
      confirmKey: confirmKey,
      confirmTime: 0,
      emailToConfirm: req.body.email,
      dateRegistration: Date.now(),
      avatar: '',
      refreshToken: '',
      lastLogin: 0,
      statistics: [
        {
          lastLearning: 0,
          bestStreak: 0,
          lastRepeatKnownWords: 0,
          lastReverseRepeatKnownWords: 0,
        },
      ],
      knownWords: [],
      categoriesToLearn: [],
      wordsToStudy: [],
      wordsToRepeat: [],
      relevance: [],
      options: [
        {
          countKnownWordsAtOneTime: 50,
          countWrongsToAddToRepeat: 3,
          regularityToRepeat: [2, 2, 2, 4, 4, 4, 8, 8],
          maxDateCheckRelevance: 45,
          maxCountCheckRelevance: 3,
        },
      ],
    });
    const user = await doc.save();

    const message = {
      from: config.server.postLog,
      to: req.body.email,
      subject: `Confirmation`,
      text: `follow the link in order to confirm your account http://${config.server.host}:${config.server.port}/confirm/${user.confirmKey}`,
      html: `follow the link in order to confirm your account <a href="http://${config.server.host}:${config.server.port}/confirm/${user.confirmKey}">Confirm</a> `,
    };
    await transporter.sendMail(message);

    return res.json({
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
    let user = await User.findOne({ confirmKey: req.body.key });
    if (!user)
      return res
        .status(400)
        .json({ message: 'Ключ не прошел проверку подлинности!' });

    if (user._doc.emailToConfirm == '') {
      return res.status(400).json({
        message: 'Ключ не прошел проверку подлинностиb!',
      });
    }

    let update = await User.updateOne(
      {
        confirmKey: req.body.key,
      },
      {
        confirmed: true,
        email: user._doc.emailToConfirm,
        emailToConfirm: '',
        dateOfConfirm: Date.now(),
        confirmKey: '',
        confirmTime: 0,
      },
      {
        upsert: false, // Если не будет найдена запись, проигнорирует обновление, если true добавит запись новую запись со значением
      }
    );
    if (update.modifiedCount == 0) {
      return res.status(400).json({ message: 'Not Found account' });
    }
    return res.json({ message: 'Email has been confirmed successfully' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Not Found account' });
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
    let update = await User.updateOne(
      {
        nickName: user.nickName,
      },
      {
        refreshToken: refreshTokenToSetCoockies,
        lastLogin: Date.now(),
      },
      {
        upsert: false,
      }
    );
    if (update.modifiedCount == 0) {
      return res.status(400).json({ message: `Couldn't login` });
    }
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
    const accessToken = jwt.sign(
      {
        userId: user._id,
      },
      secretAccessToken,
      {
        expiresIn: `${config.common.liveTimeAccessToken}`,
      }
    );

    let userData = getUserInfoFromDoc(user._doc);
    return res.json({ user: userData, token: accessToken });
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
        refreshToken: '',
      },
      {
        upsert: false,
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

    let user = await User.findOne({ refreshToken: refreshTokenFromCoockies });
    if (!user) {
      return res.status(401).json({
        message: 'Need authorization',
      });
    }
    let update = await User.updateOne(
      { refreshToken: refreshTokenFromCoockies },
      { lastLogin: Date.now() },
      { upsert: false }
    );
    const accessToken = jwt.sign(
      {
        userId: user._id,
      },
      secretAccessToken,
      {
        expiresIn: `${config.common.liveTimeAccessToken}`,
      }
    );
    let userData = getUserInfoFromDoc(user._doc);
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

export const forgotPassword = async (req, res) => {
  try {
    let { nickName, email } = req.body;
    let user = await User.findOne({ nickName: nickName });
    if (!user) {
      return res.status(400).json({
        message: `Nickname or email isn't correct!`,
      });
    }
    if (user.email != email) {
      return res.status(400).json({
        message: `Nickname or email isn't correct!`,
      });
    }
    let dateOfPassword = user.dateOfPassword;
    if (checkSimilarDay(dateOfPassword)) {
      return res.status(400).json({
        message: `You have changed password today!`,
      });
    }
    if (user.resetPasswordTime > Date.now()) {
      return res.status(400).json({
        message: `Вы не завершили попытку смены пароля! Следуйте инструкции на почте!`,
      });
    }

    let resetPasswordKey = crypto.randomBytes(128).toString('base64');
    resetPasswordKey = resetPasswordKey.replace(/\//g, '');
    let resetPasswordTime = new Date(Date.now() + 5 * 60000);
    let update = await User.updateOne(
      {
        nickName: nickName,
      },
      {
        resetPasswordKey: resetPasswordKey,
        resetPasswordTime: resetPasswordTime,
      },
      {
        upsert: false,
      }
    );
    if (update.modifiedCount == 0) {
      return res.status(400).json({
        message: `Couldn't perform the operation`,
      });
    }
    const message = {
      from: config.server.postLog,
      to: req.body.email,
      subject: `ResetPassword`,
      text: `follow the link in order to resetPassword for your account http://${config.server.host}:${config.server.port}/pass/${resetPasswordKey}`,
      html: `follow the link in order to resetPassword for your account <a href="http://${config.server.host}:${config.server.port}/pass/${resetPasswordKey}">ResetPassword</a> `,
    };
    await transporter.sendMail(message);

    res.json({
      message:
        'We have send message to your email with the instraction for replace your password.',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Couldn't perform the operation",
    });
  }
};

export const newPassword = async (req, res) => {
  try {
    let { password, key } = req.body;
    let user = await User.findOne({ resetPasswordKey: key });
    if (!user) {
      return res.status(400).json({
        message: `Key isn't correct or time to reset is up`,
      });
    }
    if (user.resetPasswordTime < Date.now()) {
      return res.status(400).json({
        message: `Key isn't correct or time to reset is up`,
      });
    }
    let salt = crypto.randomBytes(128).toString('base64');
    let hash = pbkdf2Sync(
      password + salt,
      secretPassword + salt,
      iterations,
      512,
      'sha512'
    );
    hash = hash.toString('hex');
    let update = await User.updateOne(
      { resetPasswordKey: key },
      {
        salt: salt,
        hash: hash,
        resetPasswordKey: '',
        resetPasswordTime: 0,
        dateOfPassword: Date.now(),
      },
      { upsert: false }
    );
    if (update.modifiedCount == 0) {
      return res.status(400).json({
        message: `Couldn't perform the operation`,
      });
    }
    res.json({ message: 'Password has successfully replaced' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: "Couldn't perform the operation",
    });
  }
};

export const changeEmail = async (req, res) => {
  try {
    let { password, email, key } = req.body;
    let user = await User.findOne({ confirmKey: key });
    if (!user) {
      return res.status(400).json({
        message: "Key or password isn't correct or time to reset is up!",
      });
    }
    let reqHash = pbkdf2Sync(
      password + user.salt,
      secretPassword + user.salt,
      iterations,
      512,
      'sha512'
    );
    reqHash = reqHash.toString('hex');

    if (reqHash != user.hash) {
      return res.status(400).json({
        message: "Key or password isn't correct or time to reset is up!",
      });
    }
    if (user.confirmTime < Date.now()) {
      return res.status(400).json({
        message: `Key or password isn't correct or time to reset is up`,
      });
    }
    if (user._id != req.userId) {
      return res.status(400).json({
        message: `Key or password isn't correct or time to reset is up`,
      });
    }
    if (user.emailToConfirm != '' && user.confirmTime > Date.now()) {
      return res.status(400).json({
        message: `Вы уже отправляли заявку на новый Email. Перейдите на почту и проверьте сообщение!`,
      });
    }
    let userEmail = await User.findOne({ email: email });
    if (userEmail) {
      return res.status(400).json({
        message: 'Вы пытаетесь поменять Email на уже действующий!',
      });
    }

    let emailToConfirm = email;
    let confirmKey = crypto.randomBytes(128).toString('base64');
    confirmKey = confirmKey.replace(/\//g, '');
    let confirmTime = new Date(Date.now() + 5 * 60000);

    let update = await User.updateOne(
      { _id: req.userId },
      {
        confirmKey: confirmKey,
        confirmTime: confirmTime,
        emailToConfirm: emailToConfirm,
      },
      { upsert: false }
    );
    if (update.modifiedCount == 0) {
      return res.status(400).json({
        message: `Couldn't perform the operation`,
      });
    }
    const message = {
      from: config.server.postLog,
      to: email,
      subject: `Replace email`,
      text: `follow the link in order to repalce your email http://${config.server.host}:${config.server.port}/confirm/${user.confirmKey}`,
      html: `follow the link in order to repalce your email  <a href="http://${config.server.host}:${config.server.port}/confirm/${user.confirmKey}">Confirm</a> `,
    };
    await transporter.sendMail(message);

    return res.json({
      message:
        'We have sent message to your email. Check message and follow instruction in order to replace your email',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Couldn't perform the operation!`,
    });
  }
};

export const changeAvatar = async (req, res) => {
  try {
    if (!req?.file) {
      return res
        .status(400)
        .json({ message: "Couldn't perform the operation!" });
    }
    let user = await User.findOneAndUpdate(
      { _id: req.userId },
      { avatar: req.file.filename },
      {
        new: true,
        rawResult: true,
      }
    );
    if (user.ok != 1)
      return res.status(400).json({
        message: `Couldn't perform the operation`,
      });

    let userData = getUserInfoFromDoc(user.value._doc);

    res.json({
      message: 'Avatar has been changed successfully!',
      user: userData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Couldn't perform the operation!`,
    });
  }
};

export const changeInfo = async (req, res) => {
  try {
    let field = Object.keys(req.body)?.[0];
    let newField = req.body;
    if (
      field == 'countKnownWordsAtOneTime' ||
      field == 'countWrongsToAddToRepeat' ||
      field == 'maxDateCheckRelevance' ||
      field == 'maxCountCheckRelevance' ||
      field == 'regularityToRepeat'
    ) {
      let user = await User.findOne({ _id: req.userId });
      if (!user)
        return res.status(400).json({
          message: `Couldn't perform the operation with field ${field}`,
        });
      let options = user._doc.options;
      options[0][field] = req.body[field];
      newField = { options };
    }
    if (field == 'password') {
      let user = await User.findOne({ _id: req.userId });
      if (!user)
        return res.status(400).json({
          message: `Couldn't perform the operation with field ${field}`,
        });
      let nickName = user._doc.nickName;
      let email = req.body[field];
      if (user._doc.email != email)
        return res.status(400).json({ message: 'Неверный email!' });
      let data = {
        body: {
          nickName,
          email,
        },
      };
      return forgotPassword(data, res);
    }
    if (field == 'email') {
      let user = await User.findOne({ _id: req.userId });
      if (!user)
        return res.status(400).json({
          message: `Couldn't perform the operation with field ${field}`,
        });
      let email = req.body[field];
      if (user._doc.email != email)
        return res.status(400).json({ message: "Email isn't correct!" });

      let dateOfConfirm = user._doc.dateOfConfirm;
      if (checkSimilarDay(dateOfConfirm)) {
        return res.status(400).json({
          message: `You have changed email today!`,
        });
      }
      if (user.confirmTime > Date.now()) {
        return res.status(400).json({
          message: `Вы не завершили попытку смены почты! Следуйте инструкции на почте!`,
        });
      }

      let confirmKey = crypto.randomBytes(128).toString('base64');
      confirmKey = confirmKey.replace(/\//g, '');
      let confirmTime = new Date(Date.now() + 5 * 60000);
      let update = await User.updateOne(
        { _id: req.userId },
        {
          confirmKey: confirmKey,
          confirmTime: confirmTime,
        },
        { upsert: false }
      );
      if (update.modifiedCount == 0) {
        return res.status(400).json({
          message: `Couldn't perform the operation`,
        });
      }
      const message = {
        from: config.server.postLog,
        to: email,
        subject: `Replace email`,
        text: `follow the link in order to repalce your email http://${config.server.host}:${config.server.port}/email/${user.confirmKey}`,
        html: `follow the link in order to repalce your email  <a href="http://${config.server.host}:${config.server.port}/email/${user.confirmKey}">Confirm</a> `,
      };
      await transporter.sendMail(message);

      return res.json({
        message:
          'We have sent message to your email. Check message and follow instruction in order to replace your email',
      });
    }
    if (field == 'nickName') {
      let user = await User.findOne({ nickName: req.body[field] });
      if (user)
        return res.status(400).json({
          message: `Nickname уже занят!`,
        });
    }

    let user = await User.findOneAndUpdate({ _id: req.userId }, newField, {
      new: true,
      rawResult: true,
    });
    if (user.ok == 0)
      return res.status(400).json({
        message: `Couldn't perform the operation with field ${field}`,
      });

    let userData = getUserInfoFromDoc(user.value._doc);
    return res.json({
      message: `Field ${field} has been successfully changed!`,
      user: userData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Couldn't perform the operation with field ${field}`,
    });
  }
};

export const exportUserData = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res
        .status(400)
        .json({ message: "Couldn't perform the operation!" });
    }
    let {
      _id,
      userName,
      nickName,
      email,
      hash,
      salt,
      role,
      dateOfPassword,
      resetPasswordKey,
      resetPasswordTime,
      confirmed,
      dateOfConfirm,
      confirmKey,
      confirmTime,
      emailToConfirm,
      dateRegistration,
      avatar,
      refreshToken,
      lastLogin,
      statistics,
      ...userData
    } = user._doc;

    res.json({ message: JSON.stringify(userData) });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Couldn't perform the operation!`,
    });
  }
};

export const importUserData = async (req, res) => {
  try {
    res.json('sosi');
  } catch (err) {
    return res.status(500).json({
      message: `Couldn't perform the operation!`,
    });
  }
};

export const message = async (req, res) => {
  try {
    let { userName, email, message } = req.body;
    const messagePost = {
      from: config.server.postLog,
      to: config.server.postLog,
      subject: `${userName}'s message`,
      text: `${message}. Адресс для связи: ${email}`,
      html: `${message}. Адресс для связи: ${email}`,
    };
    await transporter.sendMail(messagePost);
    res.json({ message: 'Операция выполнена успешно!' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
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

function dateFormat(date) {
  date = new Date(date);
  let minute = date.getMinutes();
  let hour = date.getHours();
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();

  if (minute >= 0 && minute < 10) {
    minute = `0${minute}`;
  }
  if (hour >= 0 && hour < 10) {
    hour = `0${hour}`;
  }

  return `${hour}:${minute} ${day}-${month}-${year}`;
}
function checkSimilarDay(date) {
  date = new Date(date);
  let now = new Date(Date.now());
  if (
    date.getDate() == now.getDate() &&
    date.getMonth() == now.getMonth() &&
    date.getFullYear() == now.getFullYear()
  ) {
    return true;
  }
  return false;
}
function getUserInfoFromDoc(doc) {
  let user = doc;
  let {
    _id,
    hash,
    salt,
    refreshToken,
    resetPasswordKey,
    resetPasswordTime,
    confirmKey,
    confirmTime,
    emailToConfirm,
    confirmed,
    ...userData
  } = user;
  userData.email = replaceEmailToStar(userData.email);
  return userData;
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

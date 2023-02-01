import * as dotenv from 'dotenv';
dotenv.config({ path: 'config.env', silent: true });
const secretAccessToken = process.env.SECRET_ACCESS_TOKEN;
const secretRefreshToken = process.env.SECRET_REFRESH_TOKEN;
const secretPassword = process.env.SECRET_PASSWORD_TO_HASH;
const secretImportSignature = process.env.SECRET_IMPORT_SIGNATURE;
const timeExistForCheckKeys = 5; // В минутах
const maxSizeAvatar = 5 * 1024 * 1024;
const PRODUCTION = process.env.PRODUCTION == 'true' ? true : false;
const HOST = process.env.HOST;
const secretSyncSignature = process.env.SECRET_SYNC_SIGNATURE;

import User from '../models/Users.js';

import Utf8 from 'crypto-js/enc-utf8.js';
import AES from 'crypto-js/aes.js';
import crypto from 'node:crypto';
const iterations = 10000;
import { pbkdf2, pbkdf2Sync } from 'crypto';

import jwt from 'jsonwebtoken';

import nodemailer from 'nodemailer';
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.POST_LOGIN,
    pass: process.env.POST_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const register = async (req, res) => {
  try {
    let { password, nickName, email, userName } = req.body;

    let users = await User.find({
      $or: [{ nickName: nickName }, { email: email }],
    });
    if (users.length > 0)
      return sendResponseError(req, res, isHasEmailOrNickname(users, req.body));

    let { salt, hash } = getHash(password);
    let confirmKey = getCheckKey();

    const doc = new User({
      userName: userName,
      nickName: nickName,
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
      emailToConfirm: email,
      dateRegistration: Date.now(),
      avatar: '',
      refreshToken: '',
      lastLogin: 0,
      statistics: [
        {
          bestStreak: 0,
          currentStreak: 0,
          dateOfLastStreak: 0,
          lastDailyCheckStreak: 0,
          lastRepeatKnownWords: 0,
          historyOfRepeatKnownWords: [],
          lastReverseRepeatKnownWords: 0,
          historyOfReverseRepeatKnownWords: [],
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
      from: process.env.POST_LOGIN,
      to: req.body.email,
      subject: `Подтверждение аккаунта`,
      text: `Перейдите по ссылке, чтобы активировать аккаунт: https://${HOST}/confirm/${user.confirmKey}`,
      html: `Перейдите по ссылке, чтобы активировать аккаунт: <a href="https://${HOST}/confirm/${user.confirmKey}">Confirm</a> `,
    };
    await transporter.sendMail(message);

    return res.json({
      message:
        'Регистрация прошла успешно! На вашу почту выслано сообщение с инструкцией по активации аккаунта!',
    });
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: 'Не удалось выполнить операцию!',
    });
  }
};

export const login = async (req, res) => {
  try {
    let { nickName, password } = req.body;
    let user = await User.findOne({ nickName: nickName });
    if (!user)
      return sendResponseError(req, res, 'Неправильный логин или пароль!');

    let { hash } = getHash(password, user.salt);
    if (hash != user.hash)
      return sendResponseError(req, res, 'Неправильный логин или пароль!');

    if (user.confirmed == false)
      return sendResponseError(
        req,
        res,
        'Аккаунт не подтвержден! Следуйте инструкции на почте!'
      );

    let oldRefreshToken = user.refreshToken;
    let newRefreshToken;
    let newAccessToken;
    try {
      if (oldRefreshToken === '') throw new Error('');
      let decoded = jwt.verify(oldRefreshToken, secretRefreshToken);
      let { accessToken } = getTokens(user._id);
      newRefreshToken = oldRefreshToken;
      newAccessToken = accessToken;
    } catch (err) {
      let { refreshToken, accessToken } = getTokens(user._id);
      newRefreshToken = refreshToken;
      newAccessToken = accessToken;
    }

    let lastLogin = user.lastLogin;
    if (lastLogin === 0) lastLogin = 1000;
    else lastLogin = Date.now();

    let update = await User.updateOne(
      {
        nickName: user.nickName,
      },
      {
        refreshToken: newRefreshToken,
        lastLogin: lastLogin,
      },
      {
        upsert: false,
      }
    );
    if (update.modifiedCount == 0) return sendResponseError(req, res);

    const timeExistCookies = getTimeExistCoockies();
    if (!PRODUCTION) {
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        expires: timeExistCookies,
        //sameSite: 'None', // DEV OPTIONS strict - if UI exist inside domain
        //secure: true, // DEV OPTIONS true - if app use https protocol
      });
    } else {
      res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        expires: timeExistCookies,
        sameSite: 'strict',
        secure: true,
      });
    }
    user = await User.findOne({ nickName: nickName });
    if (!user)
      return sendResponseError(req, res, 'Неправильный логин или пароль!');
    let userData = getUserInfoFromDoc(user._doc);
    return res.json({ user: userData, token: newAccessToken });
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: "Couldn't login",
    });
  }
};

export const logout = async (req, res) => {
  try {
    console.log(req.userId);
    let refreshToken = req.cookies?.refreshToken;
    if (!refreshToken)
      return sendResponseError(req, res, 'Вы не авторизованы!', 401);

    try {
      let decoded = jwt.verify(refreshToken, secretRefreshToken);
    } catch (err) {
      return sendResponseError(req, res, 'Вы не авторизованы!', 401);
    }
    let user = await User.updateOne(
      {
        _id: req.userId,
      },
      {
        refreshToken: '',
      },
      {
        upsert: false,
      }
    );
    if (user.modifiedCount == 0) {
      return sendResponseError(req, res, 'Вы не авторизованы!', 401);
    }
    return res.json({
      message: 'Вы успешно вышли из системы!',
    });
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: 'Не удалось выполнить операцию!',
    });
  }
};

export const updateAccessToken = async (req, res) => {
  try {
    let refreshTokenFromCoockies = req.cookies?.refreshToken;
    if (!refreshTokenFromCoockies)
      return sendResponseError(req, res, 'Требуется авторизация!', 401);

    try {
      let decoded = jwt.verify(refreshTokenFromCoockies, secretRefreshToken);
    } catch (err) {
      return sendResponseError(req, res, 'Требуется авторизация!', 401);
    }

    let user = await User.findOne({ refreshToken: refreshTokenFromCoockies });
    if (!user)
      return sendResponseError(req, res, 'Требуется авторизация!', 401);

    const { accessToken } = getTokens(user._id);
    let userData = getUserInfoFromDoc(user._doc);
    return res.json({
      token: accessToken,
      user: userData,
    });
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: 'Не удалось выполнить операцию!',
    });
  }
};

export const confirm = async (req, res) => {
  try {
    let user = await User.findOne({ confirmKey: req.body.key });
    if (!user)
      return sendResponseError(
        req,
        res,
        'Ключ не прошел проверку подлинности!'
      );

    if (user.emailToConfirm == '')
      return sendResponseError(
        req,
        res,
        'Ключ не прошел проверку подлинности!'
      );

    if (!(user.confirmTime == 0 || user.confirmTime > Date.now()))
      return sendResponseError(req, res, 'Время операции истекло!');

    let update = await User.updateOne(
      {
        confirmKey: req.body.key,
      },
      {
        confirmed: true,
        email: user.emailToConfirm,
        emailToConfirm: '',
        dateOfConfirm: Date.now(),
        confirmKey: '',
        confirmTime: 0,
      },
      {
        upsert: false, // Если не будет найдена запись, проигнорирует обновление, если true добавит запись новую запись со значением
      }
    );
    if (update.modifiedCount == 0) return sendResponseError(req, res);

    return res.json({ message: 'Аккаунт успешно подтвержден!' });
  } catch (err) {
    req.err = err;
    return res.status(500).json({ message: 'Не удалось выполнить операцию!' });
  }
};

export const changeEmail = async (req, res) => {
  try {
    let { password, email, key } = req.body;

    let user = await User.findOne({ _id: req.userId });
    if (!user) return sendResponseError(req, res);

    if (user.emailToConfirm != '')
      return sendResponseError(
        req,
        res,
        'Вы уже отправляли заявку на смену Email. Перейдите на почту и проверьте сообщение! Если вы указали неверный адресс электронной почты, повторите процесс смены Email с самого начала немного позже!'
      );

    if (user.confirmKey != key)
      return sendResponseError(
        req,
        res,
        'Неверный пароль или ключ подтверждения!'
      );

    let { hash } = getHash(password, user.salt);

    if (hash != user.hash)
      return sendResponseError(
        req,
        res,
        'Неверный пароль или ключ подтверждения!'
      );

    if (user.confirmTime < Date.now())
      return sendResponseError(req, res, 'Время операции истекло!');

    let hasEmail = await User.findOne({ email: email });
    if (hasEmail)
      return sendResponseError(
        req,
        res,
        'Email уже используется другим пользователем!'
      );

    let emailToConfirm = email;
    let confirmKey = getCheckKey();
    let confirmTime = getTimeForCheckKey();

    let update = await User.updateOne(
      { _id: req.userId },
      {
        confirmKey: confirmKey,
        confirmTime: confirmTime,
        emailToConfirm: emailToConfirm,
      },
      { upsert: false }
    );
    if (update.modifiedCount == 0) return sendResponseError(req, res);

    const message = {
      from: process.env.POST_LOGIN,
      to: email,
      subject: `Смена почты`,
      text: `Перейдите по ссылке, чтобы изменить Email: https://${HOST}/confirm/${confirmKey}`,
      html: `Перейдите по ссылке, чтобы изменить Email:  <a href="https://${HOST}/confirm/${confirmKey}">Confirm</a> `,
    };
    await transporter.sendMail(message);

    return res.json({
      message:
        'На почту была отправлена дальнейшая инструкция по смене почты! Проследуйте по ссылке в инструкции!',
    });
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    let { nickName, email } = req.body;
    let user = await User.findOne({ nickName: nickName });
    if (!user)
      return sendResponseError(
        req,
        res,
        'Неверный Email или Nick пользователя!'
      );

    if (user.email != email)
      return sendResponseError(
        req,
        res,
        'Неверный Email или Nick пользователя!'
      );

    if (isNowDay(user.dateOfPassword))
      return sendResponseError(
        req,
        res,
        'Смену пароля можно производить не чаще, чем один раз в день!'
      );

    if (user.resetPasswordTime > Date.now())
      return sendResponseError(
        req,
        res,
        'Вы не завершили попытку смены пароля! Следуйте инструкциям на почте!'
      );

    let resetPasswordKey = getCheckKey();
    let resetPasswordTime = getTimeForCheckKey();
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
    if (update.modifiedCount == 0) return sendResponseError(req, res);

    const message = {
      from: process.env.POST_LOGIN,
      to: req.body.email,
      subject: `Смена пароля`,
      text: `Перейдите по ссылке для смены пароля на вашем аккаунте: https://${HOST}/pass/${resetPasswordKey}`,
      html: `Перейдите по ссылке для смены пароля на вашем аккаунте: <a href="https://${HOST}/pass/${resetPasswordKey}">ResetPassword</a> `,
    };
    await transporter.sendMail(message);

    res.json({
      message:
        'На ваше почту было отправлено сообщение с инструкцией по смене вашего пароля!',
    });
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: 'Не удалось выполнить операцию!',
    });
  }
};

export const newPassword = async (req, res) => {
  try {
    let { password, key } = req.body;
    let user = await User.findOne({ resetPasswordKey: key });
    if (!user)
      return sendResponseError(
        req,
        res,
        'Ключ не прошел проверку подлинности!'
      );

    if (user.resetPasswordTime < Date.now())
      return sendResponseError(req, res, 'Время выполнения операции истекло!');

    let { salt, hash } = getHash(password);

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
    if (update.modifiedCount == 0) return sendResponseError(req, res);

    res.json({ message: 'Пароль успешно изменен!' });
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: 'Не удалось выполнить операцию!',
    });
  }
};

export const changeAvatar = async (req, res) => {
  try {
    let file = req?.file;
    if (!file) return sendResponseError(req, res);

    let user = await User.findOne({ _id: req.userId });
    if (!user) return sendResponseError(req, res);

    let nickName = user.nickName;
    if (file.size > maxSizeAvatar) {
      let dir = path.join(
        __dirname,
        `/../dist/uploads/${nickName}/${file.filename}`
      );
      if (fs.existsSync(dir)) fs.unlinkSync(dir);
      return sendResponseError(req, res, 'Размер аватара превышает 5Mb!');
    }
    if (user.avatar != '') {
      let dir = path.join(
        __dirname,
        `/../dist/uploads/${nickName}/${user.avatar}`
      );
      if (fs.existsSync(dir)) fs.unlinkSync(dir);
    }

    user = await User.findOneAndUpdate(
      { _id: req.userId },
      { avatar: file.filename },
      {
        new: true,
        rawResult: true,
      }
    );
    if (user.ok == 0) return sendResponseError(req, res);

    let userData = getUserInfoFromDoc(user.value._doc);

    res.json({
      message: 'Аватар успешно изменен!',
      user: userData,
    });
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};

export const changeInfo = async (req, res) => {
  try {
    let field = Object.keys(req.body)?.[0];
    if (
      field == 'countKnownWordsAtOneTime' ||
      field == 'countWrongsToAddToRepeat' ||
      field == 'maxDateCheckRelevance' ||
      field == 'maxCountCheckRelevance' ||
      field == 'regularityToRepeat'
    )
      return changeInfoOptions(req, res);
    else if (field == 'userName') return changeInfoUserName(req, res);
    else if (field == 'password') return changeInfoPassword(req, res);
    else if (field == 'email') return changeInfoEmail(req, res);
    else if (field == 'nickName') return changeInfoNickName(req, res);
    return sendResponseError(req, res);
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};
const changeInfoUserName = async (req, res) => {
  try {
    let { userName } = req.body;
    let user = await User.findOneAndUpdate(
      { _id: req.userId },
      { userName: userName },
      {
        new: true,
        rawResult: true,
      }
    );
    if (user.ok == 0) return sendResponseError(req, res);

    let userData = getUserInfoFromDoc(user.value._doc);
    return res.json({
      message: `Имя пользователя успешно изменено!`,
      user: userData,
    });
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};
const changeInfoEmail = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.userId });
    if (!user) return sendResponseError(req, res);

    let email = req.body?.email;
    if (user.email != email)
      return sendResponseError(req, res, 'Некорректно введен Email!');

    let dateOfConfirm = user.dateOfConfirm;
    if (isNowDay(dateOfConfirm))
      return sendResponseError(
        req,
        res,
        'Невозможно производить смену Email чаще, чем один раз в день!'
      );

    if (user.confirmTime > Date.now())
      return sendResponseError(
        req,
        res,
        'Вы уже отправляли заявку на смену Email. Следуйте инструкциям на электронной почте!'
      );

    let confirmKey = getCheckKey();
    let confirmTime = getTimeForCheckKey();

    let update = await User.updateOne(
      { _id: req.userId },
      {
        confirmKey: confirmKey,
        confirmTime: confirmTime,
        emailToConfirm: '',
      },
      { upsert: false }
    );
    if (update.modifiedCount == 0) return sendResponseError(req, res);

    const message = {
      from: process.env.POST_LOGIN,
      to: email,
      subject: `Выбор почты`,
      text: `Перейдите по ссылке, чтобы указать новый Email: https://${HOST}/email/${confirmKey}`,
      html: `Перейдите по ссылке, чтобы указать новый Email:  <a href="https://${HOST}/email/${confirmKey}">Confirm</a> `,
    };
    await transporter.sendMail(message);

    return res.json({
      message: 'На почту отправлено сообщение с инструкцией по смене Email!',
    });
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};
const changeInfoPassword = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.userId });
    if (!user) return sendResponseError(req, res);

    let nickName = user._doc.nickName;
    let email = req.body?.password;
    if (user.email != email)
      return sendResponseError(req, res, 'Некорретно введен Email!');

    let data = {
      body: {
        nickName,
        email,
      },
    };
    return forgotPassword(data, res);
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};
const changeInfoNickName = async (req, res) => {
  try {
    let { nickName } = req.body;
    let user = await User.findOne({ nickName: nickName });
    if (user)
      return sendResponseError(req, res, 'Nick пользователя уже используется!');

    user = await User.findOne({ _id: req.userId });
    if (!user) return sendResponseError(req, res);

    let oldNickName = user.nickName;
    let dir = path.join(__dirname, `/../dist/uploads/${nickName}`);
    let oldDir = path.join(__dirname, `/../dist/uploads/${oldNickName}`);

    if (fs.existsSync(oldDir)) fs.renameSync(oldDir, dir);

    user = await User.findOneAndUpdate(
      { _id: req.userId },
      { nickName: nickName },
      { new: true, rawResult: true }
    );
    if (user.ok == 0) return sendResponseError(req, res);

    let userInfo = getUserInfoFromDoc(user.value._doc);
    res.json({ message: 'NickName успешно изменен!', user: userInfo });
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};
const changeInfoOptions = async (req, res) => {
  try {
    let field = Object.keys(req.body)?.[0];
    let fieldData = req.body[field];

    let user = await User.findOneAndUpdate(
      { _id: req.userId },
      { $set: { [`options.0.${field}`]: fieldData } },
      { new: true, rawResult: true }
    );
    if (user.ok == 0) return sendResponseError(req, res);

    let userInfo = getUserInfoFromDoc(user.value._doc);
    res.json({ message: 'Операция выполнена успешно!', user: userInfo });
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};

export const exportUserData = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.userId });
    if (!user) return sendResponseError(req, res);

    let {
      knownWords,
      categoriesToLearn,
      relevance,
      wordsToStudy,
      wordsToRepeat,
      options,
      statistics,
    } = user._doc;

    let userInfo = {
      knownWords,
      categoriesToLearn,
      relevance,
      wordsToStudy,
      wordsToRepeat,
      options,
      statistics,
    };

    let signature = getSignature(userInfo);
    userInfo.signature = signature;

    res.json({ message: JSON.stringify(userInfo) });
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};

export const importUserData = async (req, res) => {
  try {
    let { userInfo } = req.body;
    if (!isCorrectSignatureImport(userInfo))
      return sendResponseError(req, res, 'Данные повреждены!');

    let user = await User.findOneAndUpdate(
      { _id: req.userId },
      {
        $set: {
          knownWords: userInfo.knownWords,
          categoriesToLearn: userInfo.categoriesToLearn,
          wordsToStudy: userInfo.wordsToStudy,
          relevance: userInfo.relevance,
        },
      },
      { new: true, rawResult: true }
    );
    if (!user) return sendResponseError(req, res);
    user = getUserInfoFromDoc(user.value._doc);

    res.json({ user });
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};
export const syncInfo = async (req, res) => {
  try {
    let { userInfo } = req.body;

    if (!isCorrectSignatureSync(userInfo))
      return sendResponseError(req, res, 'Данные повреждены!');

    let user = await getUserInfo(req.userId, 'nickName lastLogin');
    if (!user) return sendResponseError(req, res);
    if (userInfo.nickName != user.nickName && user.lastLogin != 1000)
      return sendResponseError(req, res, 'Данные повреждены!');

    let fields = requireSyncFields(userInfo);
    if (Object.keys(fields).length == 0)
      return sendResponseError(req, res, 'Синхронизация не требуется!');

    fields = fixAllIrregularVerbs(fields);

    let result = await executeSync(fields, req.userId);
    if (!result) return sendResponseError(req, res);

    user = await User.findOne({ _id: req.userId });
    if (!user) return sendResponseError(req, res);
    user = getUserInfoFromDoc(user._doc);
    res.json({ message: 'Синхронизация выполнена успешно', user });
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};

export const message = async (req, res) => {
  try {
    let { userName, email, message } = req.body;
    const messagePost = {
      from: process.env.POST_LOGIN,
      to: process.env.POST_LOGIN,
      subject: `Сообщение от ${userName}`,
      text: `${message}. Адресс для связи: ${email}`,
      html: `${message}. Адресс для связи: ${email}`,
    };
    await transporter.sendMail(messagePost);
    res.json({ message: 'Операция выполнена успешно!' });
  } catch (err) {
    req.err = err;
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};

function sendResponseError(
  req,
  res,
  message = 'Не удалось выполнить операцию!',
  status = 400
) {
  req.err = new Error(`${message}`);
  return res.status(status).json({ message });
}
async function multiPushNewElement(field, newElements, userID) {
  try {
    let query = { _id: userID };
    let action = {
      $push: {
        [`${field}`]: {
          $each: newElements,
        },
      },
    };
    let option = { new: true, rawResult: true };

    let user = await User.findOneAndUpdate(query, action, option);
    if (user.ok == 0) return false;
    let userInfo = getUserInfoFromDoc(user.value._doc);
    return userInfo;
  } catch (err) {
    console.log(err);
    return false;
  }
}
// [{elementID: 'dsdsd', changeFields: { name: 'role'}}, ]
async function multiSetElement(field, multiSetOptions, userID) {
  try {
    let success = true;
    for (let multiSetOption of multiSetOptions) {
      if (!success) return false;
      let setOption = {};
      for (let key in multiSetOption?.changeFields) {
        setOption[`${field}.$.${key}`] = multiSetOption?.changeFields[key];
      }
      let query = { _id: userID, [`${field}._id`]: multiSetOption?.elementID };
      let action = { $set: setOption };
      let option = { upsert: false };
      let user = await User.updateOne(query, action, option);
      if (user.modifiedCount == 0) {
        success = false;
      }
    }

    if (success) {
      success = await User.findOne({ _id: userID });
      success = getUserInfoFromDoc(success._doc);
    }
    return success;
  } catch (err) {
    console.log(err);
    return false;
  }
}
async function multiPullElement(field, elementsID, userID) {
  try {
    let query = { _id: userID };
    let action = {
      $pull: {
        [field]: { _id: { $in: elementsID } },
      },
    };
    let option = { new: true, rawResult: true };

    let user = await User.findOneAndUpdate(query, action, option);
    if (user.ok == 0) {
      return false;
    }
    let userInfo = getUserInfoFromDoc(user.value._doc);
    return userInfo;
  } catch (err) {
    console.log(err);
    return false;
  }
}

function getTokens(userID) {
  const accessToken = jwt.sign(
    {
      userId: userID,
    },
    secretAccessToken,
    {
      expiresIn: process.env.LIVE_TIME_ACCESS_TOKEN,
    }
  );
  const refreshToken = jwt.sign({ id: userID }, secretRefreshToken, {
    expiresIn: process.env.LIVE_TIME_REFRESH_TOKEN,
  });
  return { accessToken, refreshToken };
}
function getHash(password, salt = '') {
  if (salt == '') salt = crypto.randomBytes(128).toString('base64');
  let hash = pbkdf2Sync(
    password + salt,
    secretPassword + salt,
    iterations,
    512,
    'sha512'
  );
  hash = hash.toString('hex');
  return { hash, salt };
}
function getSignatureHash(info) {
  let salt = 'dsmdsmkasmvsa34@de';
  let hash = pbkdf2Sync(
    info + salt,
    secretImportSignature,
    iterations,
    512,
    'sha512'
  );
  hash = hash.toString('hex');
  return { hash };
}
function getCheckKey() {
  let key = crypto.randomBytes(128).toString('base64');
  key = key.replace(/\//g, '');
  return key;
}
function getTimeForCheckKey() {
  return new Date(Date.now() + timeExistForCheckKeys * 60000);
}
function getTimeExistCoockies() {
  let options = process.env.LIVE_TIME_REFRESH_TOKEN;
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
function getSignature(userInfo) {
  let user = JSON.parse(JSON.stringify(userInfo));

  let info = {
    knownWords: JSON.stringify(userInfo.knownWords).split(''),
    categoriesToLearn: JSON.stringify(userInfo.categoriesToLearn).split(''),
    wordsToStudy: JSON.stringify(userInfo.wordsToStudy).split(''),
    relevance: JSON.stringify(userInfo.relevance).split(''),
    wordsToRepeat: JSON.stringify(userInfo.wordsToRepeat).split(''),
    options: JSON.stringify(userInfo.options).split(''),
    statistics: JSON.stringify(userInfo.statistics).split(''),
    data: [JSON.stringify(user).split('').length],
  };
  for (let key in info) {
    let amountDiffSymbol = {};
    info[key].forEach((x) => {
      amountDiffSymbol[x] = (amountDiffSymbol[x] || 0) + 1;
    });
    info[key] = JSON.stringify(amountDiffSymbol);
  }

  let signature = {};
  for (let key in info) {
    let { hash } = getSignatureHash(info[key]);
    signature[key] = hash;
  }
  return signature;
}

function isCorrectSignatureImport(userInfo) {
  let { signature, ...user } = userInfo;

  let info = {
    knownWords: JSON.stringify(userInfo.knownWords).split(''),
    categoriesToLearn: JSON.stringify(userInfo.categoriesToLearn).split(''),
    wordsToStudy: JSON.stringify(userInfo.wordsToStudy).split(''),
    relevance: JSON.stringify(userInfo.relevance).split(''),
    wordsToRepeat: JSON.stringify(userInfo.wordsToRepeat).split(''),
    options: JSON.stringify(userInfo.options).split(''),
    statistics: JSON.stringify(userInfo.statistics).split(''),
    data: [JSON.stringify(user).split('').length],
  };
  for (let key in info) {
    let amountDiffSymbol = {};
    info[key].forEach((x) => {
      amountDiffSymbol[x] = (amountDiffSymbol[x] || 0) + 1;
    });
    info[key] = JSON.stringify(amountDiffSymbol);
  }
  for (let key in info) {
    let { hash } = getSignatureHash(info[key]);
    if (hash != signature[key]) return false;
  }
  return true;
}
function isCorrectSignatureSync(userInfo) {
  let user = {
    nickName: userInfo.nickName,
    knownWords: userInfo.knownWords,
    categoriesToLearn: userInfo.categoriesToLearn,
    wordsToStudy: userInfo.wordsToStudy,
    wordsToRepeat: userInfo.wordsToRepeat,
    relevance: userInfo.relevance,
    options: userInfo.options,
    statistics: userInfo.statistics,
  };
  let info = {
    nickName: JSON.stringify(userInfo.nickName).split(''),
    knownWords: JSON.stringify(userInfo.knownWords).split(''),
    categoriesToLearn: JSON.stringify(userInfo.categoriesToLearn).split(''),
    wordsToStudy: JSON.stringify(userInfo.wordsToStudy).split(''),
    wordsToRepeat: JSON.stringify(userInfo.wordsToRepeat).split(''),
    relevance: JSON.stringify(userInfo.relevance).split(''),
    options: JSON.stringify(userInfo.options).split(''),
    statistics: JSON.stringify(userInfo.statistics).split(''),
    data: JSON.stringify(user).split(''),
  };
  for (let key in info) {
    let amountDiffSymbol = {};
    info[key].forEach((x) => {
      amountDiffSymbol[x] = (amountDiffSymbol[x] || 0) + 1;
    });
    info[key] = JSON.stringify(amountDiffSymbol);
  }

  for (let key in userInfo.signature) {
    let hash = userInfo.signature[key];
    let descrypt = AES.decrypt(hash, secretSyncSignature);
    descrypt = descrypt.toString(Utf8);
    if (info[key] != descrypt) return false;
  }
  return true;
}
function requireSyncFields(userInfo) {
  let allowedFields = [
    'knownWords',
    'categoriesToLearn',
    'wordsToStudy',
    'wordsToRepeat',
    'relevance',
    'options',
    'statistics',
  ];
  let fields = {};
  for (let field in userInfo) {
    if (!allowedFields.includes(field)) continue;
    let requireSyncField = userInfo[field].filter((item) => item.offline);
    if (requireSyncField.length == 0) continue;
    fields[field] = requireSyncField;
  }
  return fields;
}
function fixAllIrregularVerbs(fields) {
  const neededFields = [
    'knownWords',
    'wordsToStudy',
    'wordsToRepeat',
    'relevance',
  ];
  for (let field in fields) {
    if (!neededFields.includes(field)) continue;
    for (let item of fields[field]) {
      if (checkIrregularVerb(item.word)) {
        let irregularVerbs = item.word.split('--');
        irregularVerbs = irregularVerbs.map((item) =>
          item.trim().toLowerCase()
        );
        item.word = irregularVerbs.join('--');
      }
      continue;
    }
  }

  return fields;
}
/* Операция синхронизации */
async function executeSync(newItems, userID) {
  try {
    const allowedFields = [
      'knownWords',
      'categoriesToLearn',
      'wordsToRepeat',
      'relevance',
    ];

    let res;
    res = await validateSyncDataToDelete(newItems, userID);
    if (!res) throw new Error('Валидация удаления');
    res = await executeSyncOperationDelete(newItems, userID);
    if (!res) throw new Error('Операция синхронизации: удаление');

    for (let field in newItems) {
      if (!allowedFields.includes(field)) continue;
      res = await validateSyncDataToAdd(newItems, field, userID);
      if (!res) throw new Error(`Валидация добавления поля ${field}`);
      res = await executeSyncOperationAdd(newItems, field, userID);
      if (!res)
        throw new Error(`Операция синхронизации: добавление; поле: ${field}`);
    }

    for (let field in newItems) {
      if (!allowedFields.includes(field)) continue;
      res = await validateSyncDataToUpdate(newItems, field, userID);
      if (!res) throw new Error(`Валидация обновления поля ${field}`);
      res = await executeSyncOperationUpdate(newItems, field, userID);
      if (!res)
        throw new Error(`Операция синхронизации: обновления; поле: ${field}`);
    }

    if (newItems.wordsToStudy) {
      res = await validateSyncDataToAdd(newItems, 'wordsToStudy', userID);
      if (!res) throw new Error(`Валидация добавления поля wordsToStudy`);
      res = await executeSyncOperationAdd(newItems, 'wordsToStudy', userID);
      if (!res)
        throw new Error(
          `Операция синхронизации: добавление; поле: wordsToStudy`
        );

      res = await validateSyncDataToUpdate(newItems, 'wordsToStudy', userID);
      if (!res) throw new Error(`Валидация обновления поля  wordsToStudy`);
      res = await executeSyncOperationUpdate(newItems, 'wordsToStudy', userID);
      if (!res)
        throw new Error(
          `Операция синхронизации: обновления; поле:  wordsToStudy`
        );
    }

    const infoFields = ['statistics', 'options'];
    for (let field in newItems) {
      if (!infoFields.includes(field)) continue;
      let changeFields = {};
      let item = newItems[field][0];
      for (let key in item) {
        if (key == 'offline') continue;
        changeFields[[`${field}.0.${key}`]] = item[key]; // [`statistics.0.bestStreak`] : res
      }
      let updateItem = await User.findOneAndUpdate(
        { _id: userID },
        { $set: changeFields },
        { rawResult: true, new: true }
      );
      if (updateItem.ok == 0)
        throw new Error('Не удалось обновить статистику и настройки');
    }

    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
/* Иснтрументы синхронизации */
async function executeSyncOperationDelete(newItems, userID) {
  try {
    const allowedFields = [
      'knownWords',
      'categoriesToLearn',
      'wordsToStudy',
      'wordsToRepeat',
      'relevance',
    ];

    for (let field in newItems) {
      if (!allowedFields.includes(field)) continue;
      let itemsForDelete = []; // elementsID
      for (let item of newItems[field]) {
        if (item.offline == 'delete') {
          itemsForDelete.push(item._id);
        }
      }
      if (itemsForDelete.length > 0) {
        let deleteItems = await multiPullElement(field, itemsForDelete, userID);
        if (!deleteItems) throw new Error('sync operation');
      }
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
async function executeSyncOperationAdd(newItems, field, userID) {
  try {
    let itemsForAdd = []; // items
    for (let item of newItems[field]) {
      if (item.offline == 'add') itemsForAdd.push(item);
    }
    if (itemsForAdd.length > 0) {
      let addItems = await multiPushNewElement(field, itemsForAdd, userID);
      if (!addItems) throw new Error('sync operation');
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
async function executeSyncOperationUpdate(newItems, field, userID) {
  try {
    let itemsForUpdate = []; // [{elementID: 'id', changeFields: { name: 'new name'}}, {}, {}]
    for (let item of newItems[field]) {
      if (item.offline == 'update') {
        let elementID = item._id;
        let changeFields = {};
        for (let key in item) {
          if (key == 'offline' || key == '_id') continue;
          changeFields[key] = item[key];
        }
        itemsForUpdate.push({ elementID, changeFields });
      }
    }
    if (itemsForUpdate.length > 0) {
      let updateItems = await multiSetElement(field, itemsForUpdate, userID);
      if (!updateItems) throw new Error('sync operation');
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

async function validateSyncDataToDelete(newItems, userID) {
  try {
    const allowedFields = [
      'knownWords',
      'categoriesToLearn',
      'wordsToStudy',
      'wordsToRepeat',
      'relevance',
    ];

    let user = await getUserInfo(
      userID,
      'knownWords categoriesToLearn wordsToStudy wordsToRepeat relevance'
    );
    if (!user) return false;

    for (let field in newItems) {
      let itemForDelete = [];
      if (!allowedFields.includes(field)) continue;
      for (let item of newItems[field]) {
        if (item.offline == 'delete') {
          itemForDelete.push({ id: item._id, name: item.word || item.name });
        }
      }
      switch (field) {
        case 'knownWords': {
          if (itemForDelete.length > 0) {
            if (!isHasWordsByWordAndID(itemForDelete, 'knownWords', user))
              throw new Error(`Проверка для удаления поля ${field}`);
          }
          break;
        }
        case 'relevance': {
          if (itemForDelete.length > 0) {
            if (!isHasWordsByWordAndID(itemForDelete, 'relevance', user))
              throw new Error(`Проверка для удаления поля ${field}`);
          }
          break;
        }
        case 'categoriesToLearn': {
          if (itemForDelete.length > 0) {
            if (!isHasCategoriesByNameAndID(itemForDelete, user))
              throw new Error(`Проверка для удаления поля ${field}`);
          }
          break;
        }
        case 'wordsToStudy': {
          if (itemForDelete.length > 0) {
            if (!isHasWordsByWordAndID(itemForDelete, 'wordsToStudy', user))
              throw new Error(`Проверка для удаления поля ${field}`);
          }
          break;
        }
        case 'wordsToRepeat': {
          if (itemForDelete.length > 0) {
            if (!isHasWordsByWordAndID(itemForDelete, 'wordsToRepeat', user))
              throw new Error(`Проверка для удаления поля ${field}`);
          }
          break;
        }
      }
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
async function validateSyncDataToAdd(newItems, field, userID) {
  try {
    let user = await getUserInfo(
      userID,
      'knownWords categoriesToLearn wordsToStudy wordsToRepeat relevance'
    );
    if (!user) return false;

    let itemForAdd = [];
    for (let item of newItems[field]) {
      if (item.offline == 'add') {
        itemForAdd.push({
          id: item._id,
          name: item.word || item.name,
          category: item.category || null,
        });
      }
    }
    switch (field) {
      case 'knownWords': {
        if (itemForAdd.length > 0) {
          if (isHasWordsByWord(itemForAdd, user))
            throw new Error(`Проверка для добавления поля ${field}`);
        }
        break;
      }
      case 'relevance': {
        if (itemForAdd.length > 0) {
          if (isHasWordsByWord(itemForAdd, user))
            throw new Error(`Проверка для добавления поля ${field}`);
        }

        break;
      }
      case 'categoriesToLearn': {
        if (itemForAdd.length > 0) {
          if (isHasCategoriesByName(itemForAdd, user))
            throw new Error(`Проверка для добавления поля ${field}`);
        }
        break;
      }
      case 'wordsToRepeat': {
        if (itemForAdd.length > 0) {
          if (isHasRepeatWordsByWord(itemForAdd, user))
            throw new Error(`Проверка для добавления поля ${field}`);
        }

        break;
      }
      case 'wordsToStudy': {
        if (itemForAdd.length > 0) {
          if (isHasWordsByWord(itemForAdd, user))
            throw new Error(`Проверка для добавления поля ${field}`);
          if (!isHasCategoriesByID(itemForAdd, user))
            throw new Error(`Проверка для добавления поля ${field}`);
        }

        break;
      }
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}
async function validateSyncDataToUpdate(newItems, field, userID) {
  try {
    let user = await getUserInfo(
      userID,
      'knownWords categoriesToLearn wordsToStudy wordsToRepeat relevance'
    );
    if (!user) return false;

    let itemForUpdate = [];
    for (let item of newItems[field]) {
      if (item.offline == 'update') {
        itemForUpdate.push({
          id: item._id,
          name: item.word || item.name,
          category: item.category || null,
        });
      }
    }
    switch (field) {
      case 'knownWords': {
        if (itemForUpdate.length > 0) {
          if (isHasSimilarWords(itemForUpdate, user))
            throw new Error(`Проверка для обновления поля ${field}`);
          if (!isHasWordsByID(itemForUpdate, 'knownWords', user))
            throw new Error(`Проверка для обновления поля ${field}`);
        }

        break;
      }
      case 'relevance': {
        if (itemForUpdate.length > 0) {
          if (isHasSimilarWords(itemForUpdate, user))
            throw new Error(`Проверка для обновления поля ${field}`);
          if (!isHasWordsByID(itemForUpdate, 'relevance', user))
            throw new Error(`Проверка для обновления поля ${field}`);
        }

        break;
      }
      case 'categoriesToLearn': {
        if (itemForUpdate.length > 0) {
          if (isHasSimilarCategories(itemForUpdate, user))
            throw new Error(`Проверка для обновления поля ${field}`);
          if (!isHasCategoriesByID(itemForUpdate, user))
            throw new Error(`Проверка для обновления поля ${field}`);
        }
        break;
      }
      case 'wordsToRepeat': {
        if (itemForUpdate.length > 0) {
          if (isHasSimilarRepeatWords(itemForUpdate, user))
            throw new Error(`Проверка для обновления поля ${field}`);
          if (!isHasWordsByID(itemForUpdate, 'wordsToRepeat', user))
            throw new Error(`Проверка для обновления поля ${field}`);
        }

        break;
      }
      case 'wordsToStudy': {
        if (itemForUpdate.length > 0) {
          if (isHasSimilarWords(itemForUpdate, user))
            throw new Error(`Проверка для обновления поля ${field}`);
          if (!isHasWordsByID(itemForUpdate, 'wordsToStudy', user))
            throw new Error(`Проверка для обновления поля ${field}`);
          if (!isHasCategoriesByID(itemForUpdate, user))
            throw new Error(`Проверка для обновления поля ${field}`);
        }

        break;
      }
    }
    return true;
  } catch (err) {
    console.log(err);
    return false;
  }
}

function checkIrregularVerb(word) {
  if (!/--/g.test(word)) return false;
  let words = word.split('--');
  if (words.length != 3) return false;
  return true;
}
/* words = [{id , name, category}]; field = String; userInfo = Object */
function isHasWordsByWordAndID(words, field, userInfo) {
  let oldWords = userInfo[field];

  for (let newItem of words) {
    let word = newItem.name;
    let id = newItem.id.toString();
    let index = oldWords.findIndex((oldItem) => {
      return oldItem.word == word && oldItem._id.toString() == id;
    });
    if (index == -1) return false;
  }
  return true;
}
/* words = [{id , name, category}]; field = String; userInfo = Object */
function isHasWordsByID(words, field, userInfo) {
  let oldWords = userInfo[field];

  for (let newItem of words) {
    let id = newItem.id.toString();
    let index = oldWords.findIndex((oldItem) => oldItem._id.toString() == id);
    if (index == -1) return false;
  }
  return true;
}
/* words = [{id , name, category}];  userInfo = Object */
function isHasCategoriesByNameAndID(categories, userInfo) {
  let oldcategories = userInfo.categoriesToLearn;

  for (let newItem of categories) {
    let name = newItem.name;
    let id = newItem.id.toString();
    let index = oldcategories.findIndex(
      (oldItem) => oldItem.name == name && oldItem._id.toString() == id
    );
    if (index == -1) return false;
  }
  return true;
}

/* words = [{id , name, category}];  userInfo = Object */
function isHasSimilarWords(words, userInfo) {
  let allWords = [
    ...userInfo.wordsToStudy,
    ...userInfo.knownWords,
    ...userInfo.relevance,
  ];
  for (let newItem of words) {
    let word = newItem.name;
    let id = newItem.id.toString();
    for (let oldItem of allWords) {
      let oldWord = oldItem.word;
      let oldID = oldItem._id.toString();
      if (checkIrregularVerb(word)) {
        let irregularVerbs = word.split('--');
        if (oldItem.irregularVerb == false) {
          if (irregularVerbs.includes(oldWord) && oldID != id) return true;
        } else if (oldWord == word && oldID != id) return true;
        continue;
      } else if (oldItem.irregularVerb == false) {
        if (oldWord == word && oldID != id) return true;
        continue;
      } else {
        let irregularVerbs = oldWord.split('--');
        irregularVerbs = irregularVerbs.map((item) =>
          item.toLowerCase().trim()
        );
        if (irregularVerbs.includes(word) && oldID != id) return true;
        continue;
      }
    }
  }
  return false;
}
/* words = [{id , name, category}];  userInfo = Object */
function isHasWordsByWord(words, userInfo) {
  let allWords = [
    ...userInfo.wordsToStudy,
    ...userInfo.knownWords,
    ...userInfo.relevance,
  ];

  for (let newItem of words) {
    let word = newItem.name;
    let index = allWords.findIndex((oldItem) => {
      let oldWord = oldItem.word;
      if (checkIrregularVerb(word)) {
        let irregularVerbs = word.split('--');
        if (oldItem.irregularVerb == false)
          return irregularVerbs.includes(oldWord);
        return oldWord == word;
      } else if (oldItem.irregularVerb == false) return oldWord == word;
      else {
        let irregularVerbs = oldWord.split('--');
        irregularVerbs = irregularVerbs.map((item) =>
          item.toLowerCase().trim()
        );
        return irregularVerbs.includes(word);
      }
    });

    if (index != -1) return true;
  }
  return false;
}

/* categories = [{id , name, category}];  userInfo = Object */
function isHasSimilarCategories(categories, userInfo) {
  let oldCategories = userInfo.categoriesToLearn;
  for (let newItem of categories) {
    let name = newItem.name;
    let id = newItem.id.toString();

    for (let oldItem of oldCategories) {
      let oldName = oldItem.name;
      let oldID = oldItem._id.toString();
      if (oldName == name && oldID != id) return true;
    }
  }
  return false;
}
/* categories = [{id , name, category}];  userInfo = Object */
function isHasCategoriesByName(categories, userInfo) {
  let oldcategories = userInfo.categoriesToLearn;

  for (let newItem of categories) {
    let name = newItem.name;
    let index = oldcategories.findIndex((oldItem) => oldItem.name == name);
    if (index != -1) return true;
  }
  return false;
}
/* categories = [{id , name, category}];  userInfo = Object */
function isHasCategoriesByID(categories, userInfo) {
  let oldcategories = userInfo.categoriesToLearn;

  for (let newItem of categories) {
    let categoryID = newItem.category ? newItem.category.toString() : null;
    let id = newItem.id.toString();
    let index = oldcategories.findIndex(
      (oldItem) =>
        oldItem._id.toString() == id || oldItem._id.toString() == categoryID
    );
    if (index == -1) return false;
  }
  return true;
}

/* words = [{id , name, category}];  userInfo = Object */
function isHasSimilarRepeatWords(words, userInfo) {
  let allWords = userInfo.wordsToRepeat;

  for (let newItem of words) {
    let word = newItem.name;
    let id = newItem.id.toString();
    for (let oldItem of allWords) {
      let oldWord = oldItem.word;
      let oldID = oldItem._id.toString();
      if (checkIrregularVerb(word)) {
        let irregularVerbs = word.split('--');
        if (oldItem.irregularVerb == false) {
          if (irregularVerbs.includes(oldWord) && oldID != id) return true;
        } else if (oldWord == word && oldID != id) return true;
        continue;
      } else if (oldItem.irregularVerb == false) {
        if (oldWord == word && oldID != id) return true;
        continue;
      } else {
        let irregularVerbs = oldWord.split('--');
        irregularVerbs = irregularVerbs.map((item) =>
          item.toLowerCase().trim()
        );
        if (irregularVerbs.includes(word) && oldID != id) return true;
        continue;
      }
    }
  }
  return false;
}
/* words = [{id , name, category}];  userInfo = Object */
function isHasRepeatWordsByWord(words, userInfo) {
  let allWords = userInfo.wordsToRepeat;

  for (let newItem of words) {
    let word = newItem.name;
    let index = allWords.findIndex((oldItem) => {
      let oldWord = oldItem.word;
      if (checkIrregularVerb(word)) {
        let irregularVerbs = word.split('--');
        if (oldItem.irregularVerb == false)
          return irregularVerbs.includes(oldWord);
        return oldWord == word;
      } else if (oldItem.irregularVerb == false) return oldWord == word;
      else {
        let irregularVerbs = oldWord.split('--');
        irregularVerbs = irregularVerbs.map((item) =>
          item.toLowerCase().trim()
        );
        return irregularVerbs.includes(word);
      }
    });
    if (index != -1) return true;
  }
  return false;
}

function isNowDay(date) {
  let dateToDay = millisecondToDay(date);
  let now = millisecondToDay(Date.now());
  if (now == dateToDay) return true;
  return false;
}
function millisecondToDay(date) {
  let day = Math.floor(fixDateToUTC3(date) / (1000 * 60 * 60 * 24));
  return day;
}
function fixDateToUTC3(date) {
  let fixedDate = date + 1000 * 60 * 60 * 3;
  return fixedDate;
}
function isHasEmailOrNickname(users, reqData) {
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
    return 'Email и NickName уже используются другим пользователем!';
  } else if (similarNickName) {
    return 'NickName уже используется другим пользователем!';
  } else if (similarEmail) {
    return 'Email уже используется другим пользователем!';
  }
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
async function getUserInfo(userID, showFields = '') {
  try {
    let user = await User.findOne(
      {
        _id: userID,
      },
      `${showFields}`
    );
    if (!user) return false;
    return user._doc;
  } catch (err) {
    console.log(err);
    return false;
  }
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

import * as dotenv from 'dotenv';
dotenv.config({ path: 'config.env' });
const secretAccessToken = process.env.SECRET_ACCESS_TOKEN;
const secretRefreshToken = process.env.SECRET_REFRESH_TOKEN;
const secretPassword = process.env.SECRET_PASSWORD_TO_HASH;
const timeExistForCheckKeys = 5; // В минутах
const maxSizeAvatar = 1 * 1024 * 1024;

import User from '../models/Users.js';

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
    if (users.length > 0) {
      return res.status(400).json({
        message: isHasEmailOrNickname(users, req.body),
      });
    }

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
      from: process.env.POST_LOGIN,
      to: req.body.email,
      subject: `Подтверждение аккаунта`,
      text: `Перейдите по ссылке, чтобы активировать аккаунт: http://${process.env.HOST}:${process.env.PORT}/confirm/${user.confirmKey}`,
      html: `Перейдите по ссылке, чтобы активировать аккаунт: <a href="http://${process.env.HOST}:${process.env.PORT}/confirm/${user.confirmKey}">Confirm</a> `,
    };
    await transporter.sendMail(message);

    return res.json({
      message:
        'Регистрация прошла успешно! На вашу почту выслано сообщение с инструкцией по активации аккаунта!',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Не удалось выполнить операцию!',
    });
  }
};

export const login = async (req, res) => {
  try {
    let { nickName, password } = req.body;
    let user = await User.findOne({ nickName: nickName });
    if (!user) {
      return res.status(400).json({
        message: 'Неправльный логин или пароль!',
      });
    }
    let { hash } = getHash(password, user.salt);
    if (hash != user.hash) {
      return res.status(400).json({
        message: 'Неправльный логин или пароль!',
      });
    }
    if (user.confirmed == false) {
      return res.status(400).json({
        message: 'Аккаунт не подтвержден! Следуйте инструкции на почте!',
      });
    }

    let { refreshToken, accessToken } = getTokens(user._id);

    let update = await User.updateOne(
      {
        nickName: user.nickName,
      },
      {
        refreshToken: refreshToken,
        lastLogin: Date.now(),
      },
      {
        upsert: false,
      }
    );
    if (update.modifiedCount == 0) {
      return res
        .status(400)
        .json({ message: `Не удалось выполнить операцию!` });
    }

    const timeExistCookies = getTimeExistCoockies();
    if (!process.env.PRODUCTION) {
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        expires: timeExistCookies,
        sameSite: 'None', // DEV OPTIONS strict - if UI exist inside domain
        secure: true, // DEV OPTIONS true - if app use https protocol
      });
    } else {
      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        expires: timeExistCookies,
        sameSite: 'strict',
        secure: true,
      });
    }

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
    console.log(req.userId);
    let refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
      return res.status(401).json({
        message: 'Вы не авторизованы!',
      });
    }
    try {
      let decoded = jwt.verify(refreshToken, secretRefreshToken);
    } catch (err) {
      return res.status(401).json({
        message: 'Вы не авторизованы!',
      });
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
      return res.status(401).json({
        message: 'Вы не авторизованы!',
      });
    }
    return res.json({
      message: 'Вы успешно вышли из системы!',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Не удалось выполнить операцию!',
    });
  }
};

export const updateAccessToken = async (req, res) => {
  try {
    let refreshTokenFromCoockies = req.cookies?.refreshToken;
    if (!refreshTokenFromCoockies) {
      return res.status(401).json({
        message: 'Требуется авторизация!',
      });
    }

    try {
      let decoded = jwt.verify(refreshTokenFromCoockies, secretRefreshToken);
    } catch (err) {
      console.log(err);
      return res.status(401).json({
        message: 'Требуется авторизация!',
      });
    }

    let user = await User.findOne({ refreshToken: refreshTokenFromCoockies });
    if (!user) {
      return res.status(401).json({
        message: 'Требуется авторизация!',
      });
    }
    let update = await User.updateOne(
      { refreshToken: refreshTokenFromCoockies },
      { lastLogin: Date.now() },
      { upsert: false }
    );
    const { accessToken } = getTokens(user._id);
    let userData = getUserInfoFromDoc(user._doc);
    return res.json({
      token: accessToken,
      user: userData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Не удалось выполнить операцию!',
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

    if (user.emailToConfirm == '') {
      return res.status(400).json({
        message: 'Ключ не прошел проверку подлинности!',
      });
    }
    if (!(user.confirmTime == 0 || user.confirmTime > Date.now())) {
      return res.status(400).json({
        message: 'Время операции истекло!',
      });
    }

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
    if (update.modifiedCount == 0) {
      return res
        .status(400)
        .json({ message: 'Не удалось выполнить операцию!' });
    }
    return res.json({ message: 'Аккаунт успешно подтвержден!' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: 'Не удалось выполнить операцию!' });
  }
};

export const changeEmail = async (req, res) => {
  try {
    let { password, email, key } = req.body;

    let user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res.status(400).json({
        message: 'Невозможно выполнить операцию!',
      });
    }

    if (user.confirmKey != key)
      return res.status(400).json({
        message: 'Неверный пароль или ключ подтверждения!',
      });

    let { hash } = getHash(password, user.salt);

    if (hash != user.hash) {
      return res.status(400).json({
        message: 'Неверный пароль или ключ подтверждения!',
      });
    }
    if (user.confirmTime < Date.now()) {
      return res.status(400).json({
        message: `Время операции истекло!`,
      });
    }
    if (user.emailToConfirm != '') {
      return res.status(400).json({
        message: `Вы уже отправляли заявку на смену Email. Перейдите на почту и проверьте сообщение!`,
      });
    }
    let hasEmail = await User.findOne({ email: email });
    if (hasEmail) {
      return res.status(400).json({
        message: 'Email уже используется другим пользователем!',
      });
    }

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
    if (update.modifiedCount == 0) {
      return res.status(400).json({
        message: `Не удалось выполнить операцию!`,
      });
    }
    const message = {
      from: process.env.POST_LOGIN,
      to: user.email,
      subject: `Смена почты`,
      text: `Перейдите по ссылке, чтобы изменить Email: http://${process.env.HOST}:${process.env.PORT}/confirm/${confirmKey}`,
      html: `Перейдите по ссылке, чтобы изменить Email:  <a href="http://${process.env.HOST}:${process.env.PORT}/confirm/${confirmKey}">Confirm</a> `,
    };
    await transporter.sendMail(message);

    return res.json({
      message:
        'На почту была отправлена дальнейшая инструкция по смене почты! Проследуйте по ссылке в инструкции!',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    let { nickName, email } = req.body;
    let user = await User.findOne({ nickName: nickName });
    if (!user) {
      return res.status(400).json({
        message: `Не верный email или Nickname!`,
      });
    }
    if (user.email != email) {
      return res.status(400).json({
        message: `Не верный email или Nickname!`,
      });
    }
    if (isNowDay(user.dateOfPassword)) {
      return res.status(400).json({
        message: `Изменять пароль можно не чаще, чем один раз в день!`,
      });
    }
    if (user.resetPasswordTime > Date.now()) {
      return res.status(400).json({
        message: `Вы не завершили попытку смены пароля! Следуйте инструкции на почте!`,
      });
    }

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
    if (update.modifiedCount == 0) {
      return res.status(400).json({
        message: `Не удалось выполнить операцию!`,
      });
    }
    const message = {
      from: process.env.POST_LOGIN,
      to: req.body.email,
      subject: `Смена пароля`,
      text: `Перейдите по ссылке для смены пароля на вашем аккаунте: http://${process.env.HOST}:${process.env.PORT}/pass/${resetPasswordKey}`,
      html: `Перейдите по ссылке для смены пароля на вашем аккаунте: <a href="http://${process.env.HOST}:${process.env.PORT}/pass/${resetPasswordKey}">ResetPassword</a> `,
    };
    await transporter.sendMail(message);

    res.json({
      message:
        'На ваше почту было отправлено сообщение с инструкцией по смене вашего пароля!',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Не удалось выполнить операцию!',
    });
  }
};

export const newPassword = async (req, res) => {
  try {
    let { password, key } = req.body;
    let user = await User.findOne({ resetPasswordKey: key });
    if (!user) {
      return res.status(400).json({
        message: `Ключ не прошел порверку подлинности!`,
      });
    }
    if (user.resetPasswordTime < Date.now()) {
      return res.status(400).json({
        message: `Время выполнения операции истекло!`,
      });
    }
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
    if (update.modifiedCount == 0) {
      return res.status(400).json({
        message: `Не удалось выполнить операцию!`,
      });
    }
    res.json({ message: 'Пароль успешно изменен!' });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: 'Не удалось выполнить операцию!',
    });
  }
};

export const changeAvatar = async (req, res) => {
  try {
    let file = req?.file;
    if (!file)
      return res
        .status(400)
        .json({ message: 'Не удалось выполнить операцию!' });

    let user = await User.findOne({ _id: req.userId });
    if (!user)
      return res
        .status(400)
        .json({ message: 'Не удалось выполнить операцию!' });
    let nickName = user.nickName;

    if (file.size > maxSizeAvatar) {
      let dir = `${__dirname}/../uploads/${nickName}`;
      if (fs.existsSync(dir)) fs.rmSync(dir, { recursive: true });
      return res
        .status(400)
        .json({ message: 'Не удалось выполнить операцию!' });
    }

    user = await User.findOneAndUpdate(
      { _id: req.userId },
      { avatar: file.filename },
      {
        new: true,
        rawResult: true,
      }
    );
    if (user.ok == 0)
      return res.status(400).json({
        message: `Не удалось выполнить операцию!`,
      });

    let userData = getUserInfoFromDoc(user.value._doc);

    res.json({
      message: 'Аватар успешно изменен!',
      user: userData,
    });
  } catch (err) {
    console.log(err);
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
    return res.status(400).json({
      message: `Не удалось выполнить операцию!`,
    });
  } catch (err) {
    console.log(err);
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
    if (user.ok == 0)
      return res.status(400).json({
        message: `Не удалось выполнить операцию!`,
      });

    let userData = getUserInfoFromDoc(user.value._doc);
    return res.json({
      message: `Имя пользователя успешно изменено!`,
      user: userData,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};
const changeInfoEmail = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.userId });
    if (!user)
      return res.status(400).json({
        message: `Невозможно выполнить операцию!`,
      });
    let email = req.body?.email;
    if (user.email != email)
      return res.status(400).json({ message: 'Неправильно введен Email!' });

    let dateOfConfirm = user.dateOfConfirm;
    if (isNowDay(dateOfConfirm)) {
      return res.status(400).json({
        message: `Невозможно имзенять Email чаще одного раза в день!`,
      });
    }
    if (user.confirmTime > Date.now()) {
      return res.status(400).json({
        message: `Вы уже отправляли заявку на смену Email. Перейдите на почту и проверьте сообщение!`,
      });
    }

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
    if (update.modifiedCount == 0) {
      return res.status(400).json({
        message: `Не удалось выполнить операцию!`,
      });
    }
    const message = {
      from: process.env.POST_LOGIN,
      to: email,
      subject: `Выбор почты`,
      text: `Перейдите по ссылке, чтобы указать новый Email: http://${process.env.HOST}:${process.env.PORT}/email/${confirmKey}`,
      html: `Перейдите по ссылке, чтобы указать новый Email:  <a href="http://${process.env.HOST}:${process.env.PORT}/email/${confirmKey}">Confirm</a> `,
    };
    await transporter.sendMail(message);

    return res.json({
      message: 'На почту отправлено сообщение с инструкцией по смене Email!',
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};
const changeInfoPassword = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.userId });
    if (!user)
      return res.status(400).json({
        message: `Не удалось выполнить операцию!`,
      });

    let nickName = user._doc.nickName;
    let email = req.body?.password;
    if (user.email != email)
      return res.status(400).json({ message: 'Неверный email!' });

    let data = {
      body: {
        nickName,
        email,
      },
    };
    return forgotPassword(data, res);
  } catch (err) {
    console.log(err);
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
      return res.status(400).json({
        message: `NickName уже занят!`,
      });

    user = await User.findOne({ _id: req.userId });
    if (!user)
      return res
        .status(400)
        .json({ message: 'Не удалось выполнить операцию!' });

    let oldNickName = user.nickName;
    let dir = `${__dirname}/../uploads/${nickName}`;
    let oldDir = `${__dirname}/../uploads/${oldNickName}`;

    if (fs.existsSync(oldDir)) fs.renameSync(oldDir, dir);

    user = await User.findOneAndUpdate(
      { _id: req.userId },
      { nickName: nickName },
      { new: true, rawResult: true }
    );
    if (user.ok == 0)
      return res
        .status(400)
        .json({ message: `Не удалось выполнить операцию!` });

    let userInfo = getUserInfoFromDoc(user.value._doc);
    res.json({ message: 'NickName успешно изменен!', user: userInfo });
  } catch (err) {
    console.log(err);
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
    if (user.ok == 0)
      return res.status(400).json({
        message: `Не удалось выполнить операцию!`,
      });

    let userInfo = getUserInfoFromDoc(user.value._doc);
    res.json({ message: 'Операция выполнена успешно!', user: userInfo });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};

export const exportUserData = async (req, res) => {
  try {
    let user = await User.findOne({ _id: req.userId });
    if (!user) {
      return res
        .status(400)
        .json({ message: 'Не удалось выполнить операцию!' });
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
    console.log(userData);

    let signature = getSignature(userData);
    userData.signature = signature;

    res.json({ message: JSON.stringify(userData) });
  } catch (err) {
    console.log(err);
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};

export const importUserData = async (req, res) => {
  try {
    let { userInfo } = req.body;
    let correctSignature = isCorrectSignature(userInfo);
    if (!correctSignature)
      return res.status(400).json({ message: 'Данные повреждены!' });

    res.json('sosi');
  } catch (err) {
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
    console.log(err);
    return res.status(500).json({
      message: `Не удалось выполнить операцию!`,
    });
  }
};

function getTokens(userID) {
  const accessToken = jwt.sign(
    {
      userId: userID,
    },
    secretAccessToken,
    {
      expiresIn: `${process.env.LIVE_TIME_ACCESS_TOKEN}`,
    }
  );
  const refreshToken = jwt.sign({ id: userID }, secretRefreshToken, {
    expiresIn: `${process.env.LIVE_TIME_REFRESH_TOKEN}`,
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
  let signature = {
    knownWords: JSON.stringify(userInfo.knownWords).length,
    categoriesToLearn: JSON.stringify(userInfo.categoriesToLearn).length,
    wordsToStudy: JSON.stringify(userInfo.wordsToStudy).length,
    wordsToRepeat: JSON.stringify(userInfo.wordsToRepeat).length,
    relevance: JSON.stringify(userInfo.relevance).length,
    options: JSON.stringify(userInfo.options).length,
    export: JSON.stringify(userInfo).length,
  };
  for (let key in signature) {
    let { hash } = getHash(signature[key], 'signature');
    signature[key] = hash;
  }

  console.log(signature);
  return signature;
}
function isCorrectSignature(userInfo) {
  let { signatureForCheck, ...userData } = userInfo;

  let signature = {
    knownWords: JSON.stringify(userData.knownWords).length,
    categoriesToLearn: JSON.stringify(userData.categoriesToLearn).length,
    wordsToStudy: JSON.stringify(userData.wordsToStudy).length,
    wordsToRepeat: JSON.stringify(userData.wordsToRepeat).length,
    relevance: JSON.stringify(userData.relevance).length,
    options: JSON.stringify(userData.options).length,
    export: JSON.stringify(userData).length,
  };
  let correct = true;
  for (let key in signature) {
    let { hash } = getHash(signature[key], 'signature');
    if (signatureForCheck[key] != hash) correct = false;
    console.log(`${key} = ${correct}`);
  }
  return correct;
}

function isNowDay(date) {
  let dateToDay = millisecondToDay(date);
  let now = millisecondToDay(Date.now());
  if (now == dateToDay) return true;
  return false;
}
function millisecondToDay(millisecond) {
  let day = 1000 * 60 * 60 * 24;
  return Math.floor(millisecond / day);
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

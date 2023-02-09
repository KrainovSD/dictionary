import User from '../models/Users.js';
import jwt from 'jsonwebtoken';

export const getUserList = async (req, res) => {
  try {
    let userList = await User.find().exec();
    userList = userList.map((item) => item.nickName);
    return res.json({ userList });
  } catch (err) {
    console.log(err);
    return sendResponseError(res);
  }
};

export const addNewKnownWords = async (req, res) => {
  try {
    let { user, words } = req.body;
    let userInfo = await User.findOne({ nickName: user });
    if (!userInfo) return sendResponseError(res);
    let oldWords = userInfo.knownWords.map((item) => item.word);
    let similarWords = words.filter((item) => {
      if (isHasKnownWord(item.word, oldWords)) return true;
    });
    similarWords = similarWords.map((item) => item.word);
    words = words.filter((item) => !similarWords.includes(item.word));

    words = words.map((item) => {
      let irregularVerb = false;
      if (isIrregularVerb(item.word)) irregularVerb = true;
      return {
        word: item.word,
        translate: item.translate,
        transcription: item.transcription,
        description: item.description,
        example: item.example,
        irregularVerb,
        wrongs: 0,
        lastRepeat: 0,
        lastReverseRepeat: 0,
        historyOfRepeat: [],
        historyOfReverseRepeat: [],
        dateOfKnown: Date.now(),
      };
    });
    let userID = userInfo._id.toString();
    let message = 'Операция выполнена успешно.';
    if (similarWords.length > 0) {
      message += `\n Следующие слова уже присутствуют, всвязи с чем не были добавлены: ${similarWords.join(
        ', '
      )}`;
    }
    if (words.length > 0) {
      let result = await multiPushNewElement('knownWords', words, userID);
      if (!result) return sendResponseError(res);
    }
    res.json({ message });
  } catch (err) {
    console.log(err);
    return sendResponseError(res);
  }
};

function sendResponseError(res) {
  return res.status(500).json({ message: 'Не удалось выполнить операцию' });
}
function isIrregularVerb(word) {
  if (!/--/g.test(word)) return false;
  let words = word.split('--');
  if (words.length != 3) return false;
  return true;
}
function isHasKnownWord(word, oldWords) {
  let hasWord = oldWords.filter((wordItem) => {
    if (isIrregularVerb(word)) {
      let irregularVerbs = word.split('--');
      irregularVerbs = irregularVerbs.map((item) => item.toLowerCase().trim());
      if (!isIrregularVerb(wordItem)) return irregularVerbs.includes(wordItem);
      return wordItem == word;
    }
    if (!isIrregularVerb(wordItem)) return wordItem == word;

    let irregularVerbs = wordItem.split('--');
    irregularVerbs = irregularVerbs.map((item) => item.toLowerCase().trim());
    return irregularVerbs.includes(word);
  });
  if (hasWord?.length != 0) {
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

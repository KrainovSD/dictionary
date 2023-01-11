import mongoose from 'mongoose';
const statisticsSchema = new mongoose.Schema(
  {
    bestStreak: Number,
    currentStreak: Number,
    dateOfLastStreak: Number,
    lastDailyCheckStreak: Number,
    lastRepeatKnownWords: Number,
    historyOfRepeatKnownWords: [Number],
    lastReverseRepeatKnownWords: Number,
    historyOfReverseRepeatKnownWords: [Number],
  },
  { _id: false }
);
const knownWordsShema = new mongoose.Schema({
  word: String,
  translate: String,
  transcription: String,
  description: String,
  example: [String],
  wrongs: Number,
  irregularVerb: Boolean,
  lastRepeat: Number,
  lastReverseRepeat: Number,
  historyOfRepeat: [Number],
  historyOfReverseRepeat: [Number],
  dateOfKnown: Number,
});
const categoriesToLearnShema = new mongoose.Schema({
  name: String,
  regularityToRepeat: [Number],
  icon: String,
  lastRepeat: Number,
  lastReverseRepeat: Number,
  nextRepeat: Number,
  nextReverseRepeat: Number,
  historyOfRepeat: [Number],
  historyOfReverseRepeat: [Number],
  countOfRepeat: Number,
  countOfReverseRepeat: Number,
  startLearn: Boolean,
  dateOfStartLearn: Number,
});
const wordsToStudyShema = new mongoose.Schema({
  word: String,
  translate: String,
  transcription: String,
  description: String,
  example: [String],
  wrongs: Number,
  irregularVerb: Boolean,
  category: String,
});
const wordsToRepeatShema = new mongoose.Schema({
  word: String,
  translate: String,
  transcription: String,
  description: String,
  example: [String],
  irregularVerb: Boolean,
  lastRepeat: Number,
  lastReverseRepeat: Number,
  nextRepeat: Number,
  nextReverseRepeat: Number,
  historyOfRepeat: [Number],
  historyOfReverseRepeat: [Number],
  countOfRepeat: Number,
  countOfReverseRepeat: Number,
  dateOfCreation: Number,
});
const relevanceShema = new mongoose.Schema({
  word: String,
  dateOfCreation: Number,
  dateOfDetected: [Number],
  irregularVerb: Boolean,
});
const optionsShema = new mongoose.Schema(
  {
    countKnownWordsAtOneTime: Number,
    countWrongsToAddToRepeat: Number,
    regularityToRepeat: [Number],
    maxDateCheckRelevance: Number,
    maxCountCheckRelevance: Number,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    userName: { type: String },
    nickName: { type: String },
    email: { type: String },
    hash: { type: String },
    salt: { type: String },
    role: { type: String },
    dateOfPassword: { type: Number },
    resetPasswordKey: { type: String },
    resetPasswordTime: { type: Number },
    confirmed: { type: Boolean },
    dateOfConfirm: { type: Number },
    confirmKey: { type: String },
    confirmTime: { type: Number },
    emailToConfirm: { type: String },
    dateRegistration: { type: Number },
    avatar: { type: String },
    refreshToken: { type: String },
    lastLogin: { type: Number },
    statistics: [statisticsSchema],
    knownWords: [knownWordsShema],
    categoriesToLearn: [categoriesToLearnShema],
    wordsToStudy: [wordsToStudyShema],
    wordsToRepeat: [wordsToRepeatShema],
    relevance: [relevanceShema],
    options: [optionsShema],
  },
  { collection: 'users', versionKey: false } // disable field __v
);

export default mongoose.model('User', userSchema);
/*
findOne (!user)
find (users.length > 0) User.find({
      $or: [{ nickName: req.body.nickName }, { email: req.body.email }],

updateOne - возвращает количество измененных документов
findOneAndUpdate - возвращает документ измененный до или после
*/
/*
{  
    userName: { type: String, required: true },
    nickName: { type: String, required: true },
    email: { type: String, required: true },
    hash: { type: String, required: true },
    salt: { type: String, required: true },
    datePassword: string, !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    resetPasswordKey: String,
    resetPasswordDate: String,
    role: { type: String, required: true },
    confirmed: { type: Boolean, required: true },
    dateRegistration: { type: String, required: true },
    avatar: { type: String, required: true },
    token: { type: String, required: true },
    lastLogin: String,
    statistics: {
        lastLearning: string,
        learnDate: [string],
        bestStreak: number,
    
    },
    knownWords: [
            word: String,
            translate: string, 
            transcription: string,
            description: string,
            example: [string],
            lastRepeat: string,
            lastReverseRepeat: string,
            dateOfKnown: string,
            wrongs: number,
            irregularVerbs: bollean,

    ],
    categoriesToLean: [
            name: string,
            id: number,
            regularityToRepeat: [of number],
            icon: string, 
            lastRepeat: string,
            lastReverseRepeat: string,
            nextRepeat: string,
            nextReverseRepeat: string, 
            historyOfRepeat: [of string],
            countOfRepeat: number,
            startLearn: string,
            
    ],
    wordsToStudy: [
            word: string,
            translate: string, 
            transcription: string,
            description: string,
            example: [string], 
            wrongs: number, 
            category: number,
            irregularVerbs: bollean,
        
    ]
    wordsToRepeat: [
            word: string,
            translate: string, 
            transcription: string,
            description: string,
            example: [string],
            lastRepeat: string,
            lastReverseRepeat: string,
            nextRepeat: string,
            nextReverseRepeat: string,
            irregularVerbs: bollean,
        
    ],
    revelance: [
            word: String,
            dateOfCreation: string,
            dateOfDetected: [string], 
        
    ],
    options: [
        countKnownWordsAtOneTime: number, KnownWords
        countWrongsToAddToRepeat: number,
        regularityToRepeat: [of number],
        maxDateCheck: number,
        maxCountCheck: number,
]
    
*/

import mongoose from 'mongoose';
const statisticsSchema = new mongoose.Schema(
  {
    lastLearning: Number,
    bestStreak: Number,
    lastRepeatKnownWords: Number,
    lastReverseRepeatKnownWords: Number,
  },
  { _id: false }
);
const knownWordsShema = new mongoose.Schema({
  word: String,
  translate: String,
  transcriprion: String,
  description: String,
  example: [String],
  wrongs: Number,
  irregularVerbs: Boolean,
  lastRepeat: Number,
  LastReverseRepeat: Number,
  dateOfKnown: Number,
});
const categoriesToLeanShema = new mongoose.Schema({
  name: String,
  id: Number,
  regularityToRepeat: [Number],
  icon: String,
  lastRepeat: Number,
  lastReverseRepeat: Number,
  nextRepeat: Number,
  nextReverseRepeat: Number,
  historyOfRepeat: [Number],
  countOfRepeat: Number,
  startLearn: Boolean,
});
const wordsToStudyShema = new mongoose.Schema({
  word: String,
  translate: String,
  transcriprion: String,
  description: String,
  example: [String],
  wrongs: Number,
  irregularVerbs: Boolean,
  category: Number,
});
const wordsToRepeatShema = new mongoose.Schema({
  word: String,
  translate: String,
  transcriprion: String,
  description: String,
  example: [String],
  irregularVerbs: Boolean,
  lastRepeat: Number,
  lastReverseRepeat: Number,
  nextRepeat: Number,
  nextReverseRepeat: Number,
  historyOfRepeat: [Number],
  countOfRepeat: Number,
});
const relevanceShema = new mongoose.Schema({
  word: String,
  dataOfCreation: Number,
  dateOfDetected: [Number],
});
const optionsShema = new mongoose.Schema(
  {
    countKnownWordsAtOneTime: Number,
    countWrongsToAddToRepeat: Number,
    regularityToRepeat: [Number],
    maxDateChekRelevance: Number,
    maxCountCheckRelevance: Number,
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    nickName: { type: String, required: true },
    email: { type: String, required: true },
    hash: { type: String, required: true },
    salt: { type: String, required: true },
    role: { type: String, required: true },
    dateOfPassword: { type: Number, required: true },
    resetPasswordKey: { type: String, required: true },
    resetPasswordTime: { type: Number, required: true },
    confirmed: { type: Boolean, required: true },
    dateRegistration: { type: Number, required: true },
    avatar: { type: String, required: true },
    refreshToken: { type: String, required: true },
    lastLogin: { type: Number, required: true },
    statistics: [statisticsSchema],
    knownWords: [knownWordsShema],
    categoriesToLean: [categoriesToLeanShema],
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

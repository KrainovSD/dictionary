import mongoose from 'mongoose';
const userSchema = new mongoose.Schema(
  {
    userName: { type: String, required: true },
    nickName: { type: String, required: true },
    email: { type: String, required: true },
    hash: { type: String, required: true },
    salt: { type: String, required: true },
    role: { type: String, required: true },
    confirmed: { type: Boolean, required: true },
    dateRegistration: { type: String, required: true },
    avatar: { type: String, required: true },
    token: { type: String, required: true },
  },
  { collection: 'users', versionKey: false } // disable field __v
);
export default mongoose.model('User', userSchema);

/*
{  
    userName: { type: String, required: true },
    nickName: { type: String, required: true },
    email: { type: String, required: true },
    hash: { type: String, required: true },
    salt: { type: String, required: true },
    role: { type: String, required: true },
    confirmed: { type: Boolean, required: true },
    dateRegistration: { type: String, required: true },
    avatar: { type: String, required: true },
    token: { type: String, required: true },
    statistics: {
        lastLearning: string,
        bestStreak: number,
    
    },
    knownWords: {
        word: {
            translate: string, 
            transcription: string,
            description: string,
            example: [string],
            lastRepeat: string,
            lastReverseRepeat: string,
            dateOfKnown: string,
            wrongs: number,
            countWordsAtOneTime: number,
        }
    },
    categoriesToLean: {
        name:{
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
        }
    },
    wordsToStudy: {
        word: {
            translate: string, 
            transcription: string,
            description: string,
            example: [string], 
            wrongs: number, 
            category: number,
        }
    }
    wordsToRepeat: {
        word: {
            translate: string, 
            transcription: string,
            description: string,
            example: [string],
            lastRepeat: string,
            lastReverseRepeat: string,
            nextRepeat: string,
            nextReverseRepeat: string,
            countWrongsToRepeat: number,
            regularityToRepeat: [of number],
        }
    }
    

}
*/

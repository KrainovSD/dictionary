import { validationResult } from 'express-validator';

export default (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let errorMessage = {};
    Object.values(errors.errors).forEach((err) => {
      console.log(err.msg);
      if (errorMessage?.error) {
        errorMessage.error += `${err.msg} \n`;
        return;
      }
      errorMessage.error = `${err.msg} \n`;
    });

    return res.status(400).json(errorMessage);
  }
  next();
};

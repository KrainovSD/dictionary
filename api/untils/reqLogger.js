import fs from 'fs';

export default (req, res, next) => {
  const logJSON = {
    date: dateFormat(new Date()),
    reqType: req.method,
    reqPath: req.url,
    protocol: req.protocol,
    userAgent: req.get('User-Agent'),
    ip: req.headers['x-forwarded-for'] || req.socket.remoteAddress,
  };
  res.on('finish', async () => {
    try {
      logJSON.userId = req.userId || 'not authorized';
      logJSON.resCode = res.statusCode;
      logJSON.error = req.err ? req.err.stack : 'no error';
      let logString = `${logJSON.date} | ${logJSON.reqType} | ${logJSON.reqPath} | ${logJSON.protocol} | ${logJSON.userAgent} | ${logJSON.ip} | ${logJSON.userId} | ${logJSON.resCode} \n ${logJSON.error}\n`;
      console.log('______________________');
      console.log(logString);
      fs.appendFileSync(
        'logs/reqLogJSON.txt',
        `${JSON.stringify(logJSON)}\n\n`
      );
      fs.appendFileSync('logs/reqLogString.txt', logString);
      if (res.statusCode === 500) {
        console.log(req.err);
        fs.appendFileSync('logs/reqLogErrors.txt', logString);
      }
    } catch (error) {
      if (error) console.log(error);
    }
  });
  next();
};

function dateFormat(date) {
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

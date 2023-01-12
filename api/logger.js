import fs from 'fs';

export default async (error, area) => {
  let date = dateFormat(new Date());

  let log = `${date} | ${area} | ${error.message}\n ${error.stack}\n\n`;
  try {
    fs.appendFileSync('logs/errorLog.txt', log);
  } catch (err) {
    if (err) console.log(err);
  }
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

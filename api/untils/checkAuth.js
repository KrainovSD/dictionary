import jwt from "jsonwebtoken";
///
import fs from 'fs';
const {secretAccessToken} = JSON.parse(fs.readFileSync('./info.txt',  {encoding:'utf8', flag:'r'}));

export default (req, res, next) => {
    try {    
        let token = req.headers.authorization?.replace(/Bearer\s?/, '');
        if (!token) {
            return res.status(401).json({
                message: "No authorized"
            });
        }
        let decoded = jwt.verify(token, secretAccessToken);
        req.userId = decoded.userId;
        next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({
            message: "No authorized"
        });
    }
};
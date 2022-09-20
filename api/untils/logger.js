export default (req, res, next) => {
    res.on("finish", () => { 
        console.log(res.statusCode);
        console.log(res);
        }
    ); 
    next();
};


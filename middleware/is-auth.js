const jwt = require("jsonwebtoken");
module.exports = (req, res, next) => {
    const authHead = req.get("Authorization");
    if(!authHead){
         const error = new Error("not authorized");
         error.statusCode = 500;
         throw error;
    }
    const token = authHead.split(' ')[1];
 let decodedToken;
 try {
      decodedToken = jwt.verify(token, "jjoo");

 } catch (error) {
     if (!error.statusCode) {
       error.statusCode = 500;
     }
     next(error);
 }
 if(!decodedToken){
     const error = new Error("invalid token");
     error.statusCode = 500;
     throw error;
 }
 req.userId = decodedToken.userId;
}
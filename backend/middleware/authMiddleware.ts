const jwt = require("jsonwebtoken")
const {JWT_SECRET_KEY}  = require("../config")

const authMiddleware = (req:any,res:any,next:any)=>{
    // console.log(req);
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        // console.log("I failed");
        return res.status(403).json({});
    }

    const token = authHeader.split(' ')[1];

      try {
        const success = jwt.verify(token,JWT_SECRET_KEY);
        req.userId = success.userId;
        next();
      } catch (error) {
        // console.log("I failed");
        return res.status(403).json({message : "Token Expired"});
      }
}

module.exports =  authMiddleware;
const jwt = require('jsonwebtoken');

const verifyToken =(req,res,next) =>{
    let token;
    let authHeader = req.headers.Authorization || req.headers.authorization;

    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1];
    
    if(!token){
        return res.status(401).json({message:"No Token Authorization Required"})
    }
    try{
        const decode = jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.user = decode;
        next();
    }
    catch(error){
        req.status(403).json({message:"No Token Authorization Required"})
    }
    
}
else{
    res.status(401).json({message:"No Token"})
}
}   
module.exports = verifyToken;
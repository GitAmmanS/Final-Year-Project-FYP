const autohrizedRoles =(...allowedRoles)=>{
    return (req,res,next)=>{
        if(!req.user || !allowedRoles.includes(req.user.role)){
          return  res.status(403).json({message:"not allowed access"})
        }
        next();
    }
}
module.exports = autohrizedRoles;
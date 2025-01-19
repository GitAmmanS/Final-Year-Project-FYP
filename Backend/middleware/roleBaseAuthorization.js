const autohrizedRoles =(...allowedRoles)=>{
    return (req,res,next)=>{
        if(!allowedRoles.includes(req.user.role)){
            res.status(403).json({message:"not allowed access"})
        }
        next();
    }
}
module.exports = autohrizedRoles;
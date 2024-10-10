const room = require('../models/room')

exports.postRoom = async (req,res)=>{
    try{
    const data = new room({
        ...req.body
    })
    await data.save();
    res.status(200).send("Inserted room successfully")
    }
    catch(err){
        res.status(500).send('Not Inserted room '+err.message);
    }
}
exports.getRoom = async (req,res)=>{
    try{
   const data = await room.find();
   if(data){
    res.status(200).json({
        success:true,
        data:data
    })
}
    else{
        res.status(500).json({
            success:false,
            data:"room not found"
        })
    }
 
    }
    catch(err){
        res.status(500).send('Not found room '+err.message);
    }
}
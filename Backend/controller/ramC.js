const ram = require('../models/ram')

exports.postRam = async (req,res)=>{
    try{
    const data = new ram({
        ...req.body
    })
    await data.save();
    res.status(200).send("Inserted ram successfully")
    }
    catch(err){
        res.status(500).send('Not Inserted ram '+err.message);
    }
}
exports.getRam = async (req,res)=>{
    try{
    const data = await ram.find().populate('capacity').populate('type').populate('status');
    if(data){
        res.status(200).json({
            success:true,
            data:data
        })
    }
    else{
        res.status(500).json({
            success:false,
            data:'no Data found'
        })
    }
    }
    catch(err){
        res.status(500).send('No ram '+err.message);
    }
}
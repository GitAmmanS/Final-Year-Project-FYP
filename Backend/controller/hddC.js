const hdd = require('../models/hdd')

exports.postHdd = async (req,res)=>{
    try{
    const data = new hdd({
        ...req.body
    })
    await data.save();
    res.status(200).send("Inserted hdd successfully")
    }
    catch(err){
        res.status(500).send('Not Inserted hdd '+err.message);
    }
}
exports.getHdd = async (req,res)=>{
    try{
    const data = await hdd.find().populate('capacity').populate('type').populate('status');
    if(data){
        res.status(200).send({
            success:true,
            data:data
        })
    }
    else{
        res.status(500).send({
            success:false,
            data:'no Data found'
        })
    }
    }
    catch(err){
        res.status(500).send('No hdd '+err.message);
    }
}
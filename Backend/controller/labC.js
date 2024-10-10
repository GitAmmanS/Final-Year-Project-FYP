const lab = require('../models/lab')

exports.postLab = async (req,res)=>{
    try{
    const data = new lab({
        ...req.body
    })
    await data.save();
    res.status(200).send("Inserted lab successfully")
    }
    catch(err){
        res.status(500).send('Not Inserted lab '+err.message);
    }
}
exports.getLab = async (req,res)=>{
    try{
    const data = await lab.find();
    if (data) {
        res.status(200).send({
            success: true,
            data: data
        });
    } else {
        res.status(404).send({
            success: false,
            data: "lab not found"
        });
    }
}
    catch(err){
        res.status(500).send('Not found lab '+err.message);
    }
}
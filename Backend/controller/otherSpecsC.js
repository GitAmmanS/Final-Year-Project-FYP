const otherSpecs = require('../models/otherSpecs')

exports.postOtherSpecs= async (req,res)=>{
    try{
    const data = new otherSpecs({
        ...req.body
    })
    await data.save();
    res.status(200).send("Inserted  otherSpecs successfully")
    }
    catch(err){
        res.status(500).send('Not Inserted otherSpecs '+err.message);
    }
}
exports.getOtherSpecs = async (req,res)=>{
    try{
    const data = await otherSpecs.find();
    if (data) {
        res.status(200).send({
            success: true,
            data: data
        });
    } else {
        res.status(404).send({
            success: false,
            data: "otherSpecs not found"
        });
    }
}
    catch(err){
        res.status(500).send('Not found otherSpecs '+err.message);
    }
}
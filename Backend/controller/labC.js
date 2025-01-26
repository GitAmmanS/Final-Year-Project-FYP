const lab = require('../models/lab')
const User = require('../models/users')
exports.postLab = async (req,res)=>{
    try{
        const InchargeName = req.body.incharge;
        const user = await User.findOne({name:InchargeName})
        if(!user){
            return res.status(500).json({success:false , message:err.message})
        }
        const userId = user._id;
    const data = new lab({
        incharge:userId,
        number:req.body.number,
        type:req.body.type,
        status:req.body.status
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
    const data = await lab.find().populate('incharge');
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
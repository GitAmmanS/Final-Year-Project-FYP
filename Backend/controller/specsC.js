const specs = require('../models/specs')

exports.getSpecs = async (req,res)=>{
    try{
    const data = new specs({
        ...req.body
    })
    await data.save();
    res.status(200).send("Inserted specs successfully")
    }
    catch(err){
        res.status(500).send('Not Inserted Specs '+err.message);
    }
}
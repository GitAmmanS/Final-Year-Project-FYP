const os = require('../models/OS')

exports.postOs= async (req,res)=>{
    try{
    const data = new os({
        ...req.body
    })
    await data.save();
    res.status(200).send("Inserted Os successfully")
    }
    catch(err){
        res.status(500).send('Not Inserted os '+err.message);
    }
}
exports.getOs = async (req,res)=>{
    try{
    const data = await os.find();
    if (data) {
        res.status(200).send({
            success: true,
            data: data
        });
    } else {
        res.status(404).send({
            success: false,
            data: "os not found"
        });
    }
}
    catch(err){
        res.status(500).send('Not found os '+err.message);
    }
}
const cpu = require('../models/cpu')

exports.postCpu= async (req,res)=>{
    try{
    const data = new cpu({
        ...req.body
    })
    await data.save();
    res.status(200).send("Inserted Cpu successfully")
    }
    catch(err){
        res.status(500).send('Not Inserted Cpu '+err.message);
    }
}
exports.getCpu = async (req,res)=>{
    try{
    const data = await cpu.find();
    if (data) {
        res.status(200).send({
            success: true,
            data: data
        });
    } else {
        res.status(404).send({
            success: false,
            data: "cpu not found"
        });
    }
}
    catch(err){
        res.status(500).send('Not found cpu '+err.message);
    }
}
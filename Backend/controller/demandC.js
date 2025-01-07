const Demand = require('../models/demand')

exports.postDemand = async (req, res) => {
    try {
        const data = new Demand({
            ...req.body
        })
        await data.save();
        res.status(200).send("Inserted Demand successfully")
    }
    catch (err) {
        res.status(500).send('Not Inserted Demand ' + err.message);
    }
}
exports.getDemand = async (req, res) => {
    try {
        const data = await Demand.find().populate('requester').populate('product_Id');
        if (data) {
            res.status(200).send({
                success: true,
                data: data
            });
        } else {
            res.status(404).send({
                success: false,
                data: "demand not found"
            });
        }
    }
    catch (err) {
        res.status(500).send('Not found demand ' + err.message);
    }
}
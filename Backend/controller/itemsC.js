const items= require("../models/items");

exports.itemsget=async (req, resp) => {

    const data = await items.find({ name: {$regex:new RegExp(req.params.items_name,"i")} }); //i->ignore all cases
    if (data.length !== 0) {
        resp.send({
                success: true,
                message: data
        });
        
    } else {
        resp.send("items not found");
    }
};
exports.itemsupdate=async (req, resp) => {

    const data = await items.updateOne({ name: req.params.items_name },{$set:req.body}); //i->ignore all cases{
        if (data.matchedCount === 0) {
            resp.send({
                success: false,
                message: data.matchedCount
            });
        } else {
            resp.send({
                success: true,
                message: data.matchedCount
            });
        }
};
exports.itemsdelete=async (req, resp) => {

    const data = await items.deleteOne({ name: req.params.items_name }); //i->ignore all cases{
        if (data.deletedCount === 0) {
            resp.send({
                success: false,
                message: data.deletedCount
            });
        } else {
            resp.send({
                success: true,
                message: data.deletedCount
            });
        }
};


exports.itemspost=async (req, resp) => {
    const data = new items(req.body);
    const res = await data.save();
    if(res===true){
        resp.send(
            {success:true,
             message:1 
            }
            
        );
    }
    else{
        resp.send(
            {success:true,
             message:0
            }
            
        );
    }
    
};
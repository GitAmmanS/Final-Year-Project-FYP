const { response } = require("express");
const users=require("../models/users");
const nodemailer=require("nodemailer")
const dotenv= require("dotenv");
dotenv.config();
exports.userspost = async (req, resp) => {
    try {
        const data = new users(req.body); 
        await data.save();
        sendVerifyMail(req.body.name,req.body.email,data._id);
        // console.log(req.body.name,req.body.email,data._id);
        resp.status(200).send("Inserted successfully"); 
    } catch (error) {
        console.error('Error in the post:', error); 
        resp.status(500).send("Error in the post"); 
    }
};

//for mail sending
const sendVerifyMail = async (name, email, user_id)=>{
    try{
      const transporter =  nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:'465',
            secure: true, //true for ssl and port 465
            auth:{
                user:process.env.EMAIL,
                pass:process.env.PASSWORD
            }
            
        });
        const mailOptions ={
            from : 'ammansajjad42@gmail.com',
            to   : email,
            subject : 'For Verification ',
            html: `
                <p>Hi ${name},</p>
                <p>Click here to <a href="http://localhost:2000/users/verify?id=${user_id}"><b>Verify</b></a> your email.</p>
            `
        }
        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error);
            }
            else{
                console.log("Email has been sent Successfully",info.response);
            }
        })
    }catch(error){
        console.log(error.message);
    }
}
 exports.verifyMail = async(req,res)=>{
    try{
        const updateVerify=await users.updateOne({_id:req.query.id},{$set :{is_verified:true}});
        console.log("updated res",updateVerify);
        res.status(200).send("Email Verified. Go to Login");
    }catch(error){
        res.send("not ok");
    }
}
exports.usersupdate=async (req, resp) => {

    const data = await users.updateOne({ name: req.params.users_name },{$set:req.body}); //i->ignore all cases{
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

exports.usersdelete=async (req, resp) => {
    try {
        const data = await users.deleteMany({email:req.params.email});
        console.log("data",data.deletedCount);
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
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
}
exports.usersTableget=async (req, resp) => {
    try {
        const data = await users.find({}).populate('role_ID').populate('rank_ID');
        console.log(data);
        if (data.length != 0) {
            resp.send({
                success: true,
                message: data
            });
        } else {
            resp.send({
                success: false,
                message: "No User Found"
            });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};
exports.usersUserget=async (req, resp) => {
    try {
        const data = await users.find({role:"user"});
        console.log(data);
        if (data.length != 0) {
            resp.send({
                success: true,
                message: data
            });
        } else {
            resp.send({
                success: false,
                message: "No User Found"
            });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};
exports.usersSingleget=async (req, resp) => {
    try {
        const data = await users.find({email: req.params.email}).populate('rank_ID').populate('role_ID');
        console.log(data);
        if (data.length != 0) {
            resp.send({
                success: true,
                message: data
            });
        } else {
            resp.send({
                success: false,
                message: "No User Found"
            });
        }
    } catch (error) {
        console.error(error);
        resp.status(500).send("Internal Server Error");
    }
};
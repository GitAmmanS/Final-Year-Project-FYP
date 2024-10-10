const mongoose=require("mongoose");
try{
mongoose.connect(process.env.MONGODB_URL).then((res)=>{
    console.log("Connected to MongoDB")
}).catch((err)=>{
    console.log("Error Connecting MongoDB",err)
});}
catch(err){
    console.log(err);
}
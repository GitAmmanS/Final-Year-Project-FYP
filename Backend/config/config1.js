const mongoose=require("mongoose");
mongoose.connect(process.env.MONGOURL).then((res)=>{
    console.log("Connected to MongoDB")
}).catch((err)=>{
    console.log("Error Connecting MongoDB")
});
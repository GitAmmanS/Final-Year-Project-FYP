const mongoose=require('mongoose')

const items = mongoose.Schema({
    name:{type:String , required:true},
    category_ID:{type:mongoose.Schema.Types.ObjectId ,ref :"category",required:true},
    company_ID:{type:mongoose.Schema.Types.ObjectId ,ref :"company",required:true},
    picture:{type:String },
    quantity:{type:Number},
    serialNumber:{type:String},
    qrCode:{type:String},
    specs:{
        cpu: { type: mongoose.Schema.Types.ObjectId , ref : "cpu" },
        ram: [{type : mongoose.Schema.Types.ObjectId , ref : "ram"}],
        hdd: [{type : mongoose.Schema.Types.ObjectId , ref : "hdd"}],
        os: { type: mongoose.Schema.Types.ObjectId , ref : "os" },
        otherspecs:{type:mongoose.Schema.Types.ObjectId , ref : "otherSpecs"}
     },
    installDate:{type:Date},
    labId:{type:mongoose.Schema.Types.ObjectId,ref:'labs'},
    roomId:{type:mongoose.Schema.Types.ObjectId,ref:'rooms'},
    status_ID:{type:mongoose.Schema.Types.ObjectId ,ref :"status",required:true},
})

module.exports=mongoose.model("items",items);
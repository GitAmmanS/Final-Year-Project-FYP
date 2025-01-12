const mongoose=require('mongoose')

const Products = mongoose.Schema({
    name:{type:String , required:true},
    category_ID:{type:mongoose.Schema.Types.ObjectId ,ref :"category",required:true},
    company_ID:{type:mongoose.Schema.Types.ObjectId ,ref :"company",required:true},
    picture:{type:String },
    specs:{
        cpu: { type: mongoose.Schema.Types.ObjectId , ref : "cpu" },
        ram: [{type : mongoose.Schema.Types.ObjectId , ref : "ram"}],
        hdd: [{type : mongoose.Schema.Types.ObjectId , ref : "hdd"}],
        os: { type: mongoose.Schema.Types.ObjectId , ref : "os" },
        otherspecs:{type : String}
     },
     model:{type:String,required : true}
},{timestamps:true})

module.exports=mongoose.model("products",Products);
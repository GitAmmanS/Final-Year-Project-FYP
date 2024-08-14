
const express = require("express");
const cors=require("cors");
const bodyparser=require("body-parser");
const dotenv= require("dotenv");
dotenv.config();
require("./config/config1");

const usersR = require("./routes/usersR");
const GCTypeR = require("./routes/GCTypeR");
const OSR = require("./routes/OSR");
const cableTypeR = require("./routes/cableTypeR");
const categoryR = require("./routes/categoryR");
const companyR = require("./routes/companyR");
const floorR = require("./routes/floorR");
const generationR = require("./routes/generationR");
const graphicCardR = require("./routes/graphicCardR");
const itemsR = require("./routes/itemsR");
const locationR = require("./routes/locationR");
const lostItemsR = require("./routes/lostItemsR");
const ramR = require("./routes/ramR");
const ramTypeR = require("./routes/ramTypeR");
const rankR = require("./routes/rankR");
const repairItemsR = require("./routes/repairItemsR");
const roleR = require("./routes/roleR");
const romR = require("./routes/romR");
const romTypeR = require("./routes/romTypeR");
const softwaresR = require("./routes/softwaresR");
const spexR = require("./routes/spexR");
const statusR = require("./routes/statusR");


const app = express();

app.use(cors());
// Serve static files from the 'Pictures' directory
app.use(express.static('./public'));
app.use(bodyparser.json());



app.use("/category", categoryR); 
app.use("/GCType", GCTypeR); 
app.use("/OS", OSR); 
app.use("/cableType", cableTypeR); 
app.use("/company", companyR); 
app.use("/floor", floorR); 
app.use("/generation", generationR); 
app.use("/graphicCard", graphicCardR); 
app.use("/items", itemsR); 
app.use("/location", locationR); 
app.use("/lostItems", lostItemsR); 
app.use("/ram", ramR); 
app.use("/ramType", ramTypeR); 
app.use("/rank", rankR); 
app.use("/repairItems", repairItemsR); 
app.use("/role", roleR); 
app.use("/rom", romR); 
app.use("/romType", romTypeR); 
app.use("/softwares", softwaresR); 
app.use("/spex", spexR); 
app.use("/status", statusR); 
app.use("/users", usersR);


const port=process.env.PORT;
app.listen(port,()=>{
    console.log(`service running on port ${port}`);
})
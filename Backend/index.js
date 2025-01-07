const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require('path');
const cookieParser = require('cookie-parser');
dotenv.config();

require("./config/config1");

// const usersR = require("./routes/usersR");
const productR = require("./routes/productR");
const categoryR = require("./routes/categoryR");
const companyR = require("./routes/companyR");
const storeR = require("./routes/storeR");
const statusR = require("./routes/statusR");
const ProductStoreR = require("./routes/productStoreR");
// const rankR = require("./routes/rankR");
// const roleR = require("./routes/roleR");
// const specsR = require("./routes/specsR");
const ramR = require("./routes/ramR");
const hddR = require("./routes/hddR");
// const roomR = require("./routes/roomR");
const labR = require("./routes/labR");
const demandR = require("./routes/demandR");
const productStore = require("./models/productStore");
// const osR = require("./routes/osR");
// const otherSpecsR = require("./routes/otherSpecsR");
// const cpuR = require("./routes/cpuR");
// const ramHddOptions = require('./routes/ramAndHddR');

const app = express();


app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname,'public'))); 
app.use(cookieParser());

// app.use("/users", usersR);
app.use("/product", productR);
app.use("/category", categoryR);
app.use("/company", companyR);
app.use("/store",storeR);
app.use("/status", statusR);
app.use("/productstore", ProductStoreR);
// app.use("/rank", rankR);
// app.use("/role", roleR);
// app.use("/specs", specsR); 
app.use("/ram", ramR); 
app.use("/hdd", hddR); 
app.use("/lab", labR); 
app.use("/demand", demandR); 
app.use("/productstore", productStore); 
// app.use("/room", roomR); 
// app.use("/os", osR); 
// app.use("/cpu", cpuR); 
// app.use("/otherspecs", otherSpecsR); 
// app.use('/ramAndHddOptions', ramHddOptions);


const port = process.env.PORT || 5000; 
app.listen(port, () => {
    console.log(`Service running on port ${port}`);
});

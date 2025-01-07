const express = require('express');
const Router = express.Router();

const productStoreC = require('../controller/productStoreC');

Router.get('/',productStoreC.getProductStore);
Router.post('/post',productStoreC.postProductStore);
Router.put('/update/:productstore_id',productStoreC.updateProductStore);
Router.delete('/delete/:productstore_id',productStoreC.deleteProductStore);


module.exports = Router;

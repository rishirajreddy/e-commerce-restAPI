const mongoose = require('mongoose');
const {format} = require("date-fns");

const Product = mongoose.Schema({
    name: {
        type:String,
        required:true
    },
    price:{
        type:Number
    },
    createdAt: {
        type:String,
        default: format(new Date(), "dd-MM-yyyy HH:mm:ss") 
    },
    updatedAt: {
        type:String
    }
})


module.exports = mongoose.model("product", Product);
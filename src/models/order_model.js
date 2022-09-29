const { format } = require('date-fns');
const mongoose = require('mongoose');

const Order = mongoose.Schema({
    client:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },
    products:[
        {
            product: {
                type:mongoose.Schema.Types.ObjectId,
                ref: "product"
            },
            qty: Number,
            bookedAt:{
                type:String,
                default: format(new Date(), "dd-mm-yyyy HH:mm:ss")
            }
        }
    ],
})

module.exports = mongoose.model("order", Order);
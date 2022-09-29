const Product = require("../models/product_model");
const Order = require("../models/order_model");
const User = require("../models/user_model");

const {format} = require("date-fns");

exports.getAllOrders  = async(req,res) => {
    Order.find()
        .select('_id client products createdAt')
        .populate('client', 'username')
        .populate('products.product')   
        .exec()
        .then(orders => {
            res.status(200).json({orders:orders})
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getClientOrders = async(req,res) => {
    const user = await User.findOne({username:req.decoded.username});
    const userId = user.get("_id").toString();

    const isClient = checkClient(userId);
    isClient.then((data) => {
        if(!data){
            res.status(404).json("No orders for the particular client")
        }else {
            Order.findOne({client:userId})
                .populate('client','username')
                .populate('products.product')
                .exec()
                .then((orders) => {
                    res.status(200).json({orders:orders, count:orders.products.length})
                })
                .catch(err => {
                    console.log(err);
                })
        }
    })
    .catch(err => {
        console.log(err);
    })
}


exports.placeOrder  = async(req,res) => {

    const user = await User.findOne({username:req.decoded.username});
    const userId = user.get("_id").toString();

    Product.findOne({_id:req.params.id})
        .then(async(result) => {
            if(!result){
                return res.status(404).send("No product available with the given id");
            }else {
                let isClient = checkClient(userId);
                isClient.then(async(data) => {
                    if(!data){
                        const products = {
                            product: req.params.id,
                            qty:req.body.qty
                        }
                        const newOrder = new Order({
                            client: userId,
                            products: products,
                            bookedAt:format(new Date(), "dd-mm-yyyy HH:mm:ss")
                        })
                        await newOrder.save()
                            .then((order) => {
                                res.status(200).json({order:order})
                            })  
                            .catch(err => {
                                console.log(err);
                            })
                    }
                    else {
                        Order.updateOne(
                            {client:userId},
                            {
                                $addToSet: {
                                    products: {
                                        product: req.params.id,
                                        qty: req.body.qty,
                                        bookedAt:format(new Date(), "dd-MM-yyyy HH:mm:ss")
                                    }
                                }
                            },
                        )
                        .then((data) => {
                            if(data.modifiedCount === 1){
                                res.status(200).json(`Product saved successfully to username ${req.decoded.username}`)
                            }
                        })
                        .catch(err => {
                            console.log(err);
                        })
                    }
                })
            }
        })
        .catch(err => {
            console.log(err);
        })
}

exports.deleteOrder = async(req,res) => {
    const user = await User.findOne({username:req.decoded.username});
    const userId = user.get("_id").toString();
    const productId = req.body.productId;

    Order.findOne({client: userId})
        .then((data) => {
            data.products = data.products.filter(product => {
                return product.product.toString() !== productId
            })
            data.save()
                .then(result => {
                    res.status(200).send(`Order with id ${productId} deleted`)
                })
                .catch(err => {
                    res.send(err.message)
                })
        })
        .catch(err => {
            res.send(err.message)
        })
}

async function checkClient(userId){
    const client = await Order.findOne({client:userId})
    return client;
}
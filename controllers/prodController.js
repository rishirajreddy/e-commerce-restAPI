const { format } = require('date-fns');
const Product = require('../models/product_model');

exports.createProduct = async(req,res) => {
    const {name, price} =  req.body;
    Product.findOne({name: name})
        .then(async(data) => {
            if(data){
                return res.send("Product already exists");
            }else {
                const newProduct = await Product({
                    name,
                    price
                }) 
                await newProduct.save()
                    .then((result) => {
                        res.status(200).send(result);   
                        console.log("Product saved");
                    }).catch((err) => {
                        console.log(err);
                    });
            }
        })
}

exports.getAllProducts = async(req,res) => {
    Product.find()
        .exec()
        .then((products) => {
            res.status(200).json({products: products, count:products.length})
        })
        .catch(err => {
            console.log(err)
        })
}

exports.getProduct = async(req,res) => {
    await Product.findOne({_id:req.params.id})
        .then((product) => {
            if(!product){
                res.status(404).send("No product exists with the given id")
            }else {
                res.status(200).json({product:product})
            }
        })
        .catch(err => {
            res.send(err.message);
        })
}

exports.updateProduct = async(req,res) => {
     Product.updateOne({_id:req.params.id}, 
        {
            $set: {
                name:req.body.name,
                price:req.body.price,
                updatedAt: format(new Date(), "dd-MM-yyyy HH:mm:ss")
            },
        },
        {multi: true},
        (err, data) => {
        if(err){
            console.log(err);
        }else {
            res.status(200).json(data)
        }
    })
}
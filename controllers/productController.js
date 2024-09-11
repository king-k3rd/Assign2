const { validateProduct } = require('../validators');
const Product = require("../models/product");
const cloudinary = require('../config/cloudinary');

exports.createProduct = async (req, res)=>{
    try{
        const {error}= validateProduct(req.body)
        if (error) res.json(error.details[0].message);

        if (!req.files || req.files.lenght ===0) {
            return res.status(400).json({message: "no images uploaded"});
        }

        const images = [];
    for (const file of req.files) {
      try {
        const result = await cloudinary.uploader.upload(`data:${file.mimetype};base64,${file.buffer.toString('base64')}`);
        images.push({ img: result.secure_url });
      } catch (uploadError) {
        console.error("Image upload error:", uploadError);
        return res.status(500).json({ message: "Image upload failed", error: uploadError.message });
      }
    } 
            const product= new Product({
            category: req.body.category,
            name: req.body.name,
            description: req.body.description,
            images: images,
            price: req.body.price,
            topSelling: req.body.topSelling,
            featured: req.body.featured,
        })

        const new_product_data = await product.save();
        res.json(new_product_data);
    } catch (error){
        console.log({message: error.message})
        
    }

    //     const product= new Product({
    //         category: req.body.category,
    //         name: req.body.name,
    //         description: req.body.description,
    //         images: images,
    //         price: req.body.price,
    //         topSelling: req.body.topSelling,
    //         featured: req.body.featured,
    //     })

    //     const new_product_data = await product.save();
    //     res.json(new_product_data);
    // } catch (error){
    //     console.log({message: error.message})
        
    // }
}

exports.getAllProduct = async (req, res) => {
    const products = await Product.find().populate("category")
    res.json(products)
}
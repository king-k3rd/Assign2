const Cart = require("../models/cart");
const Product = require("../models/product");


exports.addToCart = async(req, res) => {
    const { productId, quantity} = req.body;
    try {
        let cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
       
            cart = new Cart({ user: req.user.id, products:[]})
        }

        const product = await Product.findById(productId);
        if  (!product) {
            return res.status(400).json ({ message: "Product Not Found!..."})
        }
        const productIndex = cart.products.findIndex(item => item.product.toString() === productId);

if (productIndex !== -1) {
    cart.products[productIndex].quantity += quantity;
    cart.products[productIndex].amount = product.price * cart.products[productIndex].quantity;
} else {
    cart.products.push({
        product: productId,
        quantity: quantity,
        amount: product.price * quantity
    });
}
await cart.save();
res.json(cart);


    } catch (error) {
        console.log({ message: error.message });
        res.status(500).json({ message: "Server error" });
    }
}
exports.getCart = async (req, res) => {
    try{
        const cart = await Cart.find({ user: req.user.id }).populate("products.product");
        if(!cart){
            return res.status(400).json({ message: "Cart doesn't exist" });
        }
        res.json(cart)
    } catch (error){
        console.log({ message: error.message });
        res.status(500).json({ message: "Server error" });
        
    }
    
}
exports.updateCart = async ( req, res ) => {
    try{
        const cart = await Cart.findOne({ user: req.user.id});
        const product = await product.findById(productId);
        if (!product) return res.status(400).json({ message: "product is not found"})
        if(!cart) {
            return res.status(400).json({message: "Cart not found!.."})
        }

        const cartItem = cart.products.find(items=> items.product.toString() === productId )

        if(cartItem){
            cartItem.quantity = quantity
            cartItem.amount = product.price * cartItem.quantity
            await cart.save()

            const updateCart = await Cart.findOne({user: req.user.id}).populate("products.product")
            res.json(updateCart)
        
        }else{
            console.log({ message: error.message });
            res.status(500).json({ message: "Server error" });
        }

    }catch (error){
        console.log({ message: error.message });
        res.status(500).json({ message: "Server error" });
    }
}

exports.deleteCartItem = async (req, res) => {
    const { productId } = req.body;
    try {
        const cart = await Cart.findOne({ user: req.user.id })
        const product = await Product.findById(productId)
        if (!product) return res.status(400).json({ message: "product is not found" })
            if (!cart) {
                cart.products = cart.product.filter(items => items.product.toString() !==  productId)
                await cart.save();

                const updateCart = await Cart.findOne({ user: req.user.id }).populate("products.product")
                res.json(updateCart)
            }else{
                return res.status(400).json({ message: "Cart not found"})
            }
    } catch (error) {
        console.log({ message: error.message });
        
    }
}


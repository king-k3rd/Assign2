const Cart = require("../models/cart");
const Order = require("../models/order");
const {v4:uuidv4} = require("uuid");
const dotenv = require("dotenv");

dotenv.config();


const FLW_SECRET_KEY = process.env.FLW_SECRET_KEY;

exports.initialPayment = async (req, res) => {
    const {user} = req;
    const{ amount, currency, firstName, lastName, email, address, phone } = req.body;

    try {
        const cart = await Cart.findOne({ user: user.id })
        if (!cart || cart.products.length === 0)(
            res.json("Cart not found")
        )

        const orderId = uuidv4();
        const paymentData = {
            tx_ref: orderId,
            amount,
            currency,
            redirect_url:'http://localhost:5173/thankyou',
            customer:{
                email: `${user.email}`,
                name: `${user.firstName} ${user.lastName}`,
                phonenumber:phone
                
            },
            meta: { 
                firstName,
                lastName,
                email,
                phone,
                address,
            },
            customizations:{
                title: "MUSE-UP TEX",
                description: "Payment for cart Items"
            }
        }

        const response = await fetch("https://api.flutterwave.com/v3/payments", {
            method:"POST",
            headers:{
                Authorization: `Bearer ${FLW_SECRET_KEY} `,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        });
        const data = await response.json();
        if (data.status === "success"){
            res.json({ data: data.data.link, orderId})
        }else{
            res.json("payment failed")
        }
    } catch (error) {
        console.log({message: error.message });
    }
}

exports.verifyPayment = async (req, res ) => {
    const { transaction_id, orderId} = req.body;
    
    try{
        const response = await fetch(`http://api.flutterwave.com/v3/transactions/${transaction_id}/verify`,{
            method: "GET",
            headers: {
                Authorization:`Bearer ${FLW_SECRET_KEY}`,
            }
        })
        const data = await response.json();
        if (data.status === "success"){
            const cart = await Cart.findOne({ user: req.user.id}).populate("products.product");
            if(!cart || cart.products.lenght === 0) {
                res.json("cart not found")
            }

            const order = new Order ({
                user: req.user.id,
                orderId,
                firstName: data.data.meta.firstName,
                lastName: data.data.meta.lastName,
                email: data.data.meta.phone,
                adress: data.data.meta.address,
                status:"complete",
                transactionId: transaction_id,
                amount: data.amount,
                quantity: data.quantity,
            })

            await order.save()
            await Cart.findOneAndDelete({user: req.user.id})
            res.json({ message: "payment successfull", order})
        }else{
            res.json({message: "payment failed"})
        }
    } catch (error) {
        console.log({ message: error.message })
    }
}
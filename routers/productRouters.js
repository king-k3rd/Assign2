const express = require('express');
const productController = require('../controllers/productController');
const multer = require('multer');
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// const storage = multer.diskStorage({
//     destination: (req, res, cb)=> {
//         cb(null, "upload/")
//     },
//     filename: (req, file, cb) => {
//         cb(null, file.originalname)
//     }
// })

// const upload = multer({ storage: storage })

router.post("/api/product",upload.array("img", 10), productController.createProduct)
router.get("/api/product", productController.getAllProduct)

module.exports = router;
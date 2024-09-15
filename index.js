const express = require("express");
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require("./db/User");

const cors = require("cors");
const Product = require("./db/Product");
require("./db/config");

const app = express();
app.use(express.json());
app.use(cors());

const port = 5000;





app.post("/register", async (req, res) => {
    try {
        let user = new User(req.body);
        let result = await user.save();
        result = result.toObject();
        delete result.password
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: 'Server error' });
    }
});

// app.post('/login', async (req, res) => {
//     try {
//         let user = await User.findOne(req.body).select("-password"); // Use await with findOne
//         if (user) {
//             console.log(user,"user")
//             // Remove circular references manually if needed or construct a new response object
//             res.send({ id:user._id, name: user.name, email: user.email });
//         } else {
//             res.status(404).send("User not found, please sign up");
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Internal Server Error");
//     }
// });


app.post('/login', async (req, res) => {
    try {
        let user = await User.findOne({ name: req.body.name, password: req.body.password }).select("-password");
        if (user) {
            const isAdmin = user.name === 'admin' && req.body.password === 'admin';
            res.send({ id: user._id, name: user.name, email: user.email, isAdmin });
        } else {
            res.status(404).send("User not found, please sign up");
        }
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



// Serve static files from the "uploads" directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



const uploadDir = path.join(__dirname, 'uploads');
console.log(uploadDir,"........uploadDir")
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}



// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // Use the directory we just created or verified
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename with timestamp
    }
});

const upload = multer({ storage });

app.post('/addProduct', upload.single('image'), async (req, res) => {
    const { name, price, category, company, userId } = req.body;
    
    console.log(req.body, "...req.body"); // Debugging
    console.log(req.file.path ,"...req.file.path ")
    const image = req.file ? req.file.path : null; // Get the image path from multer
    const categories = category.split(',').map(cat => cat.trim());
    let product = new Product({
        name,
        price,
        categories,
        company,
        userId,
        image // Add the image field
    });

    try {
        let result = await product.save();
        res.send(result);
    } catch (error) {
        res.status(500).send({ error: 'Error saving product' });
    }
});

app.get('/products/category/:category', async (req, res) => {
    const { category } = req.params;
    try {
        const products = await Product.find({ category });
        if (products.length > 0) {
            res.send(products);
        } else {
            res.status(404).send({ message: 'No products found in this category' });
        }
    } catch (error) {
        res.status(500).send({ error: 'Error fetching products by category' });
    }
});


app.get("/productList",async (req,res)=>
{
    let products=await Product.find();
    if(products.length>0)
    {
        res.send(products);
    }else
    {
        res.send({result:"no products found"})
    }
})





app.delete("/product/:id", async (req, res) => {
    const { id } = req.params;
    
    // Check if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ error: "Invalid product ID" });
    }

    try {
        const result = await Product.deleteOne({ _id: id });

        if (result.deletedCount === 0) {
            return res.status(404).send({ error: "Product not found" });
        }

        res.send(result);
    } catch (error) {
        res.status(500).send({ error: "An error occurred while deleting the product" });
    }
});








app.get('/product/:id', async (req, res) => {
    const { id } = req.params; // Correctly destructure id

    console.log(id); // Should correctly log the id

    // Check if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ error: 'Invalid product ID' });
    }

    try {
        let result = await Product.findById(id); // Use findById for better readability
        console.log('result ', result);
        if (result) {
            res.send(result);
        } else {
            res.status(404).send({ result: 'Product not found' });
        }
    } catch (error) {
        res.status(500).send({ error: 'An error occurred while retrieving the product' });
    }
});


app.put('/product/:id', upload.single('image'), async (req, res) => {
    console.log("Update product request received");

    try {
        const { name, price, category, company, userId } = req.body;

        // Check if categories are provided and split them into an array
        const categories = category ? category.split(',').map(cat => cat.trim()) : undefined;

        // Check if an image is uploaded
        const image = req.file ? req.file.path : undefined;

        // Build the update object dynamically
        const updateFields = {
            ...(name && { name }),
            ...(price && { price }),
            ...(categories && { categories }),
            ...(company && { company }),
            ...(userId && { userId }),
            ...(image && { image })
        };

        const updatedProduct = await Product.findByIdAndUpdate(
            req.params.id,
            updateFields,
            { new: true } // Return the updated document
        );

        if (!updatedProduct) {
            return res.status(404).send({ error: "Product not found" });
        }

        res.status(200).send(updatedProduct);
    } catch (error) {
        console.error("Error updating product:", error);
        res.status(500).send({ error: 'Error updating product' });
    }
});



app.get("/search/:key", async (req, res) => {
    let result = await Product.find({
        "$or": [
            { name: { $regex: req.params.key, $options: "i" } },
            { company: { $regex: req.params.key, $options: "i" } },
            { category: { $regex: req.params.key, $options: "i" } }
        ]
    });

    if (result) {
        res.json(result);
    } else {
        res.status(404).json({ message: "No products found" });
    }
});



/* like  */

app.post('/product/:id/like', async (req, res) => {
    const { id } = req.params;
    console.log(req.params)

    // Check if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ error: 'Invalid product ID' });
    }

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }

        product.likes += 1;
        await product.save();

        res.send({ likes: product.likes });
    } catch (error) {
        res.status(500).send({ error: 'Error liking product' });
    }
});



/****************** comment  */

app.post('/product/:id/comment', async (req, res) => {
    const { id } = req.params;
    const { username, comment } = req.body;

    // Check if the id is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send({ error: 'Invalid product ID' });
    }

    try {
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).send({ error: 'Product not found' });
        }

        product.comments.push({ username, comment });
        await product.save();

        res.send(product.comments);
    } catch (error) {
        res.status(500).send({ error: 'Error commenting on product' });
    }
});


/************* */

app.post("/product/:id/addCategory", upload.single('image'), async (req, res) => {
    try {
        const productId = req.params.id;
        const { category, price, quality } = req.body;
        const image = req.file ? req.file.path : null;

        // Find the product by ID and update it
        const product = await Product.findById(productId);

        if (product) {
            // Add the new category with additional details
            const newCategoryDetails = { category, price, quality, image };
            product.categories.push(newCategoryDetails);
            await product.save();
            res.status(200).send({ message: "Category and details added successfully", product });
        } else {
            res.status(404).send({ message: "Product not found" });
        }
    } catch (error) {
        res.status(500).send({ message: "Server error", error });
    }
});












app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

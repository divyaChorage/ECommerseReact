const express = require("express");
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const User = require("./db/User");
const Order = require("./db/Order");


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
    const { name, price,  company, userId } = req.body;
    
    console.log(req.body, "...req.body"); // Debugging
    console.log(req.file.path ,"...req.file.path ")
    const image = req.file ? req.file.path : null; // Get the image path from multer
   
    let product = new Product({
        name,
        price,
       
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
        const { name, price, company, userId } = req.body;

        // Check if categories are provided and split them into an array

        // Check if an image is uploaded
        const image = req.file ? req.file.path : undefined;

        // Build the update object dynamically
        const updateFields = {
            ...(name && { name }),
            ...(price && { price }),
           
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


/*************     add categoru *********/


// Serve static files from the "uploads" directory
app.use('/uploadCate', express.static(path.join(__dirname, 'uploadCate')));


const uploadDire = path.join(__dirname, 'uploadCate');
console.log(uploadDire,"........uploadDir")
if (!fs.existsSync(uploadDire)) {
    fs.mkdirSync(uploadDire);
}



// Configure multer for file uploads

const categoryStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDire); // Directory for category image uploads
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname); // Unique filename
    }
});
const uploading = multer({ storage: categoryStorage });  // Fix typo: use 'storage', not 'store'


app.post("/product/:id/addCategory", uploading.single('image'), async (req, res) => {
    try {
        const productId = req.params.id;
        const { category, price, quality, description } = req.body;
        const image = req.file ? req.file.path : null;

        const product = await Product.findById(productId);

        if (product) {
            const newCategoryDetails = { category, price, quality, description, image };
            console.log("newCategoryDetails____",newCategoryDetails);
            product.categories.push(newCategoryDetails);
            console.log("   product.categories",   product.categories);
            await product.save();
            res.status(200).send({ message: "Category and details added successfully", product });
        } else {
            res.status(404).send({ message: "Product not found" });
        }
    } catch (error) {
        console.error("Error while adding category:", error);
        res.status(500).send({ message: "Server error", error });
    }
});




app.get("/product/:id/addCategory/AllCatgories", async (req, res) => {
    try {
        const productId = req.params.id;
        console.log(productId, "for getting categories");

        // Find the product by ID and populate its categories
        const product = await Product.findById(productId);

        if (product && product.categories.length > 0) {
            res.send(product.categories);
        } else {
            res.send({ result: "No categories found" });
        }
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).send({ message: "Server error", error });
    }
});



app.delete("/addCategory/:id/AllCategories/:cateId", async (req, res) => {
    const { id, cateId } = req.params;

    // Check if both the product ID and category ID are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(cateId)) {
        return res.status(400).send({ error: "Invalid product or category ID" });
    }

    try {
        // Find the product by its ID
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }

        // Filter out the category with the given cateId from the product's categories array
        product.categories = product.categories.filter(cat => cat._id.toString() !== cateId);

        // Save the updated product
        await product.save();

        res.send({ message: "Category deleted successfully" });
    } catch (error) {
        res.status(500).send({ error: "An error occurred while deleting the category" });
    }
});




app.get('/addCategory/:id/AllCategories/:cateId', async (req, res) => {
    const { id, cateId } = req.params;

    console.log(id, "getting id for update__", cateId);

    // Check if both the product ID and category ID are valid ObjectIds
    if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(cateId)) {
        return res.status(400).send({ error: "Invalid product or category ID" });
    }

    try {
        // Find the product by its ID
        const product = await Product.findById(id);

        console.log("Retrieved product:", product);

        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }

        // Ensure that the product has a categories array
        if (!product.categories || !Array.isArray(product.categories)) {
            return res.status(404).send({ error: "Categories not found in product" });
        }

        console.log("Product categories:", product.categories);

        // Find the specific category in the product's categories array
        const categoryToRetrieve = product.categories.id(cateId);

        console.log(categoryToRetrieve, "categoryToRetrieve"); // Corrected log
        if (!categoryToRetrieve) {
            return res.status(404).send({ error: "Category not found" });
        }

        res.send(categoryToRetrieve);
    } catch (error) {
        console.error("Error retrieving category:", error);
        res.status(500).send({ error: 'An error occurred while retrieving the category' });
    }
});




app.put('/addCategory/:id/AllCategories/:cateId', uploading.single('image'), async (req, res) => {
    console.log("Update category request received");

    try {
        const { id, cateId } = req.params;
        const { category, price, quality, description } = req.body;

        // Check if both the product ID and category ID are valid ObjectIds
        if (!mongoose.Types.ObjectId.isValid(id) || !mongoose.Types.ObjectId.isValid(cateId)) {
            return res.status(400).send({ error: "Invalid product or category ID" });
        }

        // Find the product by its ID
        const product = await Product.findById(id);

        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }

        // Ensure that the product has a categories array
        if (!product.categories || !Array.isArray(product.categories)) {
            return res.status(404).send({ error: "Categories not found in product" });
        }

        // Find the specific category in the product's categories array
        const categoryToUpdate = product.categories.id(cateId);

        if (!categoryToUpdate) {
            return res.status(404).send({ error: "Category not found" });
        }

        // Check if an image is uploaded
        const image = req.file ? `/uploadCate/${req.file.filename}` : categoryToUpdate.image;
        // Update category fields dynamically
        if (category) categoryToUpdate.category = category;
        if (price) categoryToUpdate.price = price;
        if (quality) categoryToUpdate.quality = quality;
        if (description) categoryToUpdate.description = description;
        if (image) categoryToUpdate.image = image;

        // Save the updated product with the modified category
        await product.save();

        // Send back the updated category instead of the whole product
        res.status(200).send(categoryToUpdate);
    } catch (error) {
        console.error("Error updating category:", error);
        res.status(500).send({ error: 'Error updating category' });
    }
});






/************  order  */


app.post('/Allproducts/:productId/AllCateForProduct/:categoryId', async (req, res) => {
  try {
    const {
      productId,
      categoryId,
      categoryName,
      price,
      quality,
      description,
      pincode,
      address,
      todayDate,
      orderWillReachDate,
      otp,
      userId, // Ensure you have the user ID from authentication
    } = req.body;

    // Validate required fields
    if (
      !productId ||
      !categoryId ||
      !categoryName ||
      !price ||
      !quality ||
      !description ||
      !pincode ||
      !address ||
      !orderWillReachDate ||
      !otp ||
      !userId
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Create a new Order document
    const newOrder = new Order({
      productId,
      categoryId,
      categoryName,
      price,
      quality,
      description,
      pincode,
      address,
      todayDate: todayDate ? new Date(todayDate) : new Date(),
      orderWillReachDate: new Date(orderWillReachDate),
      otp,
      userId,
    });

    // Save the order to the database
    const savedOrder = await newOrder.save();

    res.status(201).json({ message: "Order placed successfully", order: savedOrder });
  } catch (error) {
    console.error("Error saving order:", error);
    res.status(500).json({ message: "Server error while saving order" });
  }
});



app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});

const mongoose=require("mongoose");
const productsSchema = new mongoose.Schema({
    name: String,
    price: String,

    userId: String,
    company: String,
    image:String,
    likes: { type: Number, default: 0 },
    categories: [
        {
            category: String,
            price: Number,
            quality: String,
            image: String, // path to image file
        }
    ],
    comments: [
        {
            username: String,
            comment: String,
            timestamp: { type: Date, default: Date.now }
        }
    ]
});



module.exports=mongoose.model("products",productsSchema)

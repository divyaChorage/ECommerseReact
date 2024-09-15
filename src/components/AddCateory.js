import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AddCategory = () => {
    const { id } = useParams(); // Get the product ID from the URL
    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [quality, setQuality] = useState("");
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const handleAddCategory = async () => {
        const formData = new FormData();
        formData.append("category", category);
        formData.append("price", price);
        formData.append("quality", quality);
        if (image) {
            formData.append("image", image);
        }

        try {
            const response = await fetch(`http://localhost:5000/product/${id}/addCategory`, {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log("Category and details added:", result);
                navigate("/productList"); // Navigate back to the product list
            } else {
                console.error("Failed to add category and details");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    };

    return (
        <div>
            <h2>Add Category and Details</h2>
            <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter category name"
            />
            <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Enter price"
            />
            <input
                type="text"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
                placeholder="Enter quality"
            />
            <input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
            />
            <button onClick={handleAddCategory}>Add Category and Details</button>
        </div>
    );
};

export default AddCategory;

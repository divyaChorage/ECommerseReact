import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const AddCategory = () => {
    const { id } = useParams(); 


    const [category, setCategory] = useState("");
    const [price, setPrice] = useState("");
    const [quality, setQuality] = useState("");
    const [description, setDescription] = useState("");
    const [image, setImage] = useState(null);
    const navigate = useNavigate();

    const handleAddCategory = async () => {

        console.log(id," ",description)

        const formData = new FormData();

        formData.append("category", category);
        formData.append("price", price);
        formData.append("quality", quality);
        formData.append("description", description);

        if (image) 
        {
            formData.append("image", image);
            console.log("image is addae ")
        }else
        {
            console.log("unable  to  ad  image ")
        }

        try
         {
            const response = await fetch(`http://localhost:5000/product/${id}/addCategory`, {
                method: "POST",
                body: formData,
            });
            if (response.ok) {
                const result = await response.json();
                console.log("Category and details added:", result);
                setCategory("");
setPrice("");
setQuality("");
setDescription("");
setImage(null);

navigate(`/addCategory/${id}/AllCategories`);


            }
             else 
            {  
                console.error("Failed to add category and details");
            }
        }
         catch (error) 
         {
            console.error("Error:", error);
         }
    };

    console.log(image)
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
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter decsription"
            />
           <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])} // Handle file selection
                style={{ margin: '10px 0' }} 
             
            />
            {!image && <span className="input_invalid">Please upload an image</span>}


            <button onClick={handleAddCategory}>Add Category and Details</button>
        </div>
    );
};
export default AddCategory;


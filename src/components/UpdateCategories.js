import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

const UpdateCategories = () => {
    const navigate = useNavigate();
    const { id, cateId } = useParams(); // Extract both product ID and category ID
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');
    const [quality, setQuality] = useState('');
    const [description, setDescription] = useState('');
    const [error, setError] = useState('');
    const [image, setImage] = useState(null);

    console.log("Product ID:", id, "Category ID:", cateId);
    const getCategoryDetails = useCallback(async () => {
        try {
            const response = await fetch(`http://localhost:5000/addCategory/${id}/AllCategories/${cateId}`);
            if (!response.ok) {
                throw new Error("Failed to fetch category details");
            }
            const result = await response.json();
            console.log("Fetched category details:", result);
    
            // Assuming result contains the category fields directly
            setCategory(result.category || '');
            setPrice(result.price || '');
            setQuality(result.quality || '');
            setDescription(result.description || '');
            setImage(result.image || null);
        } catch (error) {
            console.error("Error fetching category details:", error);
            setError("Failed to fetch category details");
        }
    }, [id, cateId]);
    

    useEffect(() => {
        getCategoryDetails();
    }, [getCategoryDetails]);

    const updateCategory = async () => {
        if (!category || !price || !quality || !description) {
            setError("All fields are required");
            return;
        }

        const formData = new FormData();
        formData.append('category', category);
        formData.append('price', price);
        formData.append('quality', quality);
        formData.append('description', description);
        if (image) {
            formData.append('image', image);
        }

        console.log(image)
        try {
            const response = await fetch(`http://127.0.0.1:5000/addCategory/${id}/AllCategories/${cateId}`, {
                method: 'PUT',
                body: formData
            });

            if (response.ok) {
                const data = await response.json();
                console.log("Category updated:", data);
                alert("Category updated successfully!");
                navigate(`/addCategory/${id}/AllCategories`); // Navigate back to All Categories
            } else {
                const errorData = await response.json();
                console.error("Failed to update category:", errorData.error || response.statusText);
                setError("Failed to update category");
            }
        } catch (error) {
            console.error("Error updating category:", error);
            setError("An error occurred while updating the category");
        }
    };

    return (
        <div className="update-category-container">
            <h1>Update Category</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <input
                type="text"
                placeholder="Enter category name"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            />
            <input
                type="text"
                placeholder="Enter category price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
            />
            <input
                type="text"
                placeholder="Enter category quality"
                value={quality}
                onChange={(e) => setQuality(e.target.value)}
            />
            <input
                type="text"
                placeholder="Enter category description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
                       <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={{ margin: '10px 0' }} />

            <button onClick={updateCategory}>Update Category</button>
        </div>
    );
};

export default UpdateCategories;

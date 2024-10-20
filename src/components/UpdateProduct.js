import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "react-router-dom";

const UpdateProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [company, setCompany] = useState('');
    const [image, setImage] = useState(null);
    const [error, setError] = useState(false);
    const params = useParams();

    const getProductDetails = useCallback(async () => {
        try {
            let result = await fetch(`http://localhost:5000/product/${params.id}`);
            result = await result.json();
            
            setName(result.name);
            setPrice(result.price);
            setCategory(result.categories.join(', ')); // Join categories for the input field
            setCompany(result.company);
            setImage(result.image);
        } catch (error) {
            console.error("Error fetching product details:", error);
        }
    }, [params.id]);

    useEffect(() => {
        getProductDetails();
    }, [getProductDetails]);

    const updateProduct = async () => {
        if (!name || !price || !category || !company) {
            setError(true);
            return false;
        }

        const updatedCategories = category.split(',').map(cat => cat.trim());

        const formData = new FormData();
        formData.append('name', name);
        formData.append('price', price);
        formData.append('categories', updatedCategories.join(',')); // Ensure this is consistent with backend
        formData.append('company', company);

        if (image) {
            formData.append('image', image);
        }
        console.log(image)

        try {
            let result = await fetch(`http://localhost:5000/product/${params.id}`, {
                method: 'PUT',
                body: formData
            });

            if (result.ok) {
                let data = await result.json();
                console.log("Product updated:", data);
            } else {
                console.error("Failed to update product:", result.statusText);
            }
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    return (
        <div className="update-product-container">
            <h1>Update Product</h1>
            <input type="text" placeholder="Enter product name" value={name} onChange={(e) => setName(e.target.value)} />
            <input type="text" placeholder="Enter product price" value={price} onChange={(e) => setPrice(e.target.value)} />
            <input type="text" placeholder="Enter product categories (comma separated)" value={category} onChange={(e) => setCategory(e.target.value)} />
            <input type="text" placeholder="Enter product company" value={company} onChange={(e) => setCompany(e.target.value)} />
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={{ margin: '10px 0' }} />
            <button onClick={updateProduct}>Update Product</button>
        </div>
    );
};

export default UpdateProduct;


// import React, { useEffect, useState,useCallback } from "react";
// import { useParams } from "react-router-dom";

// const UpdateProduct = () => {
//     const [name, setName] = useState('');
//     const [price, setPrice] = useState('');
//     const [category, setCategory] = useState('');
//     const [company, setCompany] = useState('');
//     const params = useParams();
 
//     const getProductDetails = useCallback(async () => {
//         try {
//             let response = await fetch(`http://localhost:5000/product/${params.id}`);
//             if (response.ok) {
//                 let data = await response.json();
//                 setName(data.name);
//                 setPrice(data.price);
//                 setCategory(data.category);
//                 setCompany(data.company);
//             } else {
//                 console.error("Failed to fetch product details");
//             }
//         } catch (error) {
//             console.error("Error fetching product details:", error);
//         }
//     }, [params.id]);

//     useEffect(() => {
//         getProductDetails();
//     }, [getProductDetails]);

 
    
//     const updateProduct = async () => {
//         try {
//             let response = await fetch(`http://localhost:5000/product/${params.id}`, {
//                 method: "PUT",
//                 headers: {
//                     "Content-Type": "application/json"
//                 },
//                 body: JSON.stringify({ name, price, category, company })
//             });
//             if (response.ok) {
//                 alert("Product updated successfully");
//             } else {
//                 console.error("Failed to update product");
//             }
//         } catch (error) {
//             console.error("Error updating product:", error);
//         }
//     };

  
//     return (
//         <div className="add-product-container">
//             <h1>Update Product</h1>
//             <input type="text" placeholder="Enter product name" value={name} onChange={(e) => setName(e.target.value)} />
//             <input type="text" placeholder="Enter product price" value={price} onChange={(e) => setPrice(e.target.value)} />
//             <input type="text" placeholder="Enter product category" value={category} onChange={(e) => setCategory(e.target.value)} />
//             <input type="text" placeholder="Enter product company" value={company} onChange={(e) => setCompany(e.target.value)} />
//             <button onClick={updateProduct}>Update Product</button>
//         </div>
//     );
// }

// export default UpdateProduct;

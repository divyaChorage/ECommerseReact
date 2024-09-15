


// export default AddProduct;
import React, { useState } from "react";

const AddProduct = () => {
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [category, setCategory] = useState('');
    const [company, setCompany] = useState('');
    const [error, setError] = useState(false);
    const [image, setImage] = useState(null); // State for image

    const addProduct = async () => {
        if (!name || !price || !category || !company || !image) {
            setError(true);
            return false;
        }
        let user = localStorage.getItem("user");

        if (user) 
            {
            user = JSON.parse(user);
            let userId = user.id;

            if (!userId) 
                {
                console.error("User ID is undefined");
                return;
            }

            // Prepare form data with user ID
            const formData = new FormData();
            formData.append('name', name);
            formData.append('price', price);
            formData.append('category', category);
            formData.append('company', company);
            formData.append('userId', userId);
            formData.append('image', image);

            try {
                let result = await fetch("http://127.0.0.1:5000/addProduct", {
                    method: 'POST',
                    body: formData
                });

                console.log(formData,"formData");

                if (result.ok) {
                    let data = await result.json();
                    console.log("Product added:", data);
                } else {
                    console.error("Failed to add product:", result.statusText);
                }
            } catch (error) {
                console.error("Error adding product:", error);
            }
        } else {
            console.error("User not found in localStorage");
        }
    };

    return (
        <div className="add-product-container">
            <h1>Add Product</h1>
            <input type="text" placeholder="Enter product name" value={name} onChange={(e) => setName(e.target.value)} />
            {error && !name && <span className="input_invalid">Enter valid name</span>}
            
            <input type="text" placeholder="Enter product price" value={price} onChange={(e) => setPrice(e.target.value)} />
            {error && !price && <span className="input_invalid">Enter valid price</span>}
            
            <input type="text" placeholder="Enter product category" value={category} onChange={(e) => setCategory(e.target.value)} />
            {error && !category && <span className="input_invalid">Enter valid category</span>}
            
            <input type="text" placeholder="Enter product company" value={company} onChange={(e) => setCompany(e.target.value)} />
            {error && !company && <span className="input_invalid">Enter valid company</span>}
            
            <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])} // Handle file selection
                style={{ margin: '10px 0' }} // Add some margin for better visibility
            />
            {error && !image && <span className="input_invalid">Please upload an image</span>}

            <button onClick={addProduct}>Add Product</button>
        </div>
    );
};

export default AddProduct;



// import React, { useState } from "react";

// const AddProduct = () => {
//     const [name, setName] = useState('');
//     const [price, setPrice] = useState('');
//     const [category, setCategory] = useState('');
//     const [company, setCompany] = useState('');
//     const [error, setError] = useState(false);
//     const [image, setImage] = useState(null);

//     const addProduct = async () => {
//         console.log(category,"categoryes")
//         if (!name || !price || !category || !company || !image) {
//             setError(true);
//             return false;
//         }

//         let user = localStorage.getItem("user");
//         if (user) {
//             user = JSON.parse(user);
//             let userId = user.id;

//             if (!userId) {
//                 console.error("User ID is undefined");
//                 return;
//             }

//             const formData = new FormData();
//             formData.append('name', name);
//             formData.append('price', price);
//             formData.append('category', category);
//             formData.append('company', company);
//             formData.append('userId', userId);
//             formData.append('image', image);

//             try {
//                 let result = await fetch("http://127.0.0.1:5000/addProduct", {
//                     method: 'POST',
//                     body: formData
//                 });

//                 if (result.ok) {
//                     let data = await result.json();

//                     console.log("Product added:", data.categories);
//                 } else {
//                     console.error("Failed to add product:", result.statusText);
//                 }
//             } catch (error) {
//                 console.error("Error adding product:", error);
//             }
//         } else {
//             console.error("User not found in localStorage");
//         }
//     };
//     console.log(category)

//     return (
//         <div className="add-product-container">
//             <h1>Add Product</h1>
//             <input type="text" placeholder="Enter product name" value={name} onChange={(e) => setName(e.target.value)} />
//             {error && !name && <span className="input_invalid">Enter valid name</span>}
            
//             <input type="text" placeholder="Enter product price" value={price} onChange={(e) => setPrice(e.target.value)} />
//             {error && !price && <span className="input_invalid">Enter valid price</span>}
            
//             <input type="text" placeholder="Enter product categories (comma separated)" value={category} onChange={(e) => setCategory(e.target.value)} />
//             {error && !category && <span className="input_invalid">Enter valid category</span>}
            
//             <input type="text" placeholder="Enter product company" value={company} onChange={(e) => setCompany(e.target.value)} />
//             {error && !company && <span className="input_invalid">Enter valid company</span>}
            
//             <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} style={{ margin: '10px 0' }} />
//             {error && !image && <span className="input_invalid">Please upload an image</span>}

//             <button onClick={addProduct}>Add Product</button>
//         </div>
//     );
// };

// export default AddProduct;

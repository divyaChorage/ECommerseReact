
// import React, { useEffect, useState } from "react";
// // import { Link } from "react-router-dom";
// import { useNavigate } from "react-router-dom";

// const ProductList = () => {

//     const navigate = useNavigate()
//     const [products, setProdcts] = useState([])

//     useEffect(() => {
//         getProducts()
//     }, [])

//     const getProducts = async () => {

//         let result = await fetch("http://127.0.0.1:5000/productList");
//         result = await result.json();
//         setProdcts(result)
//     }


//     console.log("before")
//     const deleteProduct = async (id) => {
//         let result = await fetch(`http://127.0.0.1:5000/product/${id}`, {
//             method: 'DELETE',
//         });

//         if (result.ok) {
//             console.warn("Record is deleted");
//             // Update the state to remove the deleted product from the list
//             setProdcts(products.filter(product => product._id !== id));
//         } else {
//             console.error("Failed to delete the product");
//         }
//     };



//     console.log(products)

//     const searchHandle = async (event) => {
//         let key = event.target.value;
//         if (key) {
//             try {
//                 let response = await fetch(`http://localhost:5000/search/${key}`);
//                 if (response.ok) {
//                     let result = await response.json();
//                     if (result) {
//                         setProdcts(result)
                       
//                     } else {
//                         console.error("No products found");
//                     }
//                 } else {
//                     console.error("Failed to fetch products, status:", response.status);
//                 }
//             } catch (error) {
//                 console.error("Error fetching products:", error);
//             }
//         } else {
//             getProducts();
//         }
//     };
    
//     return (
//         <div className="product-table">
//             <h1>Product List </h1>
//             <input type="text" className="search" placeholder="search product" onChange={searchHandle}
//             ></input>
//             <ul className="header">
//                 <li>S.No</li>
//                 <li>Product Name</li>
//                 <li>Price</li>
//                 <li>Company</li>
//                 <li>image</li>
//                 <li>Operation</li>
//             </ul>
//             {  

//             products.length>0?
//                 products.map((item, index) => (
//                     <ul key={index} className="row">
//                         <li>{index + 1}</li>
//                         <li>{item.name}</li>
//                         <li>{item.price}</li>
//                         <li>{item.company}</li>

//                         {item.image && (
//                                 <li>
//                                     <img
//                                        src={`http://localhost:5000/uploads/${item.image.split('\\').pop()}`}
//                                         alt={item.name}
//                                         style={{ width: '50px', height: '50px' }}
//                                     />
//                                 </li>
//                             )}
//                    {console.log(item.image)}
//                         <li><button className="delete-button" onClick={() => deleteProduct(item._id)}>Delete</button></li>

//                         {/* <Link to={`/update/${item._id}`}>Update</Link> */}
//                         <button className="update-button" onClick={() => navigate(`/update/${item._id}`)}>Update</button>


//                     </ul>
//                 ))
//                 :<h1>product not avaiable</h1>

//             }
//         </div>
//     );

// }



// export default ProductList;


import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductList = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        let result = await fetch("http://127.0.0.1:5000/productList");
        result = await result.json();
        setProducts(result);
    };

    const deleteProduct = async (id) => {
        let result = await fetch(`http://127.0.0.1:5000/product/${id}`, {
            method: 'DELETE',
        });

        if (result.ok) {
            setProducts(products.filter(product => product._id !== id));
        } else {
            console.error("Failed to delete the product");
        }
    };

    const searchHandle = async (event) => {
        let key = event.target.value;
        if (key) {
            try {
                let response = await fetch(`http://localhost:5000/search/${key}`);
                if (response.ok) {
                    let result = await response.json();
                    setProducts(result);
                } else {
                    console.error("Failed to fetch products, status:", response.status);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            }
        } else {
            getProducts();
        }
    };

    return (
        <div className="product-table">
            <h1>Product List</h1>
            <input type="text" className="search" placeholder="search product" onChange={searchHandle} />
            <ul className="header">
                <li>S.No</li>
                <li>Product Name</li>
                <li>Price</li>
                <li>Company</li>
                <li>Categories</li>
                <li>Image</li>
                <li>Operation</li>
            </ul>
            {products.length > 0 ? (
                products.map((item, index) => (
                    <ul key={index} className="row">
                        <li>{index + 1}</li>
                        <li>{item.name}</li>
                        <li>{item.price}</li>
                        <li>{item.company}</li>
                        {/* <li>{item.categories && item.categories.length > 0 ? item.categories.join(', ') : 'No Categories'}</li> */}              
                        <button className="addCateory-button" onClick={() => navigate(`/addCateory/${item._id}`)}>addCateory</button>

                        <li>
                            {item.image && (
                                <img
                                    src={`http://localhost:5000/uploads/${item.image.split('\\').pop()}`}
                                    alt={item.name}
                                    style={{ width: '50px', height: '50px' }}
                                />
                            )}
                        </li>

                        <li>
                            <button className="delete-button" onClick={() => deleteProduct(item._id)}>Delete</button>
                            <button className="update-button" onClick={() => navigate(`/update/${item._id}`)}>Update</button>
                        </li>
                        
                    </ul>
                ))
            ) : (
                <h1>No products available</h1>
            )}
        </div>
    );
};

export default ProductList;

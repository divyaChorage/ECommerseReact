// AllCateForProduct.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom'; // Import useNavigate if needed for navigation
import  './AllCategoryProduct.css'
import { useNavigate } from 'react-router-dom';
const AllCateForProduct = () => {
  const navigate=useNavigate()
  const { id } = useParams(); // Correctly access 'productId'
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchCategories();
      console.log('Product ID:', id);
    } else {
      console.error('Product ID is undefined');
      setError('Product ID is undefined');
      setLoading(false);
    }
  },[id]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/product/${id}/addCategory/AllCatgories`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched categories:", data);

      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        throw new Error(`Expected an array but got ${typeof data}`);
      }
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="categories-container">
      <h1>All Categories for Product</h1>
      <div className="categories-grid">
        {categories.length > 0 ? (
          categories.map((category, index) => (
            <div className="category-card" key={category._id}>
              <img
                src={`http://localhost:5000/uploadCate/${category.image.split('\\').pop()}`}
                alt={category.category}
                className="category-image"
              />
              <h3>{category.category}</h3>
              <div className="price-actions">
            <p className="price">Price: ${category.price}</p> {/* Modified price */}
          </div>
              <p>Quality: {category.quality}</p>
              <p>Description: {category.description}</p>
              <div className="category-actions">
   

              <button 
                  className="btn-buy-now" 
                  onClick={() => navigate(`/Allproducts/${id}/AllCateForProduct/${category._id}/BuyNow`, { state: { category } })}
                  >
                  Buy Now
                </button>

                <button className="btn-add-cart">Add to Cart</button>
              </div>
            </div>
          ))
        ) : (
          <p>No categories available for this product.</p>
        )}
      </div>
    </div>
  );
};

export default AllCateForProduct;
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const CategoryProduct = () => {
  const { productId } = useParams();// Get the product ID from the URL
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        if (productId) {
          const response = await fetch(`http://localhost:5000/product/${productId}`);
          if (response.ok) {
            const data = await response.json();
            setProduct(data)
            // Handle data
          } else {
            console.error('Failed to fetch product details');
          }
        } else {
          console.error('Product ID is undefined');
        }
      } catch (error) {
        console.error('Error fetching product details:', error);
      }
    };

    fetchProductDetails();
  }, [productId]);

  const handleAddToCart = () => {
    console.log('Add to Cart clicked for product:', product.name);
    // Add your "Add to Cart" logic here
  };

  const handleBuyNow = () => {
    console.log('Buy Now clicked for product:', product.name);
    // Add your "Buy Now" logic here
    navigate('/checkout');
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="product-details">
      <h1>{product.name}</h1>
      <img 
        src={`http://localhost:5000/uploads/${product.image.split('\\').pop()}`} 
        alt={product.name} 
        className="product-image"
      />
      <p>Price: ${product.price}</p>
      <p>Company: {product.company}</p>
      <p>Categories: {product.categories.join(', ')}</p>
      <p>Description: {product.description}</p>
      <button onClick={handleAddToCart}>Add to Cart</button>
      <button onClick={handleBuyNow}>Buy Now</button>
    </div>
  );
};

export default CategoryProduct;

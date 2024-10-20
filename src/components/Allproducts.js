

import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp, faComment, faPaperPlane, faDatabase } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

const AllProducts = () => {
  const [products, setProducts] = useState([]);
  const [commentInputs, setCommentInputs] = useState({});
  const [activeCommentSection, setActiveCommentSection] = useState(null);
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();


  useEffect(() => {
    const fetchProducts = async () => {
      const result = await fetch("http://127.0.0.1:5000/productList");
      const data = await result.json();
      console.log("data",faDatabase)

      if (Array.isArray(data)) {
        setProducts(data.map(product => ({ ...product, likes: product.likes || 0, comments: product.comments || [] })));
      } else {
        console.error("Expected an array but got:", typeof data);
        // Handle the unexpected data structure appropriately, e.g., set an error state
      }

    };

    fetchProducts();
  }, []);

  const handleLike = async (productId) => {
    console.log(productId)
    try {
      const response = await fetch(`http://localhost:5000/product/${productId}/like`, {
        method: 'POST'
      });
      if (response.ok) {
        const data = await response.json();
        setProducts(products.map(product =>
          product._id === productId ? { ...product, likes: data.likes } : product
        ));
      } else {
        console.error('Failed to like product');
      }
    } catch (error) {
      console.error('Error liking product:', error);
    }
  };

  const handleAddComment = async (productId) => {
    if (commentInputs[productId]) {
      try {
        const response = await fetch(`http://localhost:5000/product/${productId}/comment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: currentUser.name,
            comment: commentInputs[productId]
          })
        });
        if (response.ok) {
          const data = await response.json();
          setProducts(products.map(product =>
            product._id === productId ? { ...product, comments: data } : product
          ));
          setCommentInputs({ ...commentInputs, [productId]: '' });
        } else {
          console.error('Failed to add comment');
        }
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const handleCommentInputChange = (productId, value) => {
    setCommentInputs({
      ...commentInputs,
      [productId]: value
    });
  };

  const toggleCommentSection = (productId) => {
    setActiveCommentSection(activeCommentSection === productId ? null : productId);
  };


  const handleImageClick = (productId) => {
    if (productId) {
      console.log(productId,"product id  for  navigte  to acte from  all produ")
      
      
      navigate(`/Allproducts/${productId}/AllCateForProduct`);

    } else {
      console.error("Product ID is undefined");
    }
  };
  


  return (
    <div className="all-products-container">
      <h1>User Dashboard</h1>
      <p>Here you can view the products added by the admin.</p>
      <div className="product-grid">
        {products.map((product, index) => (
          <div className="product-card" key={index}>
            {product.image && (
              <img
                src={`http://localhost:5000/uploads/${product.image.split('\\').pop()}`}
                alt={product.name}
                className="product-image"
                onClick={() => handleImageClick(product._id)}
              />
            )}
            <div className="product-details">
              <h2 className="product-name">{product.name}</h2>
              <p className="product-price">${product.price}</p>
              <p className="product-company">{product.company}</p>
              <div className="product-actions">
                <div className="like-section">
                  <span className="like-count">{product.likes}</span>
                  <FontAwesomeIcon
                    icon={faThumbsUp}
                    onClick={() => handleLike(product._id)}
                    className="icon like-icon"
                  />
                </div>
                <div className="comment-section">
                  <FontAwesomeIcon
                    icon={faComment}
                    onClick={() => toggleCommentSection(product._id)}
                    className="icon comment-icon"
                  />
                  {activeCommentSection === product._id && (
                    <div className="comment-input-section">
                      <input 
                        type="text" 
                        value={commentInputs[product._id] || ''} 
                        onChange={(e) => handleCommentInputChange(product._id, e.target.value)} 
                        placeholder="Add a comment" 
                        className="comment-input"
                      />
                      <FontAwesomeIcon
                        icon={faPaperPlane}
                        onClick={() => handleAddComment(product._id)}
                        className="icon send-icon"
                      />
                    </div>
                  )}
                </div>
                {activeCommentSection === product._id && product.comments.length > 0 && (
                  <div className="comments-section">
                    {product.comments.map((comment, commentIndex) => (
                      <p key={commentIndex} className="comment">
                        <strong>{comment.username}:</strong> {comment.comment}
                      </p>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );


};  

export default AllProducts;

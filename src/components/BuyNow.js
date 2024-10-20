import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import './BuyNow.css'; // Assuming you have a CSS file for styling

const BuyNow = () => {
  const navigate = useNavigate();
  const { productId, categoryId } = useParams();
  const location = useLocation();
  const { category } = location.state || {}; // Extract category from state

  const [categoryName, setCategoryName] = useState('');
  const [price, setPrice] = useState('');
  const [quality, setQuality] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');
  const [pincode, setPinCode] = useState('');
  const [address, setAddress] = useState('');
  const [todayDate, setTodayDate] = useState('');
  const [orderWillReachDate, setOrderWillReachDate] = useState('');
  // const [image, setImage] = useState(null);

  const [otp, setOtp] = useState(""); // State to hold entered OTP
  const [generatedOtp, setGeneratedOtp] = useState(null); // State to store generated OTP
  const [orderConfirmed, setOrderConfirmed] = useState(false); // State to track if order is confirmed

  useEffect(() => {
    if (category) {
      setCategoryName(category.category || '');
      setPrice(category.price || '');
      setQuality(category.quality || '');
      setDescription(category.description || '');
      // setImage(category.image || null);

      // Set default dates
      const today = new Date();
      setTodayDate(today.toISOString().split('T')[0]); // Format as YYYY-MM-DD

      const reachDate = new Date();
      reachDate.setDate(today.getDate() + 7); // 7 days later
      setOrderWillReachDate(reachDate.toISOString().split('T')[0]);
    } else {
      // If category data is not available, redirect back or show an error
      setError("Category details are not available.");
    }
  }, [category]);

  const handleOrderNow = () => {
    // Generate a random 4-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000);
    setGeneratedOtp(otp);
    alert(`Your OTP is: ${otp}`); // You can show this in a real UI (for now, just alerting)
  };

  const handleConfirmOrder = async () => {
    if (otp === String(generatedOtp)) {
      setOrderConfirmed(true);
      setError(''); // Clear error
    } else {
      setError('Invalid OTP. Please try again.');
    }


    const orderData = {
        productId,
        categoryId,
        categoryName,
        price,
        quality,
        description,
        pincode,
        address,
        todayDate,
        orderWillReachDate,
        otp: generatedOtp, // Save the OTP
      };


      try {
        // Send a POST request to the backend API to save the order details
        const response = await fetch(`http://localhost:5000/Allproducts/${productId}/AllCateForProduct/${categoryId}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData),
        });
  
        if (!response.ok) {
          throw new Error('Failed to save order');
        }
  
        const result = await response.json();
        console.log('Order saved:', result);
        // Handle success (e.g., navigate to a success page, show a message, etc.)
      } catch (error) {
        console.error('Error saving order:', error);
        setError('Error saving order. Please try again.');
      }
    
  };

  if (!category) {
    return (
      <div className="update-category-container">
        <h1>Buy Now</h1>
        {error && <p className="error-message">{error}</p>}
        <button onClick={() => navigate(-1)} className="back-button">Go Back</button>
      </div>
    );
  }

  return (
    <div className="update-category-container">
      <form className="buy-now-form">
        <h1>Buy Now</h1>
        {error && <p className="error-message">{error}</p>}

        {/* Category Name */}
        <div className="form-group">
          <label htmlFor="categoryName">Category Name:</label>
          <input
            id="categoryName"
            type="text"
            value={categoryName}
            readOnly
            className="form-input"
          />
        </div>

        {/* Price */}
        <div className="form-group">
          <label htmlFor="price">Price:</label>
          <input
            id="price"
            type="text"
            value={`$${price}`}
            readOnly
            className="form-input"
          />
        </div>

        {/* Quality */}
        <div className="form-group">
          <label htmlFor="quality">Quality:</label>
          <input
            id="quality"
            type="text"
            value={quality}
            readOnly
            className="form-input"
          />
        </div>

        {/* Description */}
        <div className="form-group">
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            readOnly
            className="form-textarea"
          />
        </div>

        {/* Pincode */}
        <div className="form-group">
          <label htmlFor="pincode">Enter Pincode:</label>
          <input
            id="pincode"
            type="text"
            value={pincode}
            onChange={(e) => setPinCode(e.target.value)}
            required
            className="form-input"
            placeholder="e.g., 123456"
          />
        </div>

        {/* Address */}
        <div className="form-group">
          <label htmlFor="address">Enter Your Address:</label>
          <textarea
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            className="form-textarea"
            placeholder="e.g., 123 Main St, City, Country"
          />
        </div>

        {/* Today's Date */}
        <div className="form-group">
          <label htmlFor="todayDate">Today's Date:</label>
          <input
            id="todayDate"
            type="date"
            value={todayDate}
            readOnly
            className="form-input"
          />
        </div>

        {/* Order Will Reach By */}
        <div className="form-group">
          <label htmlFor="orderWillReachDate">Order Will Reach By:</label>
          <input
            id="orderWillReachDate"
            type="date"
            value={orderWillReachDate}
            readOnly
            className="form-input"
          />
        </div>

        {/* Order Now Button */}
        <button type="button" onClick={handleOrderNow} className="order-button">
          Order Now
        </button>

        {/* OTP Section */}
        {generatedOtp && (
          <div className="otp-section">
            <h2>Enter OTP to Confirm Order</h2>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)} // Update OTP value
              placeholder="Enter OTP"
              className="form-input"
            />
            <button type="button" onClick={handleConfirmOrder} className="confirm-button">
              Confirm Order
            </button>

            {/* Show error if OTP is incorrect */}
            {error && <p className="error-message">{error}</p>}
          </div>
        )}

        {/* Show order confirmation message */}
        {orderConfirmed && <h2>Order Confirmed!</h2>}
      </form>
    </div>
  );
};

export default BuyNow;

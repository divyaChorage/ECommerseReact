// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// const Navbar = () => {
//     const auth = localStorage.getItem('user');
//     const navigate = useNavigate()
//     //if  usenavigate is not used here then after refresh will be  be  display logout otherwise it srill display sign up 
//     //that  why use because  it  chake  other cimponent  navigation in sign up oageuse usenavigate so it is  navigate 
//     //in this pg check auth condition then it is rerender  all compo



//     //check  here  is  user is loggen in hten display other dashboard if not then then display sign up 
//     //  <li>{auth ? <Link to="/logout">Logout Page</Link> :<Link to ="/signup">Sign up</Link>}</li>

//     const logout = () => {
//         console.log("logout user")
//         localStorage.clear();
//         navigate('/signup')
//     }

//     return (
//         <div>
//   <img 
//   alt="logo" 
//   className="logo"
//   src="https://pngtree.com/freepng/shopping-logo-design_6519668.html"></img>
//             {
//                 auth ?
//                     <ul className="nav-ul">
//                         <li><Link to="/">Home Page</Link></li>
//                         <li><Link to="/add">Add Page</Link></li>
//                         <li><Link to="/products">Product List</Link></li>
//                         <li><Link to="/update">Update Page</Link></li>

//                         <li><Link to="/profile">Profile Page</Link></li>
//                         <li><Link onClick={logout} to="/signup">Logout Page({JSON.parse(auth).name})</Link></li>

//                     </ul>
//                     :
//                     <ul className="nav-ul">    <>
//                         <li> <Link to="/signup">Sign up</Link></li>
//                         <li><Link to="/login">Login</Link></li>
//                     </>

//                     </ul>

//             }


//         </div>
//     );
// };

// export default Navbar;

import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const auth = JSON.parse(localStorage.getItem('user'));
  const navigate = useNavigate();

  const logout = () => {
    localStorage.clear();
    navigate('/signup');
  };

  return (
    <div>
  
      {
        auth ?
          <ul className="nav-ul">
            <li><Link to="/">Home Page</Link></li>
            {auth.isAdmin && <li><Link to="/add">Add Product</Link></li>}
            {auth.isAdmin && <li><Link to="/products">Product List</Link></li>}
            {auth.isAdmin && <li><Link to="/update">Update Product</Link></li>}
            {auth.isAdmin && <li><Link to="/AddCateory">AddCateory Product</Link></li>}
            {auth.isAdmin && <li><Link to="/AllCatgories">Allcategories</Link></li>}
            <li><Link to="/profile">Profile Page</Link></li>
            {!auth.isAdmin && <li><Link to="/Allproducts">All Products</Link></li>}
            <li><Link onClick={logout} to="/signup">Logout Page ({auth.name})</Link></li>
          </ul>
          :
          <ul className="nav-ul">
            <li><Link to="/signup">Sign up</Link></li>
            <li><Link to="/login">Login</Link></li>
          </ul>
      }
    </div>
  );
};

export default Navbar;


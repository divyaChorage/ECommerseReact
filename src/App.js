// import React from 'react';
// import { BrowserRouter, Route, Routes } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import './App.css';
// import Footer from './components/Footer';
// import SignUp from './components/SignUp';
// import Login from './components/Login';
// import PrivateComponent from './components/PrivateComponent';
// import AddProduct from './components/AddProduct';
// import ProductList from './components/ProductList';
// import UpdateProduct from './components/UpdateProduct';

// function App() {
//   return (
//     <div className="App">
//       <BrowserRouter>
//         <Navbar />
//         <Routes>
//           {/* Wrap the private routes correctly */}
//           <Route element={<PrivateComponent />}>
//             <Route path="/" element={<h1>Home Page</h1>} />
//             <Route path="/add" element={<AddProduct/>} />
//             <Route path="/update/:id" element={<UpdateProduct/>} />
//             <Route path="/logout" element={<h1>Logout Page</h1>} />
//             <Route path="/profile" element={<h1>Profile Page</h1>} />
//             <Route path="/products" element={<ProductList/>} />

//           </Route>

//           {/* Public route */}
//           <Route path="/signup" element={<SignUp />} />
//           <Route path="/login" element={<Login/>}></Route>
//         </Routes>
//       </BrowserRouter>
//       <Footer />
//     </div>
//   );
// }

// export default App;

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import './App.css';
import Footer from './components/Footer';
import SignUp from './components/SignUp';
import Login from './components/Login';
import AddProduct from './components/AddProduct';
import ProductList from './components/ProductList';
import UpdateProduct from './components/UpdateProduct';
import AdminDashboard from './components/AdminDashboard';
import UserDashboard from './components/UserDashBoard';
import PrivateComponent from './components/PrivateComponent'
import { Navigate } from 'react-router-dom';
import Allproducts from './components/Allproducts';
import CategoryProduct from './components/CategoryProduct';
import AddCateory from './components/AddCateory';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/"
            element={
              <PrivateComponent
                adminComponent={<AdminDashboard />}
                userComponent={<UserDashboard />}
              />
            }
          />
          <Route
            path="/adminDashboard"
            element={
              <PrivateComponent
                adminComponent={<AdminDashboard />}
                userComponent={<UserDashboard />}
              />
            }
          />
          <Route
            path="/add"
            element={
              <PrivateComponent
                adminComponent={<AddProduct />}
                userComponent={<Navigate to="/userDashBoard" />}
              />
            }
          />
          <Route
            path="/update/:id"
            element={
              <PrivateComponent
                adminComponent={<UpdateProduct />}
                userComponent={<Navigate to="/userDashBoard" />}
              />
            }
          />

          <Route
            path="/addCateory/:id"
            element={
              <PrivateComponent
                adminComponent={<AddCateory />}
                userComponent={<Navigate to="/userDashBoard" />}
              />
            }
          />

          <Route
            path="/products"
            element={
              <PrivateComponent
                adminComponent={<ProductList />}
                userComponent={<ProductList />}
              />
            }
          />
          <Route
            path="/Allproducts"
            element={
              <PrivateComponent
                adminComponent={<Navigate to="/adminDashboard" />}
                userComponent={<Allproducts />}
              />
            }
          />

          <Route
            path="/product/:productId"
            element={
              <PrivateComponent
                adminComponent={<Navigate to="/adminDashboard" />}
                userComponent={<CategoryProduct />}
              />
            }
          />
          <Route path="/logout" element={<h1>Logout Page</h1>} />
          <Route path="/profile" element={<h1>Profile Page</h1>} />
        </Routes>
      </BrowserRouter>
      <Footer />
    </div>
  );
}

export default App;

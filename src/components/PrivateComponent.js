// import React from "react";
import { Navigate } from "react-router-dom";

// const PrivateComponent = () => {
//     const auth = localStorage.getItem("user");

//     return auth ? <Outlet /> : <Navigate to="/signup" />
// }

// export default PrivateComponent;
const PrivateComponent = ({ adminComponent, userComponent }) => {
    const auth = JSON.parse(localStorage.getItem('user'));
  
    if (!auth) {
      return <Navigate to="/login" />;
    }
  
    return auth.isAdmin ? adminComponent : userComponent;
  };
  
   export default PrivateComponent;
// import React, {  useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";


// const Login = () => {

//     const [name, setName] = useState('');
//     const [password, setPassword] = useState('');
//     const navigate = useNavigate();


//     //when user  try  to  navigate  login oage  via  url  then  dont move it  navogate  to home page
//     useEffect(()=>
//     {
//        const auth=localStorage.getItem('user');
//        if(auth)
//        {
//         navigate('/');
//        }
//     })

//     const loggedIn=async()=>
//     {
//         try
//         {
//             let result = await fetch("http://127.0.0.1:5000/login", {
//                 method: 'Post',
//                 body: JSON.stringify({ name, password }),
//                 headers: {
//                     'Content-Type': 'application/json'
//                 },
//             });
//             result = await result.json();
//             console.log(result)
//             if (result.name) {
//                 localStorage.setItem("user", JSON.stringify(result));
//                 navigate('/');
//             }
//             else{
//                alert(result); 
//             }
//         }
//         catch
//         {
//             alert("something is  wrong")

//         }
       
//     };
     
    

    
//     return (
//         <div className="login-container">
//         <h1>Login</h1>
//         <input
//             type="text"
//             placeholder="Enter name"
//             className="login-input"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//         />
//         <input
//             type="password"
//             placeholder="Enter password"
//             className="login-input"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//         />
//         <button type="button" onClick={loggedIn} className="login-button">Login</button>
//     </div>
//     )
// }

// export default Login;

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const auth = localStorage.getItem('user');
    if (auth) {
      navigate('/');
    }
  }, [navigate]);

  const loggedIn = async () => {
    try {
      let result = await fetch("http://127.0.0.1:5000/login", {
        method: 'POST',
        body: JSON.stringify({ name, password }),
        headers: {
          'Content-Type': 'application/json'
        },
      });
      result = await result.json();
      console.log(result)
      if (result.name) {
        localStorage.setItem("user", JSON.stringify(result));
        if (result.isAdmin) {
          navigate('/adminDashBoard');
        } else {
          navigate('/userDashBoard');
        }
      } else {
        alert(result);
      }
    } catch {
      alert("Something went wrong");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <input
        type="text"
        placeholder="Enter name"
        className="login-input"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="password"
        placeholder="Enter password"
        className="login-input"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="button" onClick={loggedIn} className="login-button">Login</button>
    </div>
  );
};

export default Login;

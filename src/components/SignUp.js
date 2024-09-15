import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


useEffect(()=>
{
    const auth=localStorage.getItem("user");
    if(auth)
    {
        navigate('/')
    }

})


    const collectData = async () => {
        let result = await fetch("http://127.0.0.1:5000/register", {
            method: 'Post',
            body: JSON.stringify({ name, email, password }),
            headers:
            {
                'Content-Type': 'application/json'
            }
        }
        )

        result = await result.json(); // Awaiting the JSON response

        if (result) {
            //saved  data  in localstorage  even  when refreshed  pg  should  not  be removed  from localstorage d
            localStorage.setItem("user",JSON.stringify(result))
            navigate('/')
        }
        console.log("resul_", result)
    }
    return (
        <div className="sign-up-container">
            <h1>Sign Up</h1>
            <input className="uname" type="text"
                value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter name" />
            <input className="uemail" type="text"
                value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter email" />
            <input className="upassword" type="password"
                value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter password" />
            <button className="sign-up-button" onClick={collectData}>Sign Up</button>
        </div>
    );
}

export default SignUp;

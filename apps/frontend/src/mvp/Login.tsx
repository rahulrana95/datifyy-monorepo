import React, { useState } from 'react';

const Login = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState();
    const [isVisible, setIsVisible] = useState(true);
    const handleEmail = (e: any) => {
        setName(e.target.value);
    }
    const handlePassword = (e: any) => {
        setPassword(e.target.value);
    }


    return (
        <div>{isVisible && <div className='signUp'>

            <form>
                <span className='cancel' onClick={() => setIsVisible(!isVisible)}>x</span>
                <label htmlFor="email">Phone or Email</label>
                <input type="text" id="email" name="email" value={name} onChange={(e) => handleEmail(e)} required /><br /><br />

                <label htmlFor="password">Password</label>
                <input type="password" id="name" name="name" value={password} onChange={(e) => handlePassword(e)} required /><br /><br />

                {name && password && <button type="submit" className="LoginButton">Login</button>}
            </form>
        </div>}</div>
    );
};

export default Login;

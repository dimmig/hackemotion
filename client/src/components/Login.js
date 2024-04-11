import React, {useState} from 'react';
import "../styles/login.css"
import {useNavigate} from "react-router-dom";
import eyeIcon from "../assets/eye-icon.png"
import Reveal from "../Reveal";
import axios from "axios";

function Login(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [loginErr, setLoginErr] = useState('')


    const navigate = useNavigate();
    const handleRegisterClick = () => {
        navigate('/register'); // Use the path you want to redirect to
    };

    const validateForm = () => {
        let formIsValid = true;
        let errors = {};

        if (!username) {
            formIsValid = false;
            errors["username"] = "*Please enter your username.";
        }

        if (password.length < 8 && !errors["password"]) {
            errors["password"] = '*Invalid Form, Password must contain greater than or equal to 8 characters.'
        }

        let countUpperCase = 0
        let countLowerCase = 0
        let countDigit = 0
        let countSpecialCharacters = 0

        for (let i = 0; i < password.length; i++) {
            const specialChars = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '-', '+', '=', '[', '{', ']', '}', ':', ';', '<', '>',]

            if (specialChars.includes(password[i])) {
                countSpecialCharacters++
            } else if (!isNaN(password[i] * 1)) {
                countDigit++
            } else {
                if (password[i] === password[i].toUpperCase()) {
                    countUpperCase++
                }
                if (password[i] === password[i].toLowerCase()) {
                    countLowerCase++
                }
            }
        }

        if (countLowerCase === 0 && !errors["password"]) {
            errors["password"] = '*Invalid Form, 0 lower case characters in password'
        }

        if (countUpperCase === 0 && !errors["password"]) {
            errors["password"] = '*Invalid Form, 0 upper case characters in password'
        }

        if (countDigit === 0 && !errors["password"]) {
            errors["password"] = '*Invalid Form, 0 digit characters in password'
        }

        if (countSpecialCharacters === 0 && !errors["password"]) {
            errors["password"] = '*Invalid Form, 0 special characters in password'
        }

        setErrors(errors);
        return formIsValid;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("Form submitted:", { username, password });
            try {
                const params = {
                    name: username,
                    password: password
                };
                const res = await axios.get(`http://localhost:3001/login-user`, {params});
                if (res.status !== 200) {
                    setLoginErr("Incorrect email or password")
                } else {
                    navigate("/quiz")
                }
            } catch (error) {
                setLoginErr("Incorrect email or password")
                console.error("There was an error fetching the FAQ data:", error);
            }
        }
    };

    return (
        <Reveal animationDuration={.6}>
            <div className="login">
                <p className="login-text">Log in</p>
            <form onSubmit={handleSubmit} noValidate className="form">
                <div className="form-group">
                    <label htmlFor="username">Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <div className="error">{errors.username}</div>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password:</label>
                    <div className="input-btn">
                    <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <img src={eyeIcon}  className="eye-icon"  alt="Eye icon" onClick={() =>  setShowPassword(prev => !prev)}/>

                    </div>
                    <div className="error">{errors.password}</div>
                </div>
                <div className="login-btn-block">
                    <button type="submit" className="submit-btn">Login</button>
                    <div className="register-block">
                        <p className="sub-text">Do not have an account yet?</p>
                        <p className="sub-text register" onClick={handleRegisterClick}>Register now!</p>
                    </div>
                <div className="error">{errors.password}</div>
            </div>
            <div className="login-btn-block">
                <button type="submit" className="submit-btn">Login</button>
                {loginErr.length > 0 && (
                    <p className="reg-err">{loginErr}</p>
                )}
                <div className="register-block">
                    <p className="sub-text">Do not have an account yet?</p>
                    <p className="sub-text register" onClick={handleRegisterClick}>Register now!</p>
                </div>
            </form>
            </div>
        </Reveal>
    );

}

export default Login;
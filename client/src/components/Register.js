import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import eyeIcon from "../assets/eye-icon.png";
import Reveal from "../Reveal";

function Register(props) {
    const [realName, setRealName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});

    const navigate = useNavigate();
    const handleLogin = () => {
        navigate('/login'); // Use the path you want to redirect to
    };

    const validateForm = () => {
        let formIsValid = true;
        let errors = {};

        if (!username) {
            formIsValid = false;
            errors["username"] = "*Please enter your username.";
        }

        if (!realName) {
            formIsValid = false;
            errors["realName"] = "*Please enter your real name.";
        }

        if (!birthYear || birthYear.length !== 4 || !/^\d{4}$/.test(birthYear) || birthYear < 1900 || birthYear >2024) {
            formIsValid = false;
            errors["birthYear"] = "*Please enter a valid birth year.";
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

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("Form submitted:", { username, password });
            // Here you can also call an API to submit the login details
        }
    };

    return (
        <Reveal animationDuration={.6}>
            <div className="login">
                <p className="login-text">Create your account</p>
                <form onSubmit={handleSubmit} noValidate className="form">
                    <div className="form-group">
                        <label htmlFor="realname">Your name:</label>
                        <input
                            type="text"
                            id="realname"
                            value={realName}
                            onChange={(e) => setRealName(e.target.value)}
                        />
                        <div className="error">{errors.realName}</div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="birthYear">Birth Year:</label>
                        <input
                            type="text"
                            id="birthYear"
                            value={birthYear}
                            onChange={(e) => setBirthYear(e.target.value)}
                        />
                        <div className="error">{errors.birthYear}</div>
            </div>
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
                            <img src={eyeIcon} className="eye-icon" alt="Eye icon"
                                onClick={() => setShowPassword(prev => !prev)}/>
                        </div>
                        <div className="error">{errors.password}</div>
                    </div>
                    <div className="login-btn-block">
                        <button type="submit" className="submit-btn">Register</button>
                        <div className="register-block">
                            <p className="sub-text">Already have an account?</p>
                            <p className="sub-text register" onClick={handleLogin}>Log in now!</p>
                        </div>
                    </div>
                </form>
            </div>
        </Reveal>
    );

}

export default Register;
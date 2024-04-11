import React, {useState} from "react";
import {useNavigate} from "react-router-dom";
import eyeIcon from "../assets/eye-icon.png";
import axios from "axios";

function Register(props) {
    const [realName, setRealName] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [birthYear, setBirthYear] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [gender, setGender] = useState('');
    const [residence, setResidence] = useState('')
    const [errors, setErrors] = useState({});
    const [registereErr, setRegisterErr] = useState('')

    const navigate = useNavigate();

    function hasNumber(myString) {
        return /\d/.test(myString);
    }
    const handleLogin = () => {
        navigate('/login'); // Use the path you want to redirect to
    };


    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    const handleResidenceChange = (event) => {
        setResidence(event.target.value);
    };


    const validateForm = () => {
        let formIsValid = true;
        let errors = {};

        if (!username) {
            formIsValid = false;
            errors["username"] = "*Please enter your username.";
        }

        if (!realName || hasNumber(realName)) {
            formIsValid = false;
            errors["realName"] = "*Please enter your real name.";
        }

        if (!gender) {
            formIsValid = false;
            errors["gender"] = "*Please select a gender";
        }
        if (residence.length === 0) {
            formIsValid = false;
            errors["residence"] = "*Please select a residence";
        }

        if (!birthYear || birthYear.length !== 4 || !/^\d{4}$/.test(birthYear) || birthYear < 1900 || birthYear >2024) {
            formIsValid = false;
            errors["birthYear"] = "*Please enter a valid birth year.";
        }

        if (password.length < 8 && !errors["password"]) {
            formIsValid = false;
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
            formIsValid = false;
            errors["password"] = '*Invalid Form, 0 lower case characters in password'
        }

        if (countUpperCase === 0 && !errors["password"]) {
            formIsValid = false;
            errors["password"] = '*Invalid Form, 0 upper case characters in password'
        }

        if (countDigit === 0 && !errors["password"]) {
            formIsValid = false;
            errors["password"] = '*Invalid Form, 0 digit characters in password'
        }

        if (countSpecialCharacters === 0 && !errors["password"]) {
            formIsValid = false;
            errors["password"] = '*Invalid Form, 0 special characters in password'
        }

        setErrors(errors);
        return formIsValid;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            console.log("Form submitted:", { realName,  username, password, birthYear, gender, residence });
            try {
                const res = await axios.post("http://localhost:3001/create-user", {realName, username, password, birthYear, gender, residence});
                if (res.status === 201) {
                    navigate("/quiz")
                } else {
                    setRegisterErr("Internal server error")
                }
            } catch (error) {
                setRegisterErr("User already exists")
                console.error("There was an error fetching the FAQ data:", error);
            }
        }
    };

    return (
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
                    <label className="sex-group">Sex: </label>
                    <select value={gender} onChange={e => handleGenderChange(e)} className="select">
                        <option value="" className="option">Please select</option>
                        <option value="Male" className="option">Male</option>
                        <option value="Female" className="option">Female</option>
                    </select>
                    <div className="error">{errors.gender}</div>
                    <hr className="hor-line"/>
                </div>
                <div className="form-group">
                    <label className="sex-group">Place of residence: </label>
                    <select value={residence} onChange={e => handleResidenceChange(e)} className="select">
                        <option value="" className="option">Please select</option>
                        <option value="village" className="option">Village</option>
                        <option value="small city" className="option">Small city</option>
                        <option value="average city" className="option">Average city</option>
                        <option value="big city" className="option">Big city</option>
                    </select>
                    <div className="error">{errors.residence}</div>
                    <hr className="hor-line"/>
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
                    {registereErr.length > 0 && (
                    <p className="reg-err"  >{registereErr}</p>
                    )}
                    <div className="register-block">
                        <p className="sub-text">Already have an account?</p>
                        <p className="sub-text register" onClick={handleLogin}>Log in now!</p>
                    </div>
                </div>
            </form>
        </div>
    );

}

export default Register;
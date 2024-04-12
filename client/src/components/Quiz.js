import React, {useEffect, useState} from 'react';
import "../styles/quiz.css"
import axios from "axios";
import logo from "../assets/logo.png";
import {useNavigate} from "react-router-dom";

function Quiz(props) {
    const [isTraining, setIsTraining] = useState(false);
    const [loggedInUser, setLoggedInUser] = useState(null);
    const [images, setImages] = useState([]);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [userAnswered, setUserAnswered] = useState(false);
    const [isCorrect, setIsCorrect] = useState(null);
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);
    const [correctAnswer, setCorrectAnswer] = useState('');
    const [correctAnswersCount, setCorrectAnswersCount] = useState(0)
    const [finished, setFinished] = useState(false); // State to determine if the quiz is finished
    const [incorrectAnswersCount, setIncorrectAnswersCount] = useState(0);
    const [startedAt, setStartedAt] = useState()
    const [recognizedEmotions, setRecognizedEmotions] = useState([])
    const [unrecognizedEmotions, setUnrecognizedEmotions] = useState([])

    const serverPathToImages = "/Users/dimagalagan/Documents/programing/hackemotion/client/public/emotions"
    const localPathToImages = "/emotions"
    const navigate = useNavigate()


    const getUserName = async () => {
        try {
            const token = localStorage.getItem('access-token');
            const res = await axios.get(`http://localhost:3001/logged-in-user`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            let username;
            if (res.data.userData.loginValue) {
                username = res.data.userData.loginValue
            } else if (res.data.userData.username) {
                username = res.data.userData.username
            }

            if (username) {
                setLoggedInUser(username)
                return username
            }
        } catch (error) {
            console.error("There was an error fetching the FAQ data:", error);
        }
    }

    const getUser = async (name) => {
        try {
            const params = {
                name
            }
            const res = await axios.get(`http://localhost:3001/get-user`, {params});
            if (res.data.length > 0 && res.data[0].userid) {
                return res.data[0]
            }
        } catch (error) {
            console.error("There was an error fetching the FAQ data:", error);
        }
    }


    useEffect(() => {
        const unrecognizedEmotions = images.filter(image => !recognizedEmotions.includes(image));
        setUnrecognizedEmotions(unrecognizedEmotions);

        async function handleSessionEnd() {
            if (finished && !isTraining) {
                // Persist unrecognized emotions for non-training sessions
                localStorage.setItem('unrecognizedEmotions', JSON.stringify(unrecognizedEmotions));
            }
        }
       async  function fetchSession() {
            if (finished) {
                const sessionId = await saveSession()
                console.log("SESSION ID ", sessionId)
                saveSessionResult(sessionId).catch(console.error)
                setCurrentImageIndex(0)
            }
        }fetchSession()
        handleSessionEnd()

    }, [finished, isTraining, images, recognizedEmotions]);

    useEffect(() => {
        async function setupTrainingSession() {
            if (isTraining) {
                const persistedUnrecognized = JSON.parse(localStorage.getItem('unrecognizedEmotions') || '[]');
                setUnrecognizedEmotions(persistedUnrecognized);
            }
        }
        setupTrainingSession();
    }, [isTraining]);

    const renderSummary =  () => {
        if (finished) {
            return (
                <div className="quiz-summary">
                    <img src={logo} alt="logo" onClick={() => navigate("/")} className="logo logo-login"/>
                    <h2>Quiz Summary</h2>
                    <p>Correct Answers: {correctAnswersCount}</p>
                    <p>Incorrect Answers: {incorrectAnswersCount}</p>
                    <button className="ans-button restart-session-btn" onClick={() => window.location.reload()}>Start
                        another session
                    </button>
                </div>
            );
        }
        return null;
    };

    const saveSession = async () => {
        const startTime = startedAt;
        const now = new Date();
        const endTime = now.toISOString().slice(0, 19).replace('T', ' ');
        const user = await getUser(loggedInUser)
        const age = 2024 - user.birthyear
        const typeOfSession = isTraining ? "training" : "diagnostic";
        const params ={
            startTime,
            endTime,
            age,
            typeOfSession,
            loggedInUser
        }
        try {
            const res = await axios.post(`http://localhost:3001/create-user-session`, params);
            if (res.status === 201) {
              return res.data.data.results.insertId
            }
        } catch (error) {
            console.error("There was an error fetching the FAQ data:", error);
        }
    }

    const saveSessionResult = async (sessionId) => {
        const now = new Date();
        const endTime = now.toISOString().slice(0, 19).replace('T', ' ');
        const params = {
            sessionId,
            recognizedEmotions,
            startedAt,
            endTime
        }
        try {
            const res = await axios.post(`http://localhost:3001/create-user-session-result`, params);
            if (res.status === 201) {
                return res.data.insertId
            }
        } catch (error) {
            console.error("There was an error fetching the FAQ data:", error);
        }
    }


    useEffect( () => {
        const now = new Date();
        const startTime = now.toISOString().slice(0, 19).replace('T', ' ');
        setStartedAt(startTime)
        async function fetchUser() {
            try {

                const userName = await getUserName()
                const params = {
                    email: userName,
                };
                const res = await axios.get(`http://localhost:3001/get-user-session`, {params});
                console.log(res.status)
                if(res.status === 200) {
                    setIsTraining(true)
                } else {
                    setIsTraining(false)
                }
            } catch (error) {
                console.error("There was an error fetching the FAQ data:", error);
            }
        }fetchUser()
        fetchImage()
    }, [])

    useEffect(() => {
        if (images.length > 0) {
            fillAnswers();
        }
    }, [images, currentImageIndex]);

    const fetchImage = async () => {
        try {
            const params = {
                dirPath: serverPathToImages
            }
            const res = await axios.get(`http://localhost:3001/get-emotion-images`, {params});
            if (res.status === 200) {
                setImages(res.data)
            }
        } catch (error) {
            console.error("There was an error fetching the emotion images:", error);
        }
    };


    const handleAnswer = async (answer) => {
        setIsButtonDisabled(true);
        const currentEmotion = images[currentImageIndex].split(".")[0].slice(0, -1); // Get the correct answer
        const isAnswerCorrect = answer === currentEmotion;
        setIsCorrect(isAnswerCorrect);
        setCorrectAnswer(currentEmotion);

        if (isAnswerCorrect) {
            setCorrectAnswersCount(correct => correct + 1);
            recognizedEmotions.push(images[currentImageIndex].split(".")[0])
            setRecognizedEmotions(recognizedEmotions)
        } else {
            setIncorrectAnswersCount(incorrect => incorrect + 1);
        }

        setUserAnswered(true);

        setTimeout(() => {
            if (currentImageIndex < images.length - 1) {
                setCurrentImageIndex(prevIndex => prevIndex + 1);
            } else {
                setFinished(true);
            }
            setUserAnswered(false);
            setIsCorrect(null);
            setIsButtonDisabled(false);
        }, 2000);
    };


    const handleButtonClick = async (e) => {
        const res = await handleAnswer(e.target.textContent)
            if(res !== -1) {
                return res
            }
    };

    function randomIntFromInterval(min, max) {
        return Math.floor(Math.random() * (max - min + 1) + min)
    }

    const fillAnswers = () => {
        const usedAnswers = new Set();
        const correctEmotion = images[currentImageIndex].split('.')[0].slice(0, -1);
        const buttons = [1, 2, 3, 4];

        const correctButtonIndex = randomIntFromInterval(1, 4);
        if (document.getElementById(`button-${correctButtonIndex}`) !== null) {
            document.getElementById(`button-${correctButtonIndex}`).textContent = correctEmotion;
        }
        usedAnswers.add(correctEmotion);

        const buttonsWithoutCorrect = buttons.filter(index => index !== correctButtonIndex);

        for (let i = 0; i < buttonsWithoutCorrect.length; i++) {
            let wrongAnswer = '';
            let potentialWrongEmotion = '';

            do {
                const randomImageIndex = randomIntFromInterval(0, images.length - 1);
                potentialWrongEmotion = images[randomImageIndex].split('.')[0].slice(0, -1);
            } while (usedAnswers.has(potentialWrongEmotion) || potentialWrongEmotion === correctEmotion);

            wrongAnswer = potentialWrongEmotion;
            if (document.getElementById(`button-${buttonsWithoutCorrect[i]}`) !== null)
            {
                document.getElementById(`button-${buttonsWithoutCorrect[i]}`).textContent = wrongAnswer;
            }
            usedAnswers.add(wrongAnswer); // Add the wrong answer to the Set of used answers
        }
    };

    const handleSignOut = () => {
        localStorage.removeItem('access-token');
        window.location.href = '/login';
    };

    return (
        <div className="quiz">
            <button className="ans-button logout-btn" onClick={handleSignOut}>Logout</button>
            {!isTraining ? (
                <>
                    {finished ? (
                        renderSummary()
                    ) : (
                        <div className="quiz-wrapper">
                            <h1 className="quiz-main-text">Welcome to your first diagnostic session, {loggedInUser}</h1>
                            {images.length > 0 && (
                                <>
                                    <img src={`${localPathToImages}/${images[currentImageIndex]}`} alt="Emotion"
                                         className="quiz-img"/>
                                    {userAnswered && (
                                        <div className={`answer-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
                                            {isCorrect ? 'Correct!' : `Incorrect. The correct answer is ${correctAnswer}.`}
                                        </div>
                                    )}
                                </>
                            )}
                            <div className="answer-buttons">
                                <div className="ans-but-col">
                                    <button className="ans-button" id="button-1" disabled={isButtonDisabled}
                                            onClick={e => handleButtonClick(e)}></button>
                                    <button className="ans-button" id="button-2" disabled={isButtonDisabled}
                                            onClick={e => handleButtonClick(e)}></button>
                                </div>
                                <div className="ans-but-col">
                                    <button className="ans-button" id="button-3" disabled={isButtonDisabled}
                                            onClick={e => handleButtonClick(e)}></button>
                                    <button className="ans-button" id="button-4" disabled={isButtonDisabled}
                                            onClick={e => handleButtonClick(e)}></button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            ) : (<>
                    {finished ? (
                        renderSummary()
                    ) : (
                        <div className="quiz-wrapper">
                            <h1 className="quiz-main-text">Welcome to your training session, {loggedInUser}</h1>
                            {unrecognizedEmotions.length > 0 && (
                                <>
                                    <img src={`${localPathToImages}/${unrecognizedEmotions[currentImageIndex]}`}
                                         alt="Emotion" className="quiz-img"/>
                                    {userAnswered && (
                                        <div className={`answer-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
                                            {isCorrect ? 'Correct!' : `Incorrect. The correct answer is ${correctAnswer}.`}
                                        </div>
                                    )}
                                </>
                            )}
                            <div className="answer-buttons">
                                <div className="ans-but-col">
                                    <button className="ans-button" id="button-1" disabled={isButtonDisabled}
                                            onClick={e => handleButtonClick(e)}></button>
                                    <button className="ans-button" id="button-2" disabled={isButtonDisabled}
                                            onClick={e => handleButtonClick(e)}></button>
                                </div>
                                <div className="ans-but-col">
                                    <button className="ans-button" id="button-3" disabled={isButtonDisabled}
                                            onClick={e => handleButtonClick(e)}></button>
                                    <button className="ans-button" id="button-4" disabled={isButtonDisabled}
                                            onClick={e => handleButtonClick(e)}></button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );

}

export default Quiz;
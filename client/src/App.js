import './App.css';
import Landing from "./components/Landing";
import { Routes, Route } from 'react-router-dom';
import Login from "./components/Login";
import Register from "./components/Register";
import Quiz from "./components/Quiz";
import {RequireAuth} from "react-auth-kit";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Landing />}/>
        <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Register />}/>
          <Route path="/quiz" element={<RequireAuth loginPath="/login"><Quiz /></RequireAuth>}/>
      </Routes>
  );
}

export default App;

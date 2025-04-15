import { useState } from "react";
import ProblemSet from "./ProblemSet";
import CodeInterface from "./CodeInterface";
import { BrowserRouter, Routes, Route } from "react-router-dom";


function App() {

  const [userToken, setUserToken] = useState("eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUk9MRV9DVVNUT01FUiIsInN1YiI6InNoaXZhMTIzIiwiaWF0IjoxNzQ0NzA5ODY3LCJleHAiOjE3NDQ3NDU4Njd9.HJwtrsST84o12Vlz-WaYDzgTkYmoN5vqi3AgKybZn7c");
  const [challengeIndex, setChallengeIndex] = useState(1);
  
  return (
    <BrowserRouter>
        <Routes>
              <Route path="/" element={<ProblemSet userToken={userToken} setChallengeIndex={setChallengeIndex} />} />
              <Route path="/problemset" element={<ProblemSet userToken={userToken} setChallengeIndex={setChallengeIndex} />} />
              <Route path="/problemset/:question" element={<CodeInterface userToken={userToken} challengeIndex={ challengeIndex } />} />
        </Routes>
    </BrowserRouter>

  );

}

export default App;

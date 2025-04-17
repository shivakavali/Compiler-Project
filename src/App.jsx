import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import ProblemSet from "./Components/ProblemSet";
import CodeInterface from "./Components/CodeInterface";
import SolvedProblems from "./Components/SolvedProblems";


function App() {

  const [userToken, setUserToken] = useState(
    "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUk9MRV9DVVNUT01FUiIsInN1YiI6InNoaXZhMTIzIiwiaWF0IjoxNzQ0ODY1NTgzLCJleHAiOjE3NDQ5MDE1ODN9.WiUaiPmLDEA-F6UQF4n0A4X-FUfJV6oyHrncdDId3Pk"
  );
  const [challengeIndex, setChallengeIndex] = useState(1);
  const [solvedQuestions, setsolvedQuestions] = useState([]);
  const [questionsData, setQuestionsData] = useState([]);
  const [questionNames, setQuestionNames] = useState([]);

  useEffect(() => {
    const getSolvedQuestions = async () => {
      try {
        const response = await axios.get(
          "https://capstone-1-y2mc.onrender.com/api/user/solvedQuestions",
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        console.log(response);
        setsolvedQuestions(response.data);
      } catch (e) {
        console.log("Error fetching Questions data:", e);
      }
    };
    const fetchQuestions = async () => {
      try {
        const response = await axios.get(
          "https://capstone-1-y2mc.onrender.com/api/allQuestionNames",
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setQuestionNames(response.data);
      } catch (err) {
        console.error(
          "Failed to fetch questions:",
          err.response?.data || err.message
        );
      }
    }

    getSolvedQuestions();
    fetchQuestions();
  }, []);

  useEffect(() => {
    async function fetchAllQuestions() {
      try {
        const promises = questionNames.map((_, index) =>
          axios.get(
            `https://capstone-1-y2mc.onrender.com/api/getQuestionById/${
              index + 1
            }`,
            {
              headers: {
                Authorization: `Bearer ${userToken}`,
              },
            }
          )
        );
        const responses = await Promise.all(promises);
        const allQuestions = responses.map((res) => res.data);

        setQuestionsData(allQuestions);
      } catch (e) {
        console.log("Error fetching questions:", e);
      }
    }

    fetchAllQuestions();
  }, [questionNames]);

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route
            path="/"
            element={
              <ProblemSet
              setChallengeIndex={setChallengeIndex}
              questionsData={questionsData}
              />
            }
          />
          <Route
            path="/problemset"
            element={
              <ProblemSet
              setChallengeIndex={setChallengeIndex}
                questionsData={questionsData}
              />
            }
          />
          <Route
            path="/problemset/:question"
            element={
              <CodeInterface
                userToken={userToken}
                solvedQuestions={solvedQuestions}
                questionNames={questionNames}
                setQuestionNames={questionNames}

              />
            }
          />
          <Route
            path="/solved-questions"
            element={
              <SolvedProblems
                questionsData={questionsData}
                solvedQuestions={solvedQuestions}
              />
            }
          ></Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </div>
  );
}

export default App;
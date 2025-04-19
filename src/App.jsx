import React from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import CodeInterface from "./Components/CodeInterface";
import "./App.css";
function App() {
  const [userToken, setUserToken] = useState(
    "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUk9MRV9DVVNUT01FUiIsInN1YiI6InNoaXZhMTIzIiwiaWF0IjoxNzQ1MDgyMDUwLCJleHAiOjE3NDUxMTgwNTB9.v2Kgt1m-exsLgWO5ZmaIRH8-1rpFv6zKXX8jDGkBnGc");
  
  const [challengeIndex, setChallengeIndex] = useState(1);
  const [questionsData, setQuestionsData] = useState([]);
  const [questionNames, setQuestionNames] = useState([]);

  useEffect(() => {

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
    };
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
      <CodeInterface
        userToken={userToken}
        challengeIndex={challengeIndex}
        questionNames={questionNames}
        setChallengeIndex={setChallengeIndex}
      />
      <ToastContainer />
    </div>
  );
}

export default App;

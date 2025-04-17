import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Typography, Paper, Box } from "@mui/material";
import { Navigate, useNavigate } from "react-router-dom";

const ProblemSet = ({setChallengeIndex, questionsData}) => {
  const navigate = useNavigate();

  const handleQuestion = (e) => {
    e.preventDefault();
    const index = e.currentTarget.getAttribute("data-index");
    let question = e.currentTarget.getAttribute("data-question");
    question = question.toLowerCase().replace(/\s+/g, "-");
    console.log(index, question);
    setChallengeIndex(index);
    localStorage.setItem("challenge-index", index);
    navigate(`/problemset/${question}`);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        🧠 Problem Set
      </Typography>
      <Paper>
        {questionsData.map((item, index) => (
          <Paper
            key={index}
            sx={{
              my: 2,
              transition: "0.3s",
              "&:hover": {
                transform: "scale(1.02)",
              },
            }}
          >
            <Paper
              elevation={3}
              data-index={index+1}
              data-question={item.questionName}
              onClick={(e) => handleQuestion(e)}
              sx={{
                display: "flex",
                flexDirection: "column",
                p: 1,
                my: 2,
                "&:hover": {
                  transform: "scale(1.02)",
                },
              }}
            >
              <Typography variant="h6" color="primary">
                {index+1}.{item.questionName}
              </Typography>

              <Box
                sx={{ display: "flex", justifyContent: "space-between", mt: 1 }}
              >
                <Typography sx={{ flex: 1 }} variant="body1">
                  {item.topics.join(", ")}
                </Typography>
                <Typography
                  sx={{ flex: 1, textAlign: "center" }}
                  variant="body1"
                >
                  {item.questionSource}
                </Typography>
                <Typography
                  sx={{ flex: 1, textAlign: "right" }}
                  variant="body1"
                >
                  {item.questionDifficulty}
                </Typography>
              </Box>
            </Paper>
          </Paper>
        ))}
      </Paper>
    </Container>
  );
};

export default ProblemSet;

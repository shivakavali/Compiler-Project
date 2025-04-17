import { Box, Typography, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";

const SolvedProblems = ({ questionsData, solvedQuestions }) => {

  const [solvedQuestionsData, setsolvedQuestionsData] = useState([])
  useEffect(() => {
    const solvedQuestionsData = questionsData.filter((q) =>
      solvedQuestions.includes(q.questionId)
    );
    setsolvedQuestionsData(solvedQuestionsData);
  }, [solvedQuestions, questionsData]);

  return (
    <Box>
      {solvedQuestionsData.map((question, i) => (
        <Paper key={i} sx={{display:"flex", justifyContent:"space-between", m: 2, p: 2 }}>
          <Typography variant="h6">
            {question.questionId}.{question.questionName}
          </Typography>
          <Box sx={{display:"flex", justifyContent:"space-between", gap:"2rem"}}>
            <Typography>Source: {question.questionSource}</Typography>
            <Typography>Difficulty: {question.questionDifficulty}</Typography>
          </Box>
        </Paper>
      ))}
    </Box>
  );
};

export default SolvedProblems;

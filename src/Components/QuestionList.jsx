import React from "react";
import { Box, Typography, MenuItem } from "@mui/material";
import './QuestionList.css';
const QuestionList = ({setChallengeIndex, questionNames, setShowQuestions }) => {

    const handleQuestion = (index) => {
        setChallengeIndex(index + 1);
        setShowQuestions(false);
    }
    const handleClose = () => {
        setShowQuestions(false);
    }
    return (
        <Box className="question-list-container">
            <Box className = "question-list-header-container">
                <Typography variant="h6" className="question-list-header">Questions</Typography>
                <Typography variant="p" className="question-list-close-button" onClick = {handleClose}>X</Typography>
            </Box>
            {questionNames?.map((question, index) => (
                <MenuItem className="question-list-name-header" key={index} onClick={()=>{handleQuestion(index)}}>
                    <Typography className="question-list-name">{index+1}.{question.questionName}</Typography>
                </MenuItem>
            ))}
        </Box>
    );
};

export default QuestionList;

import axios from "axios";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Box,
  Paper,
  Button,
  Typography,
  Select,
  MenuItem,
  Grid,
  TextField,
  ToggleButton,
} from "@mui/material";
import Editor from "@monaco-editor/react";
import arr from "./languages";
import QuestionList from "./QuestionList";
import './CodeInterface.css';

const CodeInterface = ({
  userToken,
  challengeIndex,
  questionNames,
  setChallengeIndex,
}) => {
  const [code, setCode] = useState("Your code goes here!");
  const [langID, setLangID] = useState("71");
  const [challenge, setChallenge] = useState({});
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const [showQuestions, setShowQuestions] = useState(false);

  useEffect(() => {
    const fetchQuestionById = async () => {
      try {
        const response = await axios.get(
          `https://capstone-1-y2mc.onrender.com/api/getQuestionById/${challengeIndex}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );
        setChallenge(response.data);
      } catch (e) {
        console.log("Error fetching question:", e);
      }
    };
    fetchQuestionById();
  }, [challengeIndex]);
  console.log(challenge);

  const parseOutput = (output) => {
    try {
      const parsed = JSON.parse(output?.trim());
      return parsed;
    } catch (err) {
      return output;
    }
  };

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

  const handleTestcasesRun = async () => {
    const testCases = Array.isArray(challenge.sampleTestCases)
      ? challenge.sampleTestCases
      : [];

    if (!testCases.length) {
      setError("No test cases found.");
      return;
    }

    const outputs = [];

    for (const testCase of testCases) {
      try {
        const response = await axios.post(
          "https://judge0-ce.p.rapidapi.com/submissions",
          {
            language_id: parseInt(langID),
            source_code: code,
            stdin: JSON.stringify(testCase.input),
          },
          {
            params: { base64_encoded: "false", wait: "true" },
            headers: {
              "Content-Type": "application/json",
              "x-rapidapi-key": "d6c75e6052msh8fbf3dd8c782bb3p1da22fjsn74676855c423",
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            },
          }
        );
        // console.log(response.data);
        const actual = parseOutput(response.data.stdout);
        const error = parseOutput(response.data.stderr);
        const expected = testCase.output;

        const isSuccess = JSON.stringify(actual) === JSON.stringify(expected);
        // console.log("actual output:", actual, " expected:", expected, " Error:", error, "  isSuccess:", isSuccess );

        outputs.push({
          input: testCase.input,
          expectedOutput: expected,
          actualOutput: actual ? actual : error,
          success: isSuccess,
          status: { description: isSuccess ? "Accepted" : "Wrong Answer" },
        });

        await sleep(1500);
      } catch (err) {
        outputs.push({
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput: null,
          success: false,
          error: err.message,
          status: { description: "Request Error" },
        });
      }
    }

    setOutput(outputs);
    setError(null);
  };

  const handleTestcasesSubmission = async () => {
    const testCases = Array.isArray(challenge.actualTestCases)
      ? challenge.actualTestCases
      : [];

    if (!testCases.length) {
      console.log()
      setError("No test cases found.");
    }

    const outputs = [];

    for (const testCase of testCases) {
      try {
        const response = await axios.post(
          "https://judge0-ce.p.rapidapi.com/submissions",
          {
            language_id: parseInt(langID),
            source_code: code,
            stdin: JSON.stringify(testCase.input),
          },
          {
            params: { base64_encoded: "false", wait: "true" },
            headers: {
              "Content-Type": "application/json",
              "x-rapidapi-key":
                "23129ead31msh0dc114176a49a8cp11cf50jsnb522c12cde7d",
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            },
          }
        );

        const actual = parseOutput(response.data.stdout);
        const expected = testCase.output;
        const isSuccess = JSON.stringify(actual) === JSON.stringify(expected);
        console.log("running API");

        if (!isSuccess) {
          outputs.push({
            input: testCase.input,
            expectedOutput: expected,
            actualOutput: actual,
            success: false,
            status: { description: "Wrong Answer" },
          });
          setOutput(outputs);
          return;
        }

        await sleep(1500);
      } catch (err) {
        outputs.push({
          input: testCase.input,
          expectedOutput: testCase.output,
          actualOutput: null,
          success: false,
          error: err.message,
          status: { description: "Request Error" },
        });
        setOutput(outputs);
        return;
      }
    }

    setOutput(outputs);
    toast.success("All test cases passed. Solution Accepted!");

    try {
      console.log("Sending to:", challengeIndex);
      console.log("Token:", userToken);

      const response = await axios.post(
        `https://capstone-1-y2mc.onrender.com/api/solved/${challengeIndex}`,
        null,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
            "Content-Type": "application/json",
          },
        }
      );
    } catch (err) {
      toast.error("⚠️ Failed to update solved question.");
      // console.error(err);
    }
    setError(null);
  };

  const handleShowQuestions = (index) => {
    setChallengeIndex(index);
    setShowQuestions(false);
  };
  return (
    <Box className="code-interface-container">
      
      <Box className="code-interface-header">
        <ToggleButton className="code-interface-toggle-button"  onClick={() => setShowQuestions(!showQuestions)}>{showQuestions ? "" : "Question list"}</ToggleButton>
        {showQuestions && <QuestionList setChallengeIndex={setChallengeIndex} questionNames={questionNames} setShowQuestions={setShowQuestions} />}
      </Box>
      <Box className="question-editor-section">
        <Paper className="question-section">
          <Box className="question-header">
            <Typography variant="h4" gutterBottom>{challenge.questionName}</Typography>
          </Box>
          <Typography className="question-desc" variant="body1" gutterBottom>{challenge.questionDescription}</Typography>
          {challenge.sampleTestCases?.map((test, index) => (
            <Box key={index} className="quetion-example-container">
              <Typography className="question-example" variant="h6">Example {index + 1}</Typography>
              <Typography className="question-details">Input: {JSON.stringify(test.input)}</Typography>
              <Typography className="question-details">Output: {JSON.stringify(test.output)}</Typography>
            </Box>
          ))}
          <Box className="question-difficulty">
            <Typography variant="h6">Difficulty</Typography>
            <Typography>{challenge.questionDifficulty}</Typography>
          </Box>
          <Box className="question-topics">
            <Typography variant="h6">Topics</Typography>
            <Typography>{challenge.topics?.join(", ")}</Typography>
          </Box>
        </Paper>
        

        {/* Right Panel */}
        <Box className="editor-section" flex={1} display="flex" flexDirection="column" p={2}>
          <Box className="code-interface-editor-header">
            <Typography variant="h6">Code Editor</Typography>
            <Select className="code-editor-lang-select" value={langID} onChange={(e) => setLangID(e.target.value)} size="small" >
              {arr.map((item) => (
                <MenuItem className="code-editor-lang-name" key={item.id} value={item.id}> {item.name} </MenuItem>
              ))}
            </Select>
          </Box>


          <Paper elevation={3} className="code-editor-text-field-paper">
            <Editor className="code-editor-text-field" height="50vh" defaultLanguage="python" value={code} onChange={(val) => setCode(val || "")} />
          </Paper>

          <Box className="editor-actions">
            <Button variant="outlined" color="secondary" onClick={handleTestcasesRun}> Run </Button>
            <Button variant="contained" color="primary" onClick={handleTestcasesSubmission}> Submit </Button>
          </Box>


          <Grid container spacing={2} mt={1}>
            {error ? (
              <Grid item xs={12}>
                <Typography className="error-title">Error</Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  multiline
                  minRows={4}
                  value={JSON.stringify(error, null, 2)}
                  className="error-textfield"
                />
              </Grid>
            ) : (
              output?.map((res, index) => (
                <Grid item xs={12} key={index}>
                  <Box className={`testcase-header ${res.success ? 'success-text' : 'error-text'}`}>
                    <Typography variant="subtitle1">Test Case {index + 1}</Typography>
                    <Typography>{res.status?.description || "Error"}</Typography>
                  </Box>
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    variant="outlined"
                    value={
                      Array.isArray(res.actualOutput)
                        ? `[${res.actualOutput.join(", ")}]`
                        : res.actualOutput ?? res.error
                    }
                    className={`testcase-output ${res.success ? 'success-bg' : 'error-bg'}`}
                  />
                </Grid>
              ))
            )}
          </Grid>

        </Box>
      </Box>
    </Box>
  );
};

export default CodeInterface;

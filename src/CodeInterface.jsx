import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Button,
  Typography,
  Select,
  MenuItem,
  Grid,
  TextField,
} from "@mui/material";
import Editor from "@monaco-editor/react";
import axios from "axios";
import arr from "./languages";

const CodeInterface = ({ userToken, challengeIndex }) => {
  const [code, setCode] = useState("Your code goes here!");
  const [langID, setLangID] = useState("71");
  const [challenge, setChallenge] = useState({});
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);

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
        console.log(response.data);
      } catch (e) {
        console.log("Error fetching question:", e);
      }
    };

    fetchQuestionById();
  }, [challengeIndex]);
  
  const parseOutput = (output) => {
    try {
      const parsed = JSON.parse(output?.trim());
      return parsed;
    } catch (err) {
      return output; // If it fails to parse, return the raw output
    }
  };
  

  const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

const handleBatchSubmission = async (isRealCases) => {
  const testCases = Array.isArray(
    isRealCases ? challenge.actualTestCases : challenge.sampleTestCases
  )
    ? isRealCases
      ? challenge.actualTestCases
      : challenge.sampleTestCases
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
            "x-rapidapi-key": "23129ead31msh0dc114176a49a8cp11cf50jsnb522c12cde7d",
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      const actual = parseOutput(response.data.stdout);
      const expected = testCase.output;

      const isSuccess = JSON.stringify(actual) === JSON.stringify(expected);
      const statusDesc = response.data.status?.description || "No Status";

      outputs.push({
        input: testCase.input,
        expectedOutput: expected,
        actualOutput: actual,
        success: isSuccess,
        status: { description: isSuccess ? "Accepted" : "Wrong Answer" }, // force override
      });

      await sleep(1500); // RATE LIMIT SAFETY

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


  return (
    <Box display="flex" sx={{ minHeight: "100vh", backgroundColor: "#f5f5f5" }}>
      {/* Left Panel */}
      <Box></Box>
      <Paper
        elevation={3}
        sx={{ width: "50%", p: 3, m: 2, borderRadius: 2, overflowY: "auto" }}
      >
        <Typography variant="h4" gutterBottom>
          {challenge.questionName}
        </Typography>
        <Typography variant="body1" gutterBottom>
          {challenge.questionDescription}
        </Typography>

        {challenge.sampleTestCases?.map((test, index) => (
          <Box key={index} mt={2} p={2} bgcolor="#f0f0f0" borderRadius={2}>
            <Typography variant="subtitle1" fontWeight="bold">
              Example {index + 1}
            </Typography>
            <Typography>Input: {JSON.stringify(test.input)}</Typography>
            <Typography>
              Expected Output: {JSON.stringify(test.output)}
            </Typography>
          </Box>
        ))}

        <Box mt={3}>
          <Typography variant="h6">Difficulty</Typography>
          <Typography>{challenge.questionDifficulty}</Typography>
        </Box>

        <Box mt={2}>
          <Typography variant="h6">Topics</Typography>
          <Typography>{challenge.topics?.join(", ")}</Typography>
        </Box>
      </Paper>

      {/* Right Panel */}
      <Box flex={1} display="flex" flexDirection="column" p={2}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={2}
        >
          <Typography variant="h6">Code Editor</Typography>
          <Select
            value={langID}
            onChange={(e) => setLangID(e.target.value)}
            size="small"
          >
            {arr.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </Box>

        <Paper elevation={3} sx={{ flex: 1, p: 1, mb: 2, borderRadius: 2 }}>
          <Editor
            height="50vh"
            defaultLanguage="python"
            value={code}
            onChange={(val) => setCode(val || "")}
          />
        </Paper>

        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => handleBatchSubmission(false)}
          >
            Run
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleBatchSubmission(true)}
          >
            Submit
          </Button>
        </Box>

        <Grid container spacing={2} mt={1}>
          {error ? (
            <Grid item xs={12}>
              <Typography color="error" fontWeight="bold">
                Error
              </Typography>
              <TextField
                fullWidth
                variant="outlined"
                multiline
                minRows={4}
                value={JSON.stringify(error, null, 2)}
              />
            </Grid>
          ) : (
            output?.map((res, index) => (
              <Grid item xs={12} key={index}>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  sx={{
                    color: res.success ? "green" : "red",
                  }}
                >
                  <Typography variant="subtitle1">
                    Test Case {index + 1}
                  </Typography>
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
                  sx={{
                    backgroundColor: res.success ? "#e6ffe6" : "#ffe6e6",
                    borderRadius: 1,
                  }}
                />
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default CodeInterface;

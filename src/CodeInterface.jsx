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

const CodeInterface = () => {
  const [code, setCode] = useState("Your code goes here!");
  const [langID, setLangID] = useState("71");
  const [challengeIndex, setChallengeIndex] = useState(1);
  const [challenge, setChallenge] = useState(1);
  const [output, setOutput] = useState(null);
  const [error, setError] = useState(null);
  const [questions, setQuestions] = useState([]);

  Array.from(document.styleSheets).forEach((sheet) => {
    try {
      const rules = sheet.cssRules;
    } catch (e) {}
  });

  useEffect(() => {
    async function fetchQuestions() {
      try {
        const response = await axios.get(
          "https://capstone-1-y2mc.onrender.com/api/allQuestionNames",
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUk9MRV9DVVNUT01FUiIsInN1YiI6InNoaXZhMTIzIiwiaWF0IjoxNzQzODU5NDQ0LCJleHAiOjE3NDM4NjMwNDR9.Lq04qq5zdjz1RguIndrqEMrerFBeQwxcGR5P5omGZZA",
            },
          }
        );
        setQuestions(response.data);
      } catch (err) {
        console.error(
          "Failed to fetch questions:",
          err.response?.data || err.message
        );
      }
    }

    fetchQuestions();
  }, []);

  useEffect(() => {
    const fetchQuestionById = async () => {
      try {
        const response = await axios.get(
          `https://capstone-1-y2mc.onrender.com/api/getQuestionById/${challengeIndex}`,
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUk9MRV9DVVNUT01FUiIsInN1YiI6InNoaXZhMTIzIiwiaWF0IjoxNzQzODU5NDQ0LCJleHAiOjE3NDM4NjMwNDR9.Lq04qq5zdjz1RguIndrqEMrerFBeQwxcGR5P5omGZZA",
            },
          }
        );
        setChallenge(response.data);
      } catch (e) {
        console.log("Error fetching question:", e);
      }
    };

    fetchQuestionById();
  }, [questions]);

  const handleBatchSubmission = async (isRealTest) => {
    let testCases = [];
  
    if (isRealTest) {
      if (
        Array.isArray(challenge.actualTestCaseInput) &&
        Array.isArray(challenge.actualTestCaseOutput)
      ) {
        testCases = challenge.actualTestCaseInput.map((input, idx) => ({
          input,
          expectedOutput: challenge.actualTestCaseOutput[idx],
        }));
      } else {
        console.warn("No actual test cases found!");
        setError("No actual test cases available.");
        return;
      }
    } else {
      testCases = challenge.sampleTestCases || [];
    }
  
    const outputs = [];
    console.log("Running test cases:", testCases);
  
    for (const test of testCases) {
      try {
        const submissionRes = await axios.post(
          `https://judge0-ce.p.rapidapi.com/submissions`,
          {
            language_id: langID,
            source_code: btoa(code),
            stdin: btoa(JSON.stringify(test.input)),
            expected_output: btoa(
              JSON.stringify(test.output || test.expectedOutput || "")
            ),
          },
          {
            params: { base64_encoded: "true" },
            headers: {
              "x-rapidapi-key":
                "f733164b1dmshf2aa007b023b489p1ee2f8jsnf7d0d6311ed3",
              "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
              "Content-Type": "application/json",
            },
          }
        );
  
        const token = submissionRes.data.token;
  
        let result = null;
        while (!result || result.status?.id <= 2) {
          const res = await axios.get(
            `https://judge0-ce.p.rapidapi.com/submissions/${token}`,
            {
              params: {
                base64_encoded: "false",
                fields: "*",
              },
              headers: {
                "x-rapidapi-key":
                  "f733164b1dmshf2aa007b023b489p1ee2f8jsnf7d0d6311ed3",
                "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
              },
            }
          );
          result = res.data;
          console.log(result);
          if (result.status?.id <= 2)
            await new Promise((r) => setTimeout(r, 1500));
        }
  
        outputs.push(result);
      } catch (err) {
        outputs.push({ error: err.message });
      }
    }
    console.log(outputs);
    setOutput(outputs);
    setError(null);
  };
  
  return (
    <Box display="flex" sx={{ minHeight: "100vh" }}>
      <Paper elevation={3} sx={{ width: "50%", p: 3, overflowY: "auto" }}>
        <Typography variant="h4" gutterBottom>
          {challenge.questionName}
        </Typography>
        <Typography variant="body1">{challenge.questionDescription}</Typography>

        

        {challenge.sampleTestCases &&
          challenge.sampleTestCases.map((test, index) => (
            <Box key={index} mt={2}>
              <Typography variant="subtitle1">Example {index + 1}</Typography>
              <Typography>Input: {JSON.stringify(test.input)}</Typography>
              <Typography>
                Expected Output: {JSON.stringify(test.output)}
              </Typography>
            </Box>
          ))}

        <Box mt={2}>
          <Typography variant="h6">Difficulty</Typography>
          <Typography>{challenge.questionDifficulty}</Typography>
        </Box>

        <Box mt={2}>
          <Typography variant="h6">Topics</Typography>
          <Typography>{challenge.topics?.join(", ")}</Typography>
        </Box>
      </Paper>

      <Box flex={1} display="flex" flexDirection="column" p={2}>
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">Code Editor</Typography>
          <Select value={langID} onChange={(e) => setLangID(e.target.value)}>
            {arr.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Paper elevation={3} sx={{ flex: 1, p: 1, mb: 2 }}>
          <Editor
            height="50vh"
            defaultLanguage="python"
            value={code}
            onChange={(val) => setCode(val || "")}
          />
        </Paper>
        <Box display="flex" justifyContent="space-between">
          <Button
            variant="contained"
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

        <Grid container spacing={1} mt={2}>
          {error ? (
            <Grid item xs={12}>
              <Typography color="error">Error</Typography>
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
                <Box display="flex" justifyContent="space-between" sx={{ color: `${(res.status.id == 4) ? "#B22222" : "#d4edda"}` }}>
                <Typography variant="subtitle1">
                  Test Case {index + 1}
                </Typography>
                <Typography>{ res.status.description}</Typography>
                </Box>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  variant="outlined"
                  value={res.stdout || res.stderr}
                  sx={{
                    backgroundColor: res.status == 3 ? "#d4edda" : "#f8d7da",
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

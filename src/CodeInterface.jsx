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
        // console.log(response.data);
      } catch (e) {
        console.log("Error fetching question:", e);
      }
    };

    fetchQuestionById();
  }, [challengeIndex]);

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
    // console.log(outputs);
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
            // value={code}
            value=""
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
                    color: res.status.id === 4 ? "error.main" : "success.main",
                  }}
                >
                  <Typography variant="subtitle1">
                    Test Case {index + 1}
                  </Typography>
                  <Typography>{res.status.description}</Typography>
                </Box>
                <TextField
                  fullWidth
                  multiline
                  minRows={2}
                  variant="outlined"
                  value={res.stdout || res.stderr}
                  sx={{
                    backgroundColor:
                      res.status.id === 3 ? "#e6ffe6" : "#ffe6e6",
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

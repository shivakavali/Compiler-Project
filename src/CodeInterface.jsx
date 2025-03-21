import React, { useContext, useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Paper,
  Button,
  TextField,
  Grid,
  Select,
  MenuItem,
} from "@mui/material";
import Editor from "@monaco-editor/react";
import axios from "axios";
import arr from "./languages";
import Challenges from "./Challenges";
const CodeInterface = () => {
    // "f733164b1dmshf2aa007b023b489p1ee2f8jsnf7d0d6311ed3"
  const [code, setCode] = useState("// Write your code here\n");
  const [submissionkey, setSubmissionKey] = useState("");
  const [APIKey, setAPIKey] = useState(
    "f733164b1dmshf2aa007b023b489p1ee2f8jsnf7d0d6311ed3"
  );
  const [langID, setLangID] = useState("62");
  const [challegeIndex, setChallengeIndex] = useState("2");
  const [challenge, setChallenge] = useState(Challenges[challegeIndex]);
  const [output, setOutput] = useState(null);
  const [error, updateError] = useState(null);

  useEffect(() => {
    console.log(code);
  }, [code]);

  const handleCodeSubmit = async () => {
    try {
      // First API call - Submit the code
      const response = await axios.post(
        "https://judge029.p.rapidapi.com/submissions",
        {
          source_code: code,
          language_id: langID,
          stdin: challenge.input,
          expected_output: challenge.output,
          wait: "false",
        },
        {
          headers: {
            "x-rapidapi-key": APIKey,
            "x-rapidapi-host": "judge029.p.rapidapi.com",
            "Content-Type": "application/json",
            "useQueryString": true, // Important for RapidAPI requests
          },
        }
      );
  
      const token = response.data.token;
      setSubmissionKey(token);
      console.log("Submission Token:", token);
  
      // Wait for 2 seconds before fetching output (to allow processing)
      await new Promise((resolve) => setTimeout(resolve, 2000));
  
      // Second API call - Fetch submission result
      const outputResponse = await axios.get(
        `https://judge029.p.rapidapi.com/submissions/${token}`,
        {
          headers: {
            "x-rapidapi-key": APIKey,
            "x-rapidapi-host": "judge029.p.rapidapi.com",
            "useQueryString": true, // Important for RapidAPI requests
          },
        }
      );
  
      if (outputResponse.data.stdout) {
        setOutput(outputResponse.data.stdout);
      } else {
        updateError({
          errorMessage: outputResponse.data.status.description,
          stderr: outputResponse.data.stderr,
          compile_output: outputResponse.data.compile_output,
        });
      }
    } catch (e) {
      console.error("Error submitting code:", e);
    }
  };
  
  console.log(`${output.trim()}, ${challenge.output.trim()}, ${output.trim() === challenge.output.trim()}`);

  const getHeadingColor = () => {
    if (output?.trim() === challenge.output?.trim()) return "green";
    else if (output) return "red";
    return "inherit";
  };
  

  return (
    <Box display="flex" sx={{ minHeight: "100vh" }}>
      {/* Left Section - Question */}
      <Paper elevation={3} sx={{ width: "50%", p: 3, overflowY: "auto" }}>
        <Typography variant="h4" gutterBottom>
          {challenge.Heading}
        </Typography>
        <Typography variant="body1" className="c">
          <Typography variant="p">{challenge.Statement}</Typography>
          <Box className="challenge-input-format">
            <Typography variant="h6">Input Format</Typography>
            <Typography variant="p">{challenge.sampleInputFormat}</Typography>
          </Box>
          <Box className="challenge-output-format">
            <Typography variant="h6">Output Format</Typography>
            <Typography variant="p">{challenge.sampleInputFormat}</Typography>
          </Box>
          <Box className="challenge-input">
            <Typography variant="h6">Input</Typography>
            <Typography variant="p">{challenge.input}</Typography>
          </Box>
          <Box className="challenge-output">
            <Typography variant="h6">Output</Typography>
            <Typography variant="p">{challenge.output}</Typography>
          </Box>
        </Typography>
      </Paper>

      {/* Right Section - Code Editor */}
      <Box flex={1} display="flex" flexDirection="column" p={2}>
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Typography variant="h6">Code Editor</Typography>
          <Select value={langID} onChange={(e) => setLangID(e.target.value)}>
            {arr.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Paper elevation={3} sx={{ flex: 1, p: 1, mb: 1 }}>
          <Editor
            height="50vh"
            defaultLanguage="java"
            value={code || ""}
            onChange={(val) => setCode(val || "")}
          />
        </Paper>
        <Button
          variant="contained"
          color="primary"
          sx={{ alignSelf: "flex-end" }}
          onClick={handleCodeSubmit}
        >
          Submit
        </Button>
        {/* Input/Output Section */}
        <Grid container spacing={1} mt={1}>
          {/* Test Case Heading */}
          <Typography variant="h5">
            Test Case
          </Typography>

          {/* Input Section */}
          <Grid item xs={12}>
            <Typography variant="h6">
              Input
            </Typography>
            <TextField
              fullWidth
              variant="outlined"
              multiline
              value={challenge.input}
            />
          </Grid>

          {/* Conditional Rendering: Show Output/Error */}
          {error ? (
            <Grid item xs={12}>
              <Typography variant="h6">Error</Typography>
              <TextField
                fullWidth
                variant="outlined"
                multiline
                minRows={4}
                value={`Error: ${error.errorMessage}\n\n${
                  error.compile_output || error.stderr
                }`}
                sx={{ borderColor: "red" }} // Error styling
              />
            </Grid>
          ) : (
            <>
              {/* Output Section */}
              <Grid item xs={6}>
                <Typography variant="h6" sx={{ color  : getHeadingColor() }}>
                  Output
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={output}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderColor: getHeadingColor(),
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: getHeadingColor(),
                    },
                    "& .MuiInputBase-input": {
                      color: getHeadingColor(),
                    },
                  }}
                />
              </Grid>

              {/* Expected Output Section */}
              <Grid item xs={6}>
                <Typography variant="h6" sx={{ color: getHeadingColor() }}>
                  Expected Output
                </Typography>
                <TextField
                  fullWidth
                  variant="outlined"
                  value={challenge.output}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderColor: getHeadingColor(),
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: getHeadingColor(),
                    },
                    "& .MuiInputBase-input": {
                      color: getHeadingColor(),
                    },
                  }}
                />
              </Grid>
            </>
          )}
        </Grid>
      </Box>
    </Box>
  );
};

export default CodeInterface;

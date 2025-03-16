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
import { Context } from "./Context";
import arr from "./languages";

const CodeInterface = () => {
  const {
    code,
    setCode,
    APIKey,
    submissionurl,
    submissionkey,
    setSubmissionKey,
    langID,
    setLangID,
  } = useContext(Context);

  useEffect(() => {
    console.log(code);
  }, [code]);

  const handleCodeSubmit = async () => {
    try {
      const response = await axios.post(
        submissionurl,
        {
          source_code: code,
          language_id: langID,
          stdin: "Hello",
          expected_output: "Hello",
          base64_encoded: "true",
          wait: "false",
        },
        {
          headers: {
            "x-rapidapi-key": APIKey,
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
            "Content-Type": "application/json",
          },
        }
      );

      setSubmissionKey(response.data.token);

      const output = await axios.get(
        `${submissionurl}/${response.data.token}`,
        {
          headers: {
            "x-rapidapi-key": APIKey,
            "x-rapidapi-host": "judge0-ce.p.rapidapi.com",
          },
        }
      );

      console.log(output.data);
    } catch (e) {
      console.error("Error submitting code:", e);
    }
  };

  return (
    <Box display="flex" sx={{ minHeight: "100vh" }}>
      {/* Left Section - Question */}
      <Paper elevation={3} sx={{ width: "40%", p: 3, overflowY: "auto" }}>
        <Typography variant="h4" gutterBottom>
          Question Section
        </Typography>
        <Typography variant="body1">
          // Your problem description goes here
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
          <Grid item xs={12}>
            <Typography variant="h6">Input</Typography>
            <TextField fullWidth variant="outlined" multiline />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Output</Typography>
            <TextField fullWidth variant="outlined" disabled />
          </Grid>
          <Grid item xs={6}>
            <Typography variant="h6">Expected Output</Typography>
            <TextField fullWidth variant="outlined" disabled />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default CodeInterface;

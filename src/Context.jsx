import React, { useState, createContext } from "react";

const Context = createContext();

const ContextStore = ({ children }) => {
    const [code, setCode] = useState("// Write your code here\n");
    const [submissionurl, setSubmissionUrl] = useState("https://judge029.p.rapidapi.com/submissions");
    const [submissionkey, setSubmissionKey] = useState("");
    const [APIKey, setAPIKey] = useState("f733164b1dmshf2aa007b023b489p1ee2f8jsnf7d0d6311ed3");
    const [langID, setLangID] = useState("54");

  return (
      <Context.Provider value={{
          code, setCode,
          submissionurl, setSubmissionUrl,
          APIKey, setAPIKey,
          submissionkey, setSubmissionKey,
          langID, setLangID
      }}>
      {children}
    </Context.Provider>
  );
};

export default ContextStore;
export { Context };

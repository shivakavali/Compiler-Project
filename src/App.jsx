import CodeInterface from "./CodeInterface";
import ContextStore from "./Context";

function App() {
  return (
    <>
      <ContextStore>
        <CodeInterface />
      </ContextStore>
    </>
  );
}

export default App;

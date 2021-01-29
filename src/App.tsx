import Routes from "./routes";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

function App() {
  return (
    <div className="App">
      <Routes />
    </div>
  );
}

export default App;

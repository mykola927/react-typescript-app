import SignUp from "./views/SignUp";

import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";

function App() {
  return (
    <div className="App">
      <SignUp />
    </div>
  );
}

export default App;

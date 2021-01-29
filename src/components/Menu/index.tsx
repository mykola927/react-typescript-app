import React from "react";
import { auth } from "../../firebase";

export default function Menu() {
  return (
    <>
      <header>
        <button onClick={() => console.log(auth.currentUser)}>get user</button>
        <button onClick={() => auth.signOut()}>sign out user</button>
      </header>
    </>
  );
}

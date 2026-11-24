import React, { useState } from "react";
import { getSession, logOut } from "./auth.js";
import Auth from "./components/Auth.jsx";
import Dashboard from "./components/Dashboard.jsx";

export default function App() {
  const [user, setUser] = useState(() => getSession());

  const handleLogout = () => {
    logOut();
    setUser(null);
  };

  return user ? (
    <Dashboard key={user} username={user} onLogout={handleLogout} />
  ) : (
    <Auth onAuthenticated={setUser} />
  );
}

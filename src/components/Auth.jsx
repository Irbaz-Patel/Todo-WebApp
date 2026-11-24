import React, { useState } from "react";
import { CheckSquare } from "lucide-react";
import { logIn, signUp } from "../auth.js";
import ThemeToggle from "./ThemeToggle.jsx";

const input =
  "w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-900 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gray-900/20 dark:focus:ring-white/20 focus:border-gray-900 dark:focus:border-gray-400";

export default function Auth({ onAuthenticated }) {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const isLogin = mode === "login";

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const name = isLogin
        ? await logIn(username, password)
        : await signUp(username, password);
      onAuthenticated(name);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };

  const switchMode = () => {
    setMode(isLogin ? "signup" : "login");
    setError("");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-10 sm:py-16 relative">
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6">
        <ThemeToggle />
      </div>

      <div className="w-full max-w-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl shadow-sm p-8">
        <div className="flex items-center gap-2 mb-1">
          <CheckSquare className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Todo App</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          {isLogin ? "Log in to manage your tasks." : "Create an account to get started."}
        </p>

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="username">
              Username
            </label>
            <input
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              className={input}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isLogin ? "current-password" : "new-password"}
              className={input}
            />
          </div>

          {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-gray-900 text-white dark:bg-white dark:text-gray-900 text-sm font-medium rounded-lg py-2.5 hover:bg-gray-800 dark:hover:bg-gray-200 disabled:opacity-60"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-6">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            type="button"
            onClick={switchMode}
            className="text-gray-900 dark:text-gray-100 font-medium underline underline-offset-2"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </p>
      </div>
    </div>
  );
}

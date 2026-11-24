// Simple localStorage-backed auth. Demo only: not secure for production use.
const USERS_KEY = "todo_users";
const SESSION_KEY = "todo_session";

async function hash(text) {
  try {
    const data = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  } catch {
    return btoa(text); // fallback when SubtleCrypto is unavailable
  }
}

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || [];
  } catch {
    return [];
  }
}

export function getSession() {
  return localStorage.getItem(SESSION_KEY);
}

export async function signUp(username, password) {
  const name = username.trim();
  if (!name || !password) throw new Error("Username and password are required.");
  if (password.length < 4) throw new Error("Password must be at least 4 characters.");
  const users = readUsers();
  if (users.some((u) => u.username.toLowerCase() === name.toLowerCase())) {
    throw new Error("That username is already taken.");
  }
  users.push({ username: name, password: await hash(password) });
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
  localStorage.setItem(SESSION_KEY, name);
  return name;
}

export async function logIn(username, password) {
  const name = username.trim();
  const user = readUsers().find((u) => u.username.toLowerCase() === name.toLowerCase());
  if (!user || user.password !== (await hash(password))) {
    throw new Error("Invalid username or password.");
  }
  localStorage.setItem(SESSION_KEY, user.username);
  return user.username;
}

export function logOut() {
  localStorage.removeItem(SESSION_KEY);
}

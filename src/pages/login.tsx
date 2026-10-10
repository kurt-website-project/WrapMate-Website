import { useState } from "react";
import { login, type WrapMateUser } from "@/auth/auth";

type LoginProps = {
  onLogin: (user: WrapMateUser) => void;
};

export default function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const user = login(username.trim(), password);

    if (!user) {
      setError("Username or password is incorrect. Please try again.");
      return;
    }

    setError("");
    onLogin(user);
  }

  return (
    <div className="wrapmate-login-page">
      <div className="wrapmate-login-brand">
        <img src="/logo-mark.png" alt="WrapMate logo" className="wrapmate-logo-mark"/>
        <span>WrapMate</span>
      </div>

      <main className="wrapmate-login-card">
        <h1>Welcome back</h1>
        <p className="wrapmate-muted">
          Log in to manage packaging orders.
        </p>

        <form onSubmit={handleSubmit} className="wrapmate-login-form">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />

          {error && (
            <p className="wrapmate-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="wrapmate-primary-button">
            Log in
          </button>
        </form>

        <p className="wrapmate-muted wrapmate-hint">
          Prototype accounts: <strong>operator</strong> / operator123 or{" "}
          <strong>admin</strong> / admin123
        </p>
      </main>
    </div>
  );
}

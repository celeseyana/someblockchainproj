import "bulma/css/bulma.min.css";
import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const endpoint = isSignUp ? "/signup" : "/login";
      const requestBody = isSignUp
        ? { username, password, role }
        : { username, password };

      // Password confirmation validation for signup
      if (isSignUp && password !== confirmPassword) {
        alert("Passwords do not match!");
        setIsLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        alert(data.message);
        if (!isSignUp) {
          console.log("User logged in:", data.user);
        } else {
          setUsername("");
          setPassword("");
          setConfirmPassword("");
          setRole("");
        }
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Connection error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css"
      />

      <div className="hero is-fullheight">
        <div className="hero-body">
          <div className="container">
            <div className="columns is-centered">
              <div className="column is-5-tablet is-4-desktop is-3-widescreen">
                <div
                  className="box"
                  style={{
                    backgroundColor: "#2a2a2a",
                    border: "1px solid #444",
                    boxShadow: "0 2px 8px rgba(255, 255, 255, 0.08)",
                    borderRadius: "8px",
                  }}
                >
                  <div className="has-text-centered mb-5">
                    <h1 className="title is-3 has-text-white">FoodChain</h1>
                    <h2 className="has-text-grey-light has-text-weight-bold is-4">
                      {isSignUp ? "Register" : "Login"}
                    </h2>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="field">
                      <label className="label has-text-white">Username</label>
                      <div className="control has-icons-left">
                        <input
                          className="input"
                          type="text"
                          placeholder="Enter your username"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          required
                        />
                        <span className="icon is-small is-left">
                          <i className="fas fa-user"></i>
                        </span>
                      </div>
                    </div>

                    <div className="field">
                      <label className="label has-text-white">Password</label>
                      <div className="control has-icons-left">
                        <input
                          className="input"
                          type="password"
                          placeholder="Enter your password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required
                        />
                        <span className="icon is-small is-left">
                          <i className="fas fa-lock"></i>
                        </span>
                      </div>
                    </div>

                    {isSignUp && (
                      <>
                        <div className="field">
                          <label className="label has-text-white">
                            Confirm Password
                          </label>
                          <div className="control has-icons-left">
                            <input
                              className="input"
                              type="password"
                              placeholder="Confirm your password"
                              value={confirmPassword}
                              onChange={(e) =>
                                setConfirmPassword(e.target.value)
                              }
                              required
                            />
                            <span className="icon is-small is-left">
                              <i className="fas fa-lock"></i>
                            </span>
                          </div>
                        </div>

                        <div className="field">
                          <label className="label has-text-white">Role</label>
                          <div className="control">
                            <div className="select is-fullwidth">
                              <select
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                              >
                                <option value="" disabled>
                                  Select role
                                </option>
                                <option value="customer">Customer</option>
                                <option value="manufacturer">
                                  Manufacturer
                                </option>
                                <option value="supplier">Supplier</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="field mt-6">
                      <div className="control">
                        <button
                          className={`button is-link is-fullwidth ${
                            isLoading ? "is-loading" : ""
                          }`}
                          disabled={isLoading}
                        >
                          {isSignUp ? "Sign Up" : "Sign In"}
                        </button>
                      </div>
                    </div>
                  </form>

                  <hr style={{ backgroundColor: "#444" }} />

                  <div className="has-text-centered">
                    <p className="is-size-7 has-text-grey-light">
                      {isSignUp ? (
                        <>
                          Already have an account?{" "}
                          <a
                            href="#"
                            className="has-text-info has-text-weight-semibold"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsSignUp(false);
                            }}
                          >
                            Sign in
                          </a>
                        </>
                      ) : (
                        <>
                          New to FoodChain?{" "}
                          <a
                            href="#"
                            className="has-text-info has-text-weight-semibold"
                            onClick={(e) => {
                              e.preventDefault();
                              setIsSignUp(true);
                            }}
                          >
                            Sign up
                          </a>
                        </>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

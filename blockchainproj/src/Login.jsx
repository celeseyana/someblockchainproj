import 'bulma/css/bulma.min.css';
import { useState } from 'react';

export default function LoginPage() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    setTimeout(() => {
      console.log('Login attempt:', { username, password });
      setIsLoading(false);
    }, 1500);
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
                    backgroundColor: '#2a2a2a',
                    border: '1px solid #444',
                    boxShadow: '0 2px 8px rgba(255, 255, 255, 0.08)',
                    borderRadius: '8px',
                  }}
                >
                  <div className="has-text-centered mb-5">
                    <h1 className="title is-3 has-text-white">FoodChain</h1>
                  </div>

                  <form onSubmit={handleLogin}>
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

                    <div className="field">
                      <div className="control">
                        <button
                          className={`button is-link is-fullwidth ${isLoading ? 'is-loading' : ''}`}
                          disabled={isLoading}
                        >
                          Sign In
                        </button>
                      </div>
                    </div>
                  </form>

                  <div className="has-text-centered mt-4">
                    <a href="#" className="has-text-info is-size-7">
                      Forgot your password?
                    </a>
                  </div>

                  <hr style={{ backgroundColor: '#444' }} />

                  <div className="has-text-centered">
                    <p className="is-size-7 has-text-grey-light">
                      New to FoodChain?{' '}
                      <a href="#" className="has-text-info has-text-weight-semibold">
                        Sign up
                      </a>
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

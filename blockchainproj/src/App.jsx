import "bulma/css/bulma.min.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
} from "react-router-dom";
import Home from "./Home";
import Page2 from "./page2";
import Page3 from "./page3";
import LoginPage from "./Login";
import SignUp from "./SignUp";

function AppContent() {
  const location = useLocation();
  const hideNavbar =
    location.pathname === "/login" || location.pathname === "/signup";
  const username = localStorage.getItem('username');

  return (
    <div className="section" style={{ overflowY: "hidden" }}>
      <div className="container">
        {!hideNavbar && (
          <nav
            className="navbar has-shadow mb-5 is-dark"
            role="navigation"
            aria-label="main navigation"
            style={{ backgroundColor: "#1a1a1a" }}
          >
            <div
              className="container is-fluid"
              style={{ justifyContent: "center" }}
            >
              <div
                className="navbar-menu is-active"
                style={{ width: "100%", justifyContent: "center" }}
              >
                <div
                  className="navbar-start"
                  style={{
                    display: "flex",
                    gap: "2rem",
                    justifyContent: "center",
                    width: "100%",
                  }}
                >
                  <Link
                    to="/"
                    className="navbar-item has-text-weight-semibold has-text-light"
                  >
                    Home
                  </Link>
                  <Link
                    to="/page2"
                    className="navbar-item has-text-weight-semibold has-text-light"
                  >
                    Create Item
                  </Link>
                  <Link
                    to="/page3"
                    className="navbar-item has-text-weight-semibold has-text-light"
                  >
                    View Items
                  </Link>
                </div>
                <div className="navbar-end">
                  <div className="navbar-item">
                    <span className="has-text-grey-light mr-4">
                      Signed in as {username ? username.charAt(0).toUpperCase() + username.slice(1) : ''}
                    </span>
                    <button
                      className="button is-danger"
                      onClick={() => {
                        localStorage.removeItem('userRole');
                        localStorage.removeItem('userAddress');
                        window.location.href = '/login';
                      }}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </nav>
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/page2" element={<Page2 />} />
          <Route path="/page3" element={<Page3 />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

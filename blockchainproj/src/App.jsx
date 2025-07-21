import 'bulma/css/bulma.min.css';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import Home from './Home';
import Page2 from './page2';
import Page3 from './page3';
import Page4 from './page4';
import LoginPage from './Login';

function AppContent() {
  const location = useLocation();
  const hideNavbar = location.pathname === '/login';

  return (
    <div className="section">
      <div className="container">
        {!hideNavbar && (
          <nav className="navbar has-shadow mb-5" role="navigation" aria-label="main navigation">
            <div className="container is-fluid" style={{ justifyContent: 'center' }}>
              <div className="navbar-menu is-active" style={{ width: '100%', justifyContent: 'center' }}>
                <div className="navbar-start" style={{ display: 'flex', gap: '2rem', justifyContent: 'center', width: '100%' }}>
                  <Link to="/" className="navbar-item has-text-weight-semibold has-text-light">Home</Link>
                  <Link to="/page2" className="navbar-item has-text-weight-semibold has-text-light">Create Item</Link>
                  <Link to="/page3" className="navbar-item has-text-weight-semibold has-text-light">Page 3</Link>
                  <Link to="/page4" className="navbar-item has-text-weight-semibold has-text-light">Page 4</Link>
                </div>
              </div>
            </div>
          </nav>
        )}

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/page2" element={<Page2 />} />
          <Route path="/page3" element={<Page3 />} />
          <Route path="/page4" element={<Page4 />} />
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

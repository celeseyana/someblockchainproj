import 'bulma/css/bulma.min.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home';
import Page2 from './page2';

export default function App() {
	return (
		<Router>
			<div className="section">
				<div className="container">
					<nav className="mb-5">
						<Link to="/" className="button is-link mr-2">Home</Link>
						<Link to="/page2" className="button is-info">Page 2</Link>
					</nav>

					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/page2" element={<Page2 />} />
					</Routes>
				</div>
			</div>
		</Router>
	);
}

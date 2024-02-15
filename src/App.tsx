import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./screens/HomePage";
import ViewIn3D from "./screens/ViewIn3D";
import './App.css';

const App = () => {
	return (
		<Router>
			<Routes>
				<Route path="/" element={ <HomePage /> } />
				<Route path="/collections" element={ <ViewIn3D /> } />
			</Routes>
		</Router>
	);
};



export default App;
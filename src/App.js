import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import {
	Explore,
	Offers,
	Profile,
	SignIn,
	SignUp,
	ForgotPassword,
} from "./pages";

function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route exact path="/" element={<Explore />} />
					<Route exact path="/offers" element={<Offers />} />
					<Route exact path="/profile" element={<SignIn />} />
					<Route exact path="/sign-in" element={<SignIn />} />
					<Route exact path="/sign-up" element={<SignUp />} />
					<Route exact path="/forgot-passaword" element={<ForgotPassword />} />
				</Routes>
				{/* NAVBAR */}
			</Router>
		</>
	);
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
	Explore,
	Offers,
	Profile,
	SignIn,
	SignUp,
	ForgotPassword,
} from "./pages";
import { Navbar, PrivateRoute } from "./components";

function App() {
	return (
		<>
			<Router>
				<Routes>
					<Route exact path="/" element={<Explore />} />
					<Route exact path="/offers" element={<Offers />} />
					<Route
						path="/profile"
						element={
							<PrivateRoute>
								<Profile />
							</PrivateRoute>
						}
					></Route>
					<Route exact path="/sign-in" element={<SignIn />} />
					<Route exact path="/sign-up" element={<SignUp />} />
					<Route exact path="/forgot-password" element={<ForgotPassword />} />
				</Routes>
				<Navbar />
			</Router>
			<ToastContainer />
		</>
	);
}

export default App;

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
	Explore,
	Profile,
	SignIn,
	SignUp,
	ForgotPassword,
	Category,
	CreateItem,
	SingleItem,
} from "./pages";
import { Navbar, PrivateRoute, Spinner } from "./components";

function App() {
	const isLoading = false;
	return (
		<>
			<Router>
				{isLoading ? (
					<Spinner />
				) : (
					<Routes>
						<Route exact path="/" element={<Explore />} />
						<Route path="/category/:categoryName" element={<Category />} />
						<Route
							path="/category/:categoryName/:id"
							element={<SingleItem />}
						/>

						<Route
							path="/profile"
							element={
								<PrivateRoute>
									<Profile />
								</PrivateRoute>
							}
						></Route>
						<Route
							path="/create-listing"
							element={
								<PrivateRoute>
									<CreateItem />
								</PrivateRoute>
							}
						></Route>
						<Route exact path="/sign-in" element={<SignIn />} />
						<Route exact path="/sign-up" element={<SignUp />} />
						<Route exact path="/forgot-password" element={<ForgotPassword />} />
					</Routes>
				)}
				<Navbar />
			</Router>
			<ToastContainer />
		</>
	);
}

export default App;

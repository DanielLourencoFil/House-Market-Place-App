import { Navigate } from "react-router-dom";
import useAuthStatus from "../../hooks/useAuthStatus";
import Spinner from "../Spinner/Spinner";

function PrivateRoute({ children }) {
	const { isLogedIn, checkingAuthStatus } = useAuthStatus();
	if (checkingAuthStatus) {
		return (
			<section className="items-center">
				<Spinner />
			</section>
		);
	}

	return isLogedIn ? children : <Navigate to={"/sign-in"} />;
}

export default PrivateRoute;

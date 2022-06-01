import "./SignIn.css";
import { useNavigate, useLocation } from "react-router-dom";
// firebase
import { db } from "../../firebase.config";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore";
import GoogleIcon from "../../assets/icons/google-icon.png";

//toastify
import { toast } from "react-toastify";

function SignInAlternative() {
	const navigate = useNavigate();
	const location = useLocation();

	const alternativeSignIn = async (e) => {
		try {
			const auth = getAuth();
			const provider = new GoogleAuthProvider();
			const result = await signInWithPopup(auth, provider);
			const credential = GoogleAuthProvider.credentialFromResult(result);
			const user = result.user;
			const userRef = doc(db, "users", user.uid);
			const checkDB = await getDoc(userRef);

			if (!checkDB.exists()) {
				await setDoc(doc(db, "users", auth.currentUser.uid), {
					name: user.displayName,
					email: user.email,
					timeStamp: serverTimestamp(),
				});
			}

			toast.success(
				`Sign ${
					location.pathname === "/sign-in" ? "in" : "up"
				} using Google was sucessful`
			);
			if (credential) {
				navigate("/profile");
			}
		} catch (error) {
			console.log(error.code);
			console.log(error.message);
			toast.error("Sorry, not possible to sign in using Google account.");
		}
	};
	return (
		<div className="signin-alternative">
			<h4>
				{location.pathname === "/sign-in" ? "Sign In with" : "Sign Up with"}
			</h4>
			<button
				type="button"
				className="signin-alternative-btn"
				onClick={(e) => alternativeSignIn(e)}
			>
				<img src={GoogleIcon} alt="google-icon" />
			</button>
		</div>
	);
}

export default SignInAlternative;

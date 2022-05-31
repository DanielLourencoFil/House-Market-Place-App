import "./SignIn.css";
import { useState } from "react";
import { HiUser } from "react-icons/hi";
import { FaChevronCircleRight } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { MdEmail } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import SignInAlternative from "./SignInAlternative";
//firebase authentication
import {
	getAuth,
	createUserWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
//firebase db
import { db } from "../../firebase.config";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { toast } from "react-toastify";

export default function SignIn() {
	const errorDefault = { errorCode: "", errorMessage: "" };
	const [userLogData, setUserLogData] = useState({
		name: "",
		email: "",
		password: "",
	});
	const [showPassword, setShowPassord] = useState(false);
	const [error, setError] = useState(errorDefault);

	const { name, email, password } = userLogData;
	const navigate = useNavigate();

	const handleForm = (input) => {
		setUserLogData((prev) => {
			return { ...prev, [input.target.id]: input.target.value };
		});
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!name) {
			setError({
				errorCode: "no-name",
				errorMessage: "Please, provide a name",
			});
			return;
		}
		if (!email) {
			setError({
				errorCode: "no-email",
				errorMessage: "Please, provide a email",
			});
			return;
		}
		if (!password) {
			setError({
				errorCode: "no-password",
				errorMessage: "Please, provide a password least 6 characters long",
			});
			return;
		}

		try {
			const auth = getAuth();
			const userCredential = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);
			const user = userCredential.user;
			updateProfile(auth.currentUser, { displayName: name });
			// Add a new document in collection "users"
			const userLogDataCopy = { ...userLogData };
			delete userLogDataCopy.password;
			userLogDataCopy.timestamp = serverTimestamp();

			await setDoc(doc(db, "users", user.uid), userLogDataCopy);

			toast.success("Your account was created! Welcome!");
			navigate("/profile");
		} catch (error) {
			console.log(error.code);
			console.log(error.message);
			setError({ errorCode: error.code, errorMessage: error.message });
		}
	};
	return (
		<section className="main-section">
			<div className="sign-wrapper ">
				<form action="" className="form-wrapper">
					<h1 className="form-title">Welcome!</h1>
					<div className="field-wrapper sign-input">
						<p className="error-msg">
							{error.errorCode === "no-name" ? error.errorMessage : ""}
						</p>
						<HiUser className="user-icon-input" />
						<input
							type="name"
							id="name"
							name="name"
							value={name}
							placeholder="Name"
							onChange={(e) => handleForm(e)}
							onFocus={() => setError(errorDefault)}
						/>
					</div>
					<div className="field-wrapper sign-input">
						<p className="error-msg">
							{error.errorCode === "auth/invalid-email" ? "invalid-email" : ""}
							{error.errorCode === "no-email" ? error.errorMessage : ""}
						</p>
						<MdEmail className="user-icon-input" />
						<input
							type="email"
							id="email"
							name="email"
							value={email}
							placeholder="Email"
							onChange={(e) => handleForm(e)}
							onFocus={() => setError(errorDefault)}
						/>
					</div>
					<div className="field-wrapper sign-input">
						<p className="error-msg">
							{error.errorCode === "auth/weak-password"
								? "Password should be at least 6 characters"
								: ""}
							{error.errorCode === "no-password" ? error.errorMessage : ""}
						</p>
						<RiLockPasswordFill className="user-icon-input" />

						<input
							type={showPassword ? "text" : "password"}
							id="password"
							name="password"
							value={password}
							placeholder="Password"
							onChange={(e) => handleForm(e)}
							onFocus={() => setError(errorDefault)}
						/>
						<div className="eye-icon-wrapper">
							<IoMdEyeOff
								className={`eye-icon ${!showPassword ? "active" : ""}`}
								onClick={() => setShowPassord(!showPassword)}
							/>
							<IoMdEye
								className={`eye-icon ${showPassword ? "active" : ""}`}
								onClick={() => setShowPassord(!showPassword)}
							/>
						</div>
					</div>
					<div className="signin-up-wrapper">
						<button className="signin-btn" type="submit">
							Sing Up
							<FaChevronCircleRight
								className="signin-btn-icon"
								onClick={handleSubmit}
							/>
						</button>
						<Link to="/sign-in">
							<button type="button" className="sign-up-btn">
								Sign in Instead
							</button>
						</Link>
					</div>

					<SignInAlternative />
				</form>
			</div>
		</section>
	);
}

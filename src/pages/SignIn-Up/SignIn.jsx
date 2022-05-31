import "./SignIn.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";
import SignInAlternative from "./SignInAlternative";

import { FaChevronCircleRight } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEyeOff, IoMdEye } from "react-icons/io";
import { MdEmail } from "react-icons/md";
//firebase sign in
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

export default function SignIn() {
	const [userLogData, setUserLogData] = useState({ email: "", password: "" });
	const [showPassword, setShowPassord] = useState(false);
	const { email, password } = userLogData;
	const navigate = useNavigate();

	const handleForm = (input) => {
		setUserLogData((prev) => {
			return { ...prev, [input.target.id]: input.target.value };
		});
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const auth = getAuth();
			const userCredential = await signInWithEmailAndPassword(
				auth,
				email,
				password
			);

			if (userCredential.user) {
				toast.success(`Welcome back, ${auth.currentUser.displayName}`);
				navigate("/profile");
			}
		} catch (error) {
			console.log(error.code);
			console.log(error.message);
			toast.error("Sorry, bad user credentials!");
		}
	};
	return (
		<section className="main-section">
			<div className="section-center sign-wrapper signin-up">
				<form action="submit" className="form-wrapper">
					<h1 className="form-title">Welcome Back!</h1>
					<div className="field-wrapper sign-input">
						<MdEmail className="user-icon-input" />
						<input
							type="email"
							id="email"
							name="email"
							value={email}
							placeholder="Email"
							onChange={(e) => handleForm(e)}
						/>
					</div>

					<div className="field-wrapper sign-input">
						<RiLockPasswordFill className="user-icon-input" />

						<input
							type={showPassword ? "text" : "password"}
							id="password"
							name="password"
							value={password}
							placeholder="Password"
							onChange={(e) => handleForm(e)}
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
					<Link to="/forgot-password" className="forgot-password">
						<button className="forgot-password">Forgot Password</button>
					</Link>
					<div className="signin-up-wrapper">
						<button className="signin-btn" type="submit">
							Sing In{" "}
							<FaChevronCircleRight
								className="signin-btn-icon"
								onClick={handleSubmit}
							/>
						</button>
						<Link to="/sign-up">
							<button type="button" className="sign-up-btn">
								Sign Up Instead
							</button>
						</Link>
					</div>

					<SignInAlternative />
				</form>
			</div>
		</section>
	);
}

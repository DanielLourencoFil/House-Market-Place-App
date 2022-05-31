import "../SignIn-Up/SignIn.css";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { toast } from "react-toastify";

import { FaChevronCircleRight } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
//firebase sign in
import { getAuth, sendPasswordResetEmail } from "firebase/auth";

export default function ForgotPassword() {
	const errorDefault = { status: false, msg: "" };
	const [email, setEmail] = useState({ email: "" });
	const [error, setError] = useState(errorDefault);
	const navigate = useNavigate();

	const handleForm = (e) => {
		setEmail({ email: e.target.value });
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (email) {
				const auth = getAuth();
				await sendPasswordResetEmail(auth, email.email);
				toast.success("A reset message was sent to your email!");
				navigate("/sign-in");
			} else {
				setError({ status: true, msg: "Please, provide a valid email" });
			}
		} catch (error) {
			console.log(error.code);
			console.log(error.message);
			toast.error("Sorry, can not reset password!");
		}
	};
	return (
		<section className="main-section">
			<div className="section-center sign-wrapper signin-up">
				<form action="submit" className="form-wrapper">
					<h1 className="form-title">Password Reset</h1>
					<div className="field-wrapper sign-input">
						<p className="error-msg">
							{error.errorCode === "no-name" ? error.errorMessage : ""}
						</p>
						<MdEmail className="user-icon-input" />
						<input
							type="email"
							id="email"
							name="email"
							value={email.email}
							placeholder="Email"
							onChange={(e) => handleForm(e)}
						/>
					</div>
					<Link to="/sign-in" className="forgot-password">
						<button className="forgot-password">Sign In</button>
					</Link>
					<div className="signin-up-wrapper">
						<button className="signin-btn" type="submit">
							Reset{" "}
							<FaChevronCircleRight
								className="signin-btn-icon"
								onClick={handleSubmit}
							/>
						</button>
					</div>
				</form>
			</div>
		</section>
	);
}

import "./Profile.css";
import "../SignIn-Up/SignIn.css";
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { HiHome } from "react-icons/hi";
import { FiChevronRight } from "react-icons/fi";
// firebase
import {
	getAuth,
	updateProfile,
	updateEmail,
	reauthenticateWithCredential,
	EmailAuthProvider,
} from "firebase/auth";

import { updateDoc, doc } from "firebase/firestore";
import { db } from "../../firebase.config";
//tostify
import { toast } from "react-toastify";

export default function Profile() {
	const auth = getAuth();

	const navigate = useNavigate();
	const [user, setUser] = useState(null);
	const [editUser, setEditUser] = useState(null);
	const [edit, setEdit] = useState(false);

	useEffect(() => {
		setUser(auth.currentUser);
		setEditUser(auth.currentUser);
		// eslint-disable-next-line
	}, []);
	if (!user) {
		return (
			<section className="main-section items-center">
				<h1>No User Loged In</h1>
			</section>
		);
	}
	const onLogout = () => {
		auth.signOut();
		navigate("/");
	};
	const onEdit = async (e) => {
		e.preventDefault();
		if (e.target.dataset.type === "cancel") {
			setEdit(false);
			setEditUser(user);
			return;
		}
		if (edit) {
			try {
				// FUTHER IMPLEMENTATION
				// // if()
				// // prompt the user to re-provide their sign-in credentials
				// const credential = EmailAuthProvider.credential(user.email);
				// // User re-authenticated.
				// await reauthenticateWithCredential(credential);

				//check for personal details updates
				if (editUser.displayName !== user.displayName) {
					await updateProfile(auth.currentUser, {
						displayName: editUser.displayName,
					});
				}
				if (editUser.email !== user.email) {
					await updateEmail(auth.currentUser, editUser.email);
				}
				// update db
				const userRef = doc(db, "users", auth.currentUser.uid);
				await updateDoc(userRef, {
					name: editUser.displayName,
					email: editUser.email,
				});
				toast.success("user details updated");
			} catch (error) {
				console.log(error);
				toast.error("Something went wrong! User profile not updated.");
				setEditUser(user);
			}
		}
		setEdit(!edit);
	};
	const onChange = (e) => {
		setEditUser((prev) => {
			return { ...prev, [e.target.id]: e.target.value };
		});
	};

	return (
		<section className="main-section">
			<div className="section-center sign-wrapper signin-up">
				<div className="form-wrapper">
					<div className="profile-header">
						<h1 className="form-title">My Profile</h1>
						<Link to="/">
							<button className="log-out-btn" onClick={onLogout}>
								Logout
							</button>
						</Link>
					</div>
					<form action="submit" className="personal-details-form">
						<div className="user-details-header">
							<p>Personal Details</p>
							<div className="profile-btn-wrapper">
								{edit && (
									<button
										type="button"
										className="cancel-btn"
										data-type="cancel"
										onClick={onEdit}
									>
										Cancel
									</button>
								)}
								<button className="forgot-password" onClick={onEdit}>
									{!edit ? "Edit" : "Done"}
								</button>
							</div>
						</div>
						<div className="field-wrapper user-details">
							<input
								onChange={(e) => onChange(e)}
								value={edit ? editUser.displayName : user.displayName}
								id={"displayName"}
								disabled={!edit}
							></input>
							<input
								onChange={(e) => onChange(e)}
								value={edit ? editUser.email : user.email}
								id={"email"}
								disabled={!edit}
							></input>
						</div>
					</form>
					<Link to="/">
						<button className="field-wrapper generic-btn-01">
							<HiHome />
							Sell or rent your home <FiChevronRight />
						</button>
					</Link>
				</div>
			</div>
		</section>
	);
}

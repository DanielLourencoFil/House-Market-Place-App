import "./Contact.css";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
//firebase
import { getDocs, doc } from "firebase/firestore";
import { db } from "../../firebase.config";

function Contact() {
	const [landlord, setLandlord] = useState("");
	const [message, setMessage] = useState("");
	const [searchParams, setSearchParams] = useSearchParams();
	const { landLordId } = useParams();

	useEffect(() => {
		const fetchLandlord = async () => {
			const docRef = doc(db, "users", landLordId);
			const docSnap = getDocs(docRef);
			if (docSnap.exist()) {
				setLandlord(docSnap.data());
			} else {
				toast.error("Sorry, can't find landlord");
			}
			fetchLandlord();
		};
	}, [landLordId]);

	return (
		<main className="section-main">
			<div className="section-center contact">
				<h1 className="form-title">Contact Landlord</h1>
				<h4 className="secondary-title form-secondary-title">
					Contact {landlord.name}
				</h4>
				<form className="contact-form">
					<label htmlFor="message">Message</label>
					<textarea
						onChange={(e) => setMessage(e.target.value)}
						className="contact-message field-wrapper"
						name="contact-message"
						value={message}
						id="contact-message"
						cols="30"
						rows="10"
						placeholder="Write you message here"
					></textarea>

					<a
						className="contact-form-btn-wrapper"
						href={`mailto:${landlord.email}?Subject=${searchParams.get(
							"listings"
						)}&body=${message}`}
					>
						<button type="button" className="generic-btn-02 contact-form-btn">
							Send
						</button>
					</a>
				</form>
			</div>
		</main>
	);
}

export default Contact;

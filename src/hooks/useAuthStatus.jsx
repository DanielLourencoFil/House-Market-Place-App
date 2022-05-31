import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

export default function useAuthStatus() {
	const [isLogedIn, setIsLogedIn] = useState(false);
	const [checkingAuthStatus, setCheckingAuthStatus] = useState(true);

	useEffect(() => {
		const auth = getAuth();
		onAuthStateChanged(auth, (user) => {
			if (user) {
				setIsLogedIn(true);
			}
			setCheckingAuthStatus(false);
		});
	}, []);
	return { isLogedIn, checkingAuthStatus };
}

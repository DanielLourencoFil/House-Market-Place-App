import "./ShareIcon.css";
import { BsShareFill } from "react-icons/bs";

function ShareIcon({ cb }) {
	const clipBoardCopy = (cb) => {
		cb(true);
		navigator.clipboard.writeText(window.location.href);
		setTimeout(() => {
			cb(false);
		}, 2500);
	};
	return (
		<div className="share-icon-wrapper" onClick={() => clipBoardCopy(cb)}>
			<BsShareFill className="share-icon" />
		</div>
	);
}

export default ShareIcon;

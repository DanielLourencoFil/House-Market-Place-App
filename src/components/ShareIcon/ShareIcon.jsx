import "./ShareIcon.css";
import { BsShareFill } from "react-icons/bs";

function ShareIcon({ cb }) {
	return <BsShareFill className="share-icon" onClick={cb} />;
}

export default ShareIcon;

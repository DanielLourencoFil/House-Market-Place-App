import "./Carrousel.css";
import ShareIcon from "../ShareIcon/ShareIcon";

import React from "react";

function Carrousel({ cb }) {
	return (
		<div className="slider">
			<ShareIcon cb={cb} />
		</div>
	);
}

export default Carrousel;

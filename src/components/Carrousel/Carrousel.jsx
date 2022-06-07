import "./Carrousel.css";
import ShareIcon from "../ShareIcon/ShareIcon";

import { useState } from "react";

function Carrousel({ data }) {
	const [move, setMove] = useState(0);
	const handleMove = () => {
		setMove((prev) => {
			if (prev >= data.length - 2) {
				console.log(">");
				return prev + 1;
			}
			if (prev <= 1) {
				console.log("<");
				return prev - 1;
			}
		});
	};
	console.log(move);
	return (
		<div className="slider" onClick={handleMove}>
			{data.map((img, index) => {
				const { imgUrls } = img;
				return <Slide key={index} url={imgUrls[0]} position={index + move} />;
			})}
		</div>
	);
}

const Slide = ({ url, position }) => {
	return (
		<div
			className="slide"
			style={{
				background: `url(${url}) center/cover no-repeat`,
				transform: `translateX(${position}00%)`,
			}}
		></div>
	);
};
export default Carrousel;

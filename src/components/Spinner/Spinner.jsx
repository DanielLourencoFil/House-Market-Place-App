import "./Spinner.css";

function Spinner({ title }) {
	return (
		<div className="items-center spinner-bg">
			<div className="spinner-container">
				<div className="spinner-circle"></div>
				<p>{title ? title : "Loading"}</p>
			</div>
		</div>
	);
}

export default Spinner;

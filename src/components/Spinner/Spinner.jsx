import "./Spinner.css";

function Spinner() {
	return (
		<div className="items-center spinner-bg">
			<div className="spinner-container">
				<div className="spinner-circle"></div>
				<p>Loading</p>
			</div>
		</div>
	);
}

export default Spinner;

import "./CreateItem.css";
import { useState } from "react";
import { useParams } from "react-router-dom";

function CreateItem() {
	// const [isActive, setIsActive] = useState("false");
	const handleValue = (e) => {
		// console.log(e.target.dataset.value);
		// console.log(e.target.id);
		// console.log(e.target.value);
	};

	return (
		<main className="main-section">
			<div className="section-center listing">
				<BooleanFeature
					name="Sell/Rent"
					cb={handleValue}
					boolean1="sell"
					boolean2="rent"
				/>
				<BooleanFeature name="Parking Spot" cb={handleValue} />
				<BooleanFeature name="Furnished" cb={handleValue} />
				<BooleanFeature name="Offer" cb={handleValue} />
				<InputFeature name="Name" cb={handleValue} />
				<InputFeature name="Address" cb={handleValue} />
				<NumberFeature name="Badrooms" cb={handleValue} />
				<NumberFeature name="Bathrooms" cb={handleValue} />
				<div className="regular-price">
					<NumberFeature name="Regular Price" />
					<p>$ / Month</p>
				</div>
				<div className="images-upload">
					<h4 className="feature-title">Images</h4>
					<p className="feature-subtitle">
						The first image will be the cover (max. 6)
					</p>
					<div className="field-wrapper">
						<input
							type="file"
							id="images"
							max={6}
							accept=".jpg, .png, .jpeg"
							multiple
							required
							className="test"
						></input>
					</div>
				</div>
			</div>
		</main>
	);
}

const BooleanFeature = ({ name, cb, boolean1, boolean2 }) => {
	const [isActive, setIsActive] = useState("false");

	const active = (e) => {
		setIsActive(!isActive);
	};
	return (
		<div className="boolean-feature">
			<h4 className="feature-title">{name}</h4>
			<div className="boolean-btns-wrapper">
				<button
					data-value={boolean1 || "yes"}
					className={`boolean-btn field-wrapper ${isActive ? "" : "active-02"}`}
					onClick={() => {
						cb();
						active();
					}}
				>
					{boolean1 || "yes"}
				</button>
				<button
					data-value={boolean2 || "no"}
					className={`boolean-btn field-wrapper ${isActive ? "active-02" : ""}`}
					onClick={() => {
						cb();
						active();
					}}
				>
					{boolean2 || "no"}
				</button>
			</div>
		</div>
	);
};
const InputFeature = ({ name, cb, value }) => {
	return (
		<div className="feature-title">
			<label htmlFor={name}>{name}</label>
			<input
				id={name}
				type="text"
				value={value}
				onChange={cb}
				className="field-wrapper"
			/>
		</div>
	);
};
const NumberFeature = ({ name, cb, value }) => {
	return (
		<div className="feature-title">
			<label htmlFor={name}>{name}</label>
			<input id={name} type="number" value={value} onChange={cb} />
		</div>
	);
};

export default CreateItem;

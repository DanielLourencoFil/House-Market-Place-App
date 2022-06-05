import "./CreateItem.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
//firestore
import { db } from "../../firebase.config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import {
	getStorage,
	ref,
	uploadBytesResumable,
	getDownloadURL,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

//compoments
import { Spinner } from "../../components";
import { toast } from "react-toastify";

const dbModel = {
	name: "Beautiful Stratford Condo",
	type: "rent",
	userRef: "ID OF A USER",
	bedrooms: 2,
	bathrooms: 2,
	parking: true,
	furnished: true,
	offer: true,
	regularPrice: 2500,
	discountedPrice: 2000,
	location: "",
	geolocation: {
		lat: "41.205590",
		lng: "-73.150530",
	},

	imageUrls: [],
	timestamp: "00:00:00",
};
function CreateItem() {
	const formData = {
		name: "",
		type: "rent",
		bedrooms: 1,
		bathrooms: 1,
		parking: false,
		furnished: false,
		offer: false,
		regularPrice: 0,
		discountedPrice: 0,
		location: "",
		latitude: 0,
		longitude: 0,
		images: {},
	};
	const [newItem, setNewItem] = useState(formData);
	const [isLoading, setIsLoading] = useState(true);
	const [isGeoloactionEnabled, setIsGeoloacationEnabled] = useState(false);
	const auth = getAuth();

	const navigate = useNavigate();
	const {
		name,
		type,
		bedrooms,
		bathrooms,
		parking,
		furnished,
		offer,
		regularPrice,
		discountedPrice,
		location,
		latitude,
		longitude,
		images,
	} = newItem;

	useEffect(() => {
		const user = getAuth();
		setNewItem((prev) => {
			return { ...prev, userRef: user.currentUser.uid };
		});
	}, []);
	const handleValue = (e) => {
		let feature = e.target.dataset.id;
		let value = e.target.value;
		//convert string to boolean
		if (e.target.dataset.id === "images") {
			value = e.target.files;
		}
		if (value === "true") {
			value = true;
		}
		if (value === "false") {
			value = false;
		}
		//convert string to number and skip true and false values (otherwise it converts to 1 and 0)
		if (Number(value) && value !== true && value !== false) {
			value = Number(value);
		}
		//set data to form
		setNewItem((prev) => {
			return { ...prev, [feature]: value };
		});
		console.log(value);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		if (Number(discountedPrice) >= Number(regularPrice)) {
			toast.error("The offer price can't be higher than the regular price.");
			return;
		}
		if (images.length > 6) {
			toast.error("Can't upload more than 6 images");
		}

		// GEOLOCATION QUERY
		try {
			// const APIKEY = process.env.REACT_APP_GEO_API_KEY;
			const APIKEY = "d0913fc07aa3a61c6cb7a03c6afe87fb";
			console.log(APIKEY);
			const response = await fetch(
				`http://api.positionstack.com/v1/forward?access_key=${APIKEY}&query=${location}`
			);
			const geolocation = await response.json();
			const { data } = geolocation;
			if (!data || data.length === 0) {
				toast.error(
					"No matches for the location query. Please, fill in more address info."
				);
				// setIsGeoloacationEnabled(true);
			}
			if (data.length >= 3) {
				toast.error(
					"Too many matches for the location query. Please, fill in more address info."
				);
				// setIsGeoloacationEnabled(true);
			}
			if (data && data.length < 3) {
				setNewItem((prev) => {
					return {
						...prev,
						latitude: data[0].latitude,
						longitude: data[0].longitude,
					};
				});
			}
		} catch (error) {
			console.log(error);
		}
		//Sotareg images firebase
		const storeImage = async (image) => {
			return new Promise((resolve, reject) => {
				const storage = getStorage();
				const fileName = `${auth.currentUser.uid}-${image.name}-${uuidv4()}`;

				const storageRef = ref(storage, "image/" + fileName);

				const uploadTask = uploadBytesResumable(storageRef, image);

				uploadTask.on(
					"state_changed",
					(snapshot) => {
						const progress =
							(snapshot.bytesTransferred / snapshot.totalBytes) * 100;
						console.log("Upload is " + progress + "% done");
						switch (snapshot.state) {
							case "paused":
								console.log("Upload is paused");
								break;
							case "running":
								console.log("Upload is running");
								break;
						}
					},
					(error) => {
						reject(error);
					},
					() => {
						// Handle successful uploads on complete
						// For instance, get the download URL: https://firebasestorage.googleapis.com/...
						getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
							resolve(downloadURL);
							return downloadURL;
						});
					}
				);
			});
		};

		const imgUrls = await Promise.all(
			[...images].map((image) => {
				return storeImage(image);
			})
		).catch(() => {
			setIsLoading(false);
			toast.error("Images not uploaded");
			return;
		});
		console.log(imgUrls);

		const newItemCopy = {
			...newItem,
			imgUrls,
			geolocation: { lat: latitude, lng: longitude },
			timestamp: serverTimestamp(),
		};
		delete newItemCopy.images;
		!newItemCopy.discountedPrice && delete newItemCopy.discountedPrice;

		const docRef = await addDoc(collection(db, "listings"), newItemCopy);
		setIsLoading(false);
		toast.success("Listing is saved");
		navigate(`/category/${newItemCopy.type}/${docRef.id}`);
		console.log(newItemCopy);
	};

	// console.log(;
	return (
		<main className="main-section">
			<div className="section-center listings">
				<h1 className="form-title">Create a Listing</h1>
				<form className="listings-form" action="submit" onSubmit={handleSubmit}>
					<BooleanFeature
						title="Sale/Rent"
						feature={"type"}
						value1="sale"
						value2="rent"
						action={handleValue}
					/>
					<BooleanFeature
						feature={"parking"}
						title="parking Spot"
						value1="true"
						value2="false"
						action={handleValue}
					/>
					<BooleanFeature
						feature={"furnished"}
						title="furnished"
						value1="true"
						value2="false"
						action={handleValue}
					/>
					<InputFeature
						feature={"name"}
						title="name"
						action={handleValue}
						value={name}
						required={true}
					/>

					<InputFeature
						feature={"location"}
						title="address"
						action={handleValue}
						value={location}
						required={true}
					/>

					{/* GEOLOCATION MANUALY */}
					<div className="bed-bath-input-wrapper geo-wrapper">
						<div className="geo-header-wrapper">
							<h4 className="feature-title geo-title">Geo location :</h4>
							<button
								type="button"
								className="geolocation-enable-btn"
								onClick={() => setIsGeoloacationEnabled(!isGeoloactionEnabled)}
							>
								{isGeoloactionEnabled ? "manual" : "auto"}
							</button>
						</div>
						{isGeoloactionEnabled && (
							<div className="geo-input-wrapper">
								<NumberFeature
									feature={"latitude"}
									title="latitude"
									action={handleValue}
									value={latitude}
									required={false}
									active={true}
									small={false}
								/>
								<NumberFeature
									feature={"longitude"}
									title="longitude"
									action={handleValue}
									value={longitude}
									required={false}
									active={true}
									small={false}
								/>
							</div>
						)}
					</div>
					<div className="bed-bath-input-wrapper">
						<NumberFeature
							feature={"bedrooms"}
							title="bedrooms"
							action={handleValue}
							value={bedrooms}
							required={true}
							active={true}
							small={true}
							min={1}
						/>
						<NumberFeature
							feature={"bathrooms"}
							title="Bathrooms"
							action={handleValue}
							value={bathrooms}
							required={true}
							active={true}
							small={true}
							min={1}
						/>
					</div>
					<div className="price-input">
						<NumberFeature
							feature={"regularPrice"}
							title="Regular Price"
							action={handleValue}
							value={regularPrice}
							required={true}
							active={true}
							small={false}
							min={1}
						/>
						{type === "rent" && <p>$ / Month</p>}
					</div>
					<BooleanFeature
						title="Offer"
						feature="offer"
						value1="true"
						value2="false"
						action={handleValue}
					/>

					<div className="price-input">
						<NumberFeature
							title="Discouted Price"
							feature="discountedPrice"
							action={handleValue}
							value={discountedPrice}
							required={true}
							active={offer}
							small={false}
							min={1}
						/>
						{type === "rent" && <p>$ / Month</p>}
					</div>
					<div className="images-upload">
						<h4 className="feature-title">Images</h4>
						<p className="feature-subtitle">
							The first image will be the cover (max. 6)
						</p>
						<div className="field-wrapper">
							<input
								// data-value={"imgUrls"}
								type="file"
								data-id="images"
								max={6}
								accept=".jpg, .png, .jpeg"
								multiple
								required
								className="form-input-file "
								onChange={handleValue}
							></input>
						</div>
					</div>
					<button type="submit" className="generic-btn-02 ">
						Create Listing
					</button>
				</form>
			</div>
		</main>
	);
}

const BooleanFeature = ({ title, feature, value1, value2, action }) => {
	const [isActive, setIsActive] = useState(false);
	const active = () => {
		setIsActive(!isActive);
	};
	return (
		<div className="boolean-feature">
			<h4 className="feature-title">{title}</h4>
			<div className="boolean-btns-wrapper">
				<button
					type="button"
					data-id={feature}
					value={value1}
					className={`boolean-btn field-wrapper ${isActive ? "active-02" : ""}`}
					onClick={(e) => {
						action(e);
						active();
					}}
				>
					{value1}
				</button>
				<button
					type="button"
					data-id={feature}
					value={value2}
					className={`boolean-btn field-wrapper ${isActive ? "" : "active-02"}`}
					onClick={(e) => {
						action(e);
						active();
					}}
				>
					{value2}
				</button>
			</div>
		</div>
	);
};
const InputFeature = ({ title, feature, action, value, required }) => {
	// console.log(value);
	return (
		<div>
			<label className="feature-title" htmlFor={title}>
				{title}
			</label>
			<input
				className="field-wrapper"
				data-id={feature}
				type="text"
				value={value}
				onChange={action}
				required={required || false}
			/>
		</div>
	);
};
const NumberFeature = ({
	title,
	feature,
	value,
	action,
	active,
	required,
	small,
	min,
}) => {
	return (
		<div className={`feature-number ${small ? "small" : ""}`}>
			<label className="feature-title" htmlFor={title}>
				{title}
			</label>
			<input
				className={`field-wrapper field-number`}
				type="number"
				data-id={feature}
				value={value}
				onChange={action}
				disabled={!active}
				min={min || 0}
				required={required}
			/>
		</div>
	);
};

export default CreateItem;

/*
import "./CreateItem.css";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
//firestore
import { db } from "../../firebase.config";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
//compoments
import { Spinner } from "../../components";
import { toast } from "react-toastify";

const dbModel = {
	name: "Beautiful Stratford Condo",
	type: "rent",
	userRef: "ID OF A USER",
	bedrooms: 2,
	bathrooms: 2,
	parking: true,
	furnished: true,
	offer: true,
	regularPrice: 2500,
	discountedPrice: 2000,
	location: "8601 West Peachtree St Stratford, CT 06614",
	geolocation: {
		lat: "41.205590",
		lng: "-73.150530",
	},
	imageUrls: [],
	timestamp: "00:00:00",
};
function CreateItem() {
	const formData = {
		name: "",
		type: "rent",
		bedrooms: 1,
		bathrooms: 1,
		parking: false,
		furnished: false,
		offer: false,
		regularPrice: 0,
		discountedPrice: 0,
		location: "",
		latitude: 0,
		longitude: 0,
		images: {},
	};
	const [ setNewItem] = useState(formData);
	const [isLoading, setIsLoading] = useState(true);
	const [isGeoloactionEnabled, setIsGeoloacationEnabled] = useState(false);
	const navigate = useNavigate();
	const {
		name,
		type,
		bedrooms,
		bathrooms,
		parking,
		furnished,
		offer,
		regularPrice,
		discountedPrice,
		location,
		latitude,
		longitude,
		images,
	} = newItem;

	useEffect(() => {
		const user = getAuth();
		setNewItem((prev) => {
			return { ...prev, userRef: user.currentUser.uid };
		});
	}, []);
	const handleValue = (e) => {
		let feature = e.target.dataset.id;
		let value = e.target.value;
		//convert string to boolean
		if (e.target.dataset.id === "images") {
			value = e.target.files;
		}
		if (value === "true") {
			value = true;
		}
		if (value === "false") {
			value = false;
		}
		//convert string to number and skip true and false values (otherwise it converts to 1 and 0)
		if (Number(value) && value !== true && value !== false) {
			value = Number(value);
		}
		//set data to form
		setNewItem((prev) => {
			return { ...prev, [feature]: value };
		});
		console.log(e.target.files);
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		setIsLoading(true);
		if (Number(newItem.discountedPrice) >= Number(newItem.regularPrice)) {
			toast.error("The offer price can't be higher than the regular price.");
			return;
		}
		if (newItem.images.length > 6) {
			toast.error("Can't upload more than 6 images");
		}
		try {
			// const APIKEY = process.env.REACT_APP_GEO_API_KEY;
			const APIKEY = "d0913fc07aa3a61c6cb7a03c6afe87fb";
			console.log(APIKEY);
			const response = await fetch(
				`http://api.positionstack.com/v1/forward?access_key=${APIKEY}&query=${newItem.location}`
			);
			const geolocation = await response.json();
			console.log(geolocation.data);
			// console.log(geolocation.data[0].longitude);
			// console.log(geolocation.data[0].latitude);
		} catch (error) {
			console.log(error);
		}
		setIsLoading(false);
	};
	// console.log(newItem);
	// console.log(newItem);
	return (
		<main className="main-section">
			<div className="section-center listings">
				<h1 className="form-title">Create a Listing</h1>
				<form className="listings-form" action="submit" onSubmit={handleSubmit}>
					<BooleanFeature
						title="Sale/Rent"
						feature={"type"}
						value1="sale"
						value2="rent"
						action={handleValue}
					/>
					<BooleanFeature
						feature={"parking"}
						title="Parking Spot"
						value1="true"
						value2="false"
						action={handleValue}
					/>
					<BooleanFeature
						feature={"furnished"}
						title="Furnished"
						value1="true"
						value2="false"
						action={handleValue}
					/>
					<InputFeature
						feature={"name"}
						title="Name"
						action={handleValue}
						value={newItem.name}
						required={true}
					/>
					<InputFeature
						feature={"location"}
						title="Address"
						action={handleValue}
						value={newItem.location}
						required={true}
					/>
					<div className="bed-bath-input-wrapper">
						<NumberFeature
							feature={"bedrooms"}
							title="Bedrooms"
							action={handleValue}
							value={newItem.bedrooms}
							required={true}
							active={true}
							small={true}
						/>
						<NumberFeature
							feature={"bathrooms"}
							title="Bathrooms"
							action={handleValue}
							value={newItem.bathrooms}
							required={true}
							active={true}
							small={true}
						/>
					</div>
					<div className="price-input">
						<NumberFeature
							feature={"regularPrice"}
							title="Regular Price"
							action={handleValue}
							value={newItem.regularPrice}
							required={true}
							active={true}
							small={false}
						/>
						{newItem.type === "rent" && <p>$ / Month</p>}
					</div>
					<BooleanFeature
						title="Offer"
						feature="offer"
						value1="true"
						value2="false"
						action={handleValue}
					/>

					<div className="price-input">
						<NumberFeature
							title="Discouted Price"
							feature="discountedPrice"
							action={handleValue}
							value={newItem.discountedPrice}
							required={true}
							active={newItem.offer}
							small={false}
						/>
						{newItem.type === "rent" && <p>$ / Month</p>}
					</div>
					<div className="images-upload">
						<h4 className="feature-title">Images</h4>
						<p className="feature-subtitle">
							The first image will be the cover (max. 6)
						</p>
						<div className="field-wrapper">
							<input
								// data-value={"imgUrls"}
								type="file"
								data-id="images"
								max={6}
								accept=".jpg, .png, .jpeg"
								multiple
								required
								className="form-input-file "
								onChange={handleValue}
							></input>
						</div>
					</div>
					<button type="submit" className="generic-btn-02 ">
						Create Listing
					</button>
				</form>
			</div>
		</main>
	);
}

const BooleanFeature = ({ title, feature, value1, value2, action }) => {
	const [isActive, setIsActive] = useState(false);
	const active = () => {
		setIsActive(!isActive);
	};
	return (
		<div className="boolean-feature">
			<h4 className="feature-title">{title}</h4>
			<div className="boolean-btns-wrapper">
				<button
					type="button"
					data-id={feature}
					value={value1}
					className={`boolean-btn field-wrapper ${isActive ? "active-02" : ""}`}
					onClick={(e) => {
						action(e);
						active();
					}}
				>
					{value1}
				</button>
				<button
					type="button"
					data-id={feature}
					value={value2}
					className={`boolean-btn field-wrapper ${isActive ? "" : "active-02"}`}
					onClick={(e) => {
						action(e);
						active();
					}}
				>
					{value2}
				</button>
			</div>
		</div>
	);
};
const InputFeature = ({ title, feature, action, value, required }) => {
	// console.log(value);
	return (
		<div>
			<label className="feature-title" htmlFor={title}>
				{title}
			</label>
			<input
				className="field-wrapper"
				data-id={feature}
				type="text"
				value={value}
				onChange={action}
				required={required || false}
			/>
		</div>
	);
};
const NumberFeature = ({
	title,
	feature,
	value,
	action,
	active,
	required,
	small,
}) => {
	return (
		<div className={`feature-number ${small ? "small" : ""}`}>
			<label className="feature-title" htmlFor={title}>
				{title}
			</label>
			<input
				className={`field-wrapper field-number`}
				type="number"
				data-id={feature}
				value={value}
				onChange={action}
				disabled={!active}
				min="1"
				required={required}
			/>
		</div>
	);
};

export default CreateItem;

*/

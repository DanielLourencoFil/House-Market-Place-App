import "./SingleItem.css";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Carrousel, Spinner } from "../../components";
//firebase
import { db } from "../../firebase.config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { toast } from "react-toastify";

// const item = {
// 	name: "Beautiful Stratford Condo",
// 	type: "rent",
// 	userRef: "ID OF A USER",
// 	bedrooms: 2,
// 	bathrooms: 2,
// 	parking: true,
// 	furnished: true,
// 	offer: true,
// 	regularPrice: 2500,
// 	discountedPrice: 2000,
// 	location: "8601 West Peachtree St Stratford, CT 06614",
// 	geolocation: {
// 		lat: "41.205590",
// 		lng: "-73.150530",
// 	},
// 	imgUrls: [],
// 	timestamp: "00:00:00",
// };

function SingleItem() {
	const { id } = useParams();
	const [item, setItem] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetch = async () => {
			try {
				const itemRef = collection(db, "listings");
				// Create a query against the collection.
				const q = query(itemRef, where("userRef", "==", id));

				const itemsFromCollection = {};

				const queryShapshop = await getDocs(q);
				queryShapshop.forEach((item) => {
					itemsFromCollection.id = item.id;
					itemsFromCollection.data = item.data();
				});
				setItem(itemsFromCollection);
				setIsLoading(false);
			} catch (error) {
				console.log(error.code, error.message);
				toast.error("Opps, something went wrong, can't fecht place");
			}
		};
		fetch();
	}, []);
	console.log(item);
	if (isLoading) {
		return <Spinner />;
	} else {
		const {
			name,
			type,
			imgUrls,
			location,
			parking,
			furnished,
			regularPrice,
			discountedPrice,
			bedrooms,
			bathrooms,
		} = item.data;
		return (
			<main className="main-section">
				<div className="section-center single-item-wrapper">
					<Carrousel />
					<h1 className="single-item-name">
						{name} - ${regularPrice.toLocaleString("en-US")}
					</h1>
					<h4 className="single-item-location">{location}</h4>
					<div className="single-item-btns-wrapper">
						<p className="single-item-btn">For {type}</p>
						<p className="single-item-btn">
							${discountedPrice.toLocaleString("en-US")}
						</p>
					</div>
					<p className="more-features">{bedrooms} Bedrooms</p>
					<p className="more-features">{bathrooms} Bathrooms</p>
					{parking && <p className="more-features">Parking Spot</p>}
					{furnished && <p className="more-features">Furnished</p>}
					<div className="location-map">
						<h4 className="location-title">Location</h4>
						<div>Map</div>
					</div>
					<button className="generic-btn-01 single-item-contact-btn">
						Contact Landlord
					</button>
				</div>
			</main>
		);
	}
}

export default SingleItem;

import "./SingleItem.css";
import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Carrousel, ShareIcon, Spinner } from "../../components";
//firebase
import { db } from "../../firebase.config";
import { collection, query, where, getDocs } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { toast } from "react-toastify";
//leaflet
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
//swiper
import SwiperCore, { Navigation, Pagination, Scrollbar, A11y } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
// import "swiper/swiper-bundle.css";
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

function SingleItem() {
	const { categoryName, id } = useParams();
	const [item, setItem] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [shareIconCopied, setShareIconCopied] = useState(false);
	const auth = getAuth();

	useEffect(() => {
		// console.log(id, categoryName);
		const fetch = async () => {
			setIsLoading(true);
			const feature = categoryName === "offers" ? "offer" : "type";
			const category = categoryName === "offers" ? true : categoryName;
			try {
				const itemRef = collection(db, "listings");
				// Create a query against the collection.
				const q = query(itemRef, where(feature, "==", category));

				const itemsFromCollection = {};

				const queryShapshop = await getDocs(q);
				queryShapshop.forEach((item) => {
					if (item.id === id) {
						itemsFromCollection.id = item.id;
						itemsFromCollection.data = item.data();
					}
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
			userRef,
			geolocation,
		} = item.data;
		console.log(geolocation.lat, geolocation.lng, geolocation);
		return (
			<main className="main-section">
				<div className="section-center single-item-wrapper">
					<div className="single-item-carrousel-wrapper">
						<p className={`link-copied ${shareIconCopied ? "active" : null}`}>
							Link was copied on clipboard
						</p>
						<Swiper slidesPerView={1} pagination={{ clickable: true }}>
							{imgUrls.map((url, index) => {
								<SwiperSlide key={index}>
									<div
										className="swiperSliderDiv"
										style={{
											background: `url(${imgUrls[index]}) center/cover no-repeat`,
										}}
									></div>
								</SwiperSlide>;
							})}
						</Swiper>
						{/* <Carrousel /> */}
						<ShareIcon cb={setShareIconCopied} />
					</div>
					<h1 className="single-item-name">
						{name} - ${regularPrice?.toLocaleString("en-US")}
					</h1>
					<h4 className="single-item-location">{location}</h4>
					<div className="single-item-btns-wrapper">
						<p className="single-item-btn">For {type}</p>
						{discountedPrice && (
							<p className="single-item-btn">
								${discountedPrice?.toLocaleString("en-US")}
							</p>
						)}
					</div>
					<p className="more-features">{bedrooms} Bedrooms</p>
					<p className="more-features">{bathrooms} Bathrooms</p>
					{parking && <p className="more-features">Parking Spot</p>}
					{furnished && <p className="more-features">Furnished</p>}
					<div className="location-map">
						<h4 className="location-title">Location</h4>
						<div className="leaflet-wrapper">
							<MapContainer
								style={{ height: "100%", width: "100%" }}
								center={[geolocation.lat, geolocation.lng]}
								zoom={13}
								scrollWheelZoom={false}
							>
								{/* needs more code */}
								<TileLayer
									attribution='&copy; <a href="http://osm.org/copyrigh">OpenStreetMap</a> contributors'
									url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
								/>
								<Marker position={[geolocation.lat, geolocation.lng]}>
									<Popup>{location}</Popup>
								</Marker>
							</MapContainer>
						</div>
					</div>
					{auth.currentUser?.uid !== userRef && (
						<Link
							className="generic-btn-01 single-item-contact-btn"
							to={`/contact/${userRef}?listingName=${name}`}
						>
							Contact Landlord
						</Link>
					)}
				</div>
			</main>
		);
	}
}

export default SingleItem;

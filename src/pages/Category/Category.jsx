import "./Category.css";
import { data } from "../../listings";
import { useState, useEffect } from "react";
import { FaBath, FaBed } from "react-icons/fa";
import { useParams, Link } from "react-router-dom";
import { Spinner } from "../../components";
// toastify
import { toast } from "react-toastify";
// firestore
import { db } from "../../firebase.config";
import {
	collection,
	getDocs,
	query,
	where,
	orderBy,
	limit,
} from "firebase/firestore";

function Category() {
	const { categoryName } = useParams();
	const [items, setItems] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetch = async () => {
			try {
				//create reference to places collection
				const itemsRef = collection(db, "listings");
				//create a querry (order) agains te collection
				console.log(itemsRef);
				let q;
				if (categoryName === "offers") {
					q = query(
						itemsRef,
						where("offer", "==", true),
						limit(10),
						orderBy("timestamp", "desc")
					);
				} else {
					q = query(
						itemsRef,
						where("type", "==", categoryName),
						orderBy("timestamp", "desc"),
						limit(10)
					);
				}
				console.log(q);
				//create an empty array to push items from collection
				const itemsFromCollection = [];
				const querrySnapshot = await getDocs(q);
				querrySnapshot.forEach((doc) => {
					console.log(doc);
					itemsFromCollection.push({
						id: doc.id,
						place: doc.data(),
					});
				});
				setItems(itemsFromCollection);
				setIsLoading(false);
			} catch (error) {
				console.log(error.code);
				console.log(error.message);
				if (categoryName === "offers") {
					toast.error(`Opps, can not fecht offers`);
				} else {
					toast.error(`Opps, can not fecht ${title()}`);
				}
			}
		};
		fetch();
	}, [categoryName]);
	console.log(items);

	const loadMoreItems = () => {
		console.log("load more btn");
	};
	const title = () => {
		let title = "";
		if (categoryName === "offers") {
			title = "Offers";
		} else {
			title = `Places for  ${categoryName}`;
		}
		return title;
	};
	return (
		<main className="main-section">
			<div className="section-center category">
				<h1 className="form-title">{title()}</h1>
				{isLoading ? (
					<Spinner />
				) : (
					<>
						{!items.length ? (
							<h1 className="no-items-msg">
								Sorry, no {title()} in our database
							</h1>
						) : (
							<ItemsCard items={items} />
						)}

						<button className="load-more-btn" onClick={loadMoreItems}>
							Load More
						</button>
					</>
				)}
			</div>
		</main>
	);
}

const ItemsCard = ({ items }) => {
	return (
		<div className="items-wrapper">
			{items.map((item) => {
				const {
					type,
					name,
					imgUrls,
					location,
					regularPrice,
					discountedPrice,
					bedrooms,
					bathrooms,
					userRef,
					offer,
				} = item.place;
				return (
					<Link to={`${item.id}`}>
						<div key={item.id} className="item-card field-wrapper">
							<img src={imgUrls[0]} alt={name} className="item-img" />
							<div className="item-info-wrapper">
								<p className="item-location">{location}</p>
								<h4 className="item-name">{name}</h4>
								<h4 className="item-price">
									$
									{offer
										? discountedPrice.toLocaleString("en-US")
										: regularPrice.toLocaleString("en-US")}
									{type === "rent" && " /Month"}
								</h4>
								<div className="item-info-footer">
									<div className="item-info-footer">
										<FaBed className="item-info-footer-icon" />
										<p className="mobile">{bedrooms} </p>
										<p className="desktop">
											{bedrooms} {bedrooms > 1 ? "Bedrooms" : "Bedroom"}
										</p>
									</div>
									<div className="item-info-footer">
										<FaBath className="item-info-footer-icon" />
										<p className="mobile">{bathrooms} </p>
										<p className="desktop">
											{bathrooms} {bathrooms > 1 ? "Bathrooms" : "Bathroom"}
										</p>
									</div>
								</div>
							</div>
						</div>
					</Link>
				);
			})}
		</div>
	);
};
export default Category;

import React from "react";
import "./Explore.css";
import { Link } from "react-router-dom";
import RentCategoryImage from "../../assets/categories/rentCategoryImage.jpg";
import SellCategoryImage from "../../assets/categories/sellCategoryImage.jpg";
import { Carrousel } from "../../components";

import { data } from "../../listings";

export default function Explore() {
	return (
		<main className="main-section">
			<div className="section-center explore">
				<h1 className="form-title">Explore</h1>
				<div className="slider-wrapper">
					<h4 className="secondary-title">Recommended</h4>
					<Carrousel data={data} />
				</div>
				<div className="categories-wrapper">
					<h4 className="secondary-title">Categories</h4>
					<div className="category-img-wrapper">
						<div className="img-name-wrapper">
							<Link to="/category/rent">
								<img
									className="category-img"
									src={RentCategoryImage}
									alt="room-for-rent"
								/>
								<p className="category-name">Places for rent</p>
							</Link>
						</div>
						<div className="img-name-wrapper">
							<Link to="/category/sale">
								<img
									className="category-img"
									src={SellCategoryImage}
									alt="house-for-sale"
								/>
								<p className="category-name">Places for Sale</p>
							</Link>
						</div>
					</div>
				</div>
			</div>
		</main>
	);
}

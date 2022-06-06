import React from "react";
import { NavLink } from "react-router-dom";
import { MdOutlineExplore, MdOutlineLocalOffer } from "react-icons/md";
import { HiOutlineUser } from "react-icons/hi";
import "./Navbar.css";

function Navbar() {
	return (
		<nav className="main-section navbar-container">
			<div className="section-center navbar-center">
				<NavLink to="/" className={`navlinks`} activeclassname="active">
					<MdOutlineExplore />
					<p>Explore</p>
				</NavLink>

				<NavLink
					to="/category/offers"
					className={`navlinks`}
					activeclassname="active"
				>
					<MdOutlineLocalOffer />
					<p>Offers</p>
				</NavLink>

				<NavLink to="/profile" className={`navlinks`} activeclassname="active">
					<HiOutlineUser />
					<p>Profile</p>
				</NavLink>
			</div>
		</nav>
	);
}

export default Navbar;
/*	className={`navlinks ${({ isActive }) =>
						isActive ? "active" : "inactive"}`} */

import React from "react";
import { NavLink } from "react-router-dom";
import { MdOutlineExplore, MdOutlineLocalOffer } from "react-icons/md";
import { HiOutlineUser } from "react-icons/hi";
import "./Navbar.css";

function Navbar() {
	return (
		<nav className="main-section navbar-container">
			<div className="section-center navbar-center">
				<NavLink
					to="/"
					className={`navlinks ${({ isActive }) =>
						isActive ? "active" : "inactive"}`}
				>
					<MdOutlineExplore />
					<p>Explore</p>
				</NavLink>
				<NavLink
					to="/category/offers"
					className={`navlinks ${({ isActive }) =>
						isActive ? "active" : "inactive"}`}
				>
					<MdOutlineLocalOffer />
					<p>Offers</p>
				</NavLink>
				<NavLink
					to="/profile"
					className={`navlinks ${({ isActive }) =>
						isActive ? "active" : "inactive"}`}
				>
					<HiOutlineUser />
					<p>Profile</p>
				</NavLink>
			</div>
		</nav>
	);
}

export default Navbar;

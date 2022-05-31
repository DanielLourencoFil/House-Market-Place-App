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
					className={({ isActive }) => (isActive ? "active" : "inactive")}
				>
					<MdOutlineExplore />
				</NavLink>
				<NavLink
					to="/offers"
					className={({ isActive }) => (isActive ? "active" : "inactive")}
				>
					<MdOutlineLocalOffer />
				</NavLink>
				<NavLink
					to="/profile"
					className={({ isActive }) => (isActive ? "active" : "inactive")}
				>
					<HiOutlineUser />
				</NavLink>
			</div>
		</nav>
	);
}

export default Navbar;

import "./Navbar.css";
import React from "react";
import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  return (
    <div className="navbar_container">
      <Link
        to={"/"}
        className={
          location.pathname === "/" ? "active_link_navbar" : "link_navbar"
        }
      >
        Homepage
      </Link>
      <Link
        to="/spare_part_management"
        className={
          location.pathname === "/spare_part_management" ||
          location.pathname === "/spare_part_add_data"
            ? "active_link_navbar"
            : "link_navbar"
        }
      >
        Spare part data
      </Link>
      <Link
        to="/machine_management"
        className={
          location.pathname === "/machine_management" ||
          location.pathname === "/machine_add_data" ||
          location.pathname.includes("/machine_detail")
            ? "active_link_navbar"
            : "link_navbar"
        }
      >
        Machine data
      </Link>
      <Link
        to="/maintenance"
        className={
          location.pathname === "/maintenance" ||
          location.pathname.includes("/maintenance_create") ||
          location.pathname === "/maintenance_history" ||
          location.pathname.includes("/maintenance_detail")
            ? "active_link_navbar"
            : "link_navbar"
        }
      >
        Maintenance form
      </Link>
      <Link>Schedule</Link>
      <Link>Request Maintenance</Link>
      <Link>Print form</Link>
    </div>
  );
}

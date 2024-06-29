import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavbarSparePart.css";
import { useState } from "react";

export default function NavbarSparePart() {
  const location = useLocation();
  return (
    <div className="navbar_spare_part_container">
      <h3>Spare Part Data</h3>
      <div>
        <Link
          to="/spare_part_management"
          className={
            location.pathname === "/spare_part_management"
              ? "active_spare_part_link"
              : "spare_part_link"
          }
        >
          Spare Part Management
        </Link>
        <Link
          to="/spare_part_add_data"
          className={
            location.pathname === "/spare_part_add_data"
              ? "active_spare_part_link"
              : "spare_part_link"
          }
        >
          Add Spare Part
        </Link>
      </div>
    </div>
  );
}

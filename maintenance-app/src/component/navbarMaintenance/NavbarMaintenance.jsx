import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavbarMaintenance.css";

export default function NavbarMaintenance() {
  const location = useLocation();
  return (
    <div className="navbar_maintenance">
      <h3>Maintenance Forms</h3>
      <div>
        <Link
          to="/maintenance"
          className={
            location.pathname === "/maintenance"
              ? "active_maintenance_link"
              : "maintenance_link"
          }
        >
          Maintenance Forms List
        </Link>
        <Link
          to="/maintenance_create"
          className={
            location.pathname.includes("/maintenance_create")
              ? "active_maintenance_link"
              : "maintenance_link"
          }
        >
          Create new maintenance form
        </Link>
        <Link
          to="/maintenance_detail"
          className={
            location.pathname.includes("/maintenance_detail")
              ? "active_maintenance_link"
              : "maintenance_link"
          }
        >
          Maintenance detail information
        </Link>
        <Link
          to="/maintenance_history"
          className={
            location.pathname === "/maintenance_history"
              ? "active_maintenance_link"
              : "maintenance_link"
          }
        >
          Maintenance History
        </Link>
      </div>
    </div>
  );
}

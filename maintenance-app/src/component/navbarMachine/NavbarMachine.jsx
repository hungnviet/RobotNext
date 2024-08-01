import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavbarMachine.css";

export default function NavbarMachine() {
  const location = useLocation();
  return (
    <div className="navbar_machine">
      <h3>Machine Data</h3>
      <div>
        <Link
          to="/machine_management"
          className={
            location.pathname === "/machine_management"
              ? "active_machine_link"
              : "machine_link"
          }
        >
          Machine Management
        </Link>
        <Link
          to="/machine_add_data"
          className={
            location.pathname === "/machine_add_data"
              ? "active_machine_link"
              : "machine_link"
          }
        >
          Add new machine
        </Link>
        <Link
          to="/machine_detail"
          className={
            location.pathname.includes("/machine_detail")
              ? "active_machine_link"
              : "machine_link"
          }
        >
          Machine detail information
        </Link>
        <Link
          to="/machine_template_specification"
          className={
            location.pathname.includes("/machine_template_specification")
              ? "active_machine_link"
              : "machine_link"
          }
        >
          Specification Template
        </Link>
      </div>
    </div>
  );
}

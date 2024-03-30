// Sidebar.js
import logo from "../images/logo.jpg";
import "./Sidebar.css";
import React from "react";
import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  return (
    <div
      style={{
        width: "20%",
        height: "100vh",
        backgroundColor: "white",
      }}
    >
      <img
        src={logo}
        style={{
          width: "70%",
          height: "auto",
          marginLeft: "10%",
        }}
      />
      <Link to="/management">
        <button
          className={
            location.pathname === "/management" ? "click2" : "unclick2"
          }
        >
          Management
        </button>
      </Link>
      <Link to="/createform">
        <button
          className={location.pathname === "/createform" ? "click" : "unclick"}
        >
          Create maintenance form
        </button>
      </Link>
      <Link to="/detail">
        <button
          className={location.pathname === "/detail" ? "click" : "unclick"}
        >
          Detailed maintenance information
        </button>
      </Link>
      <Link to="/createtemplate">
        <button
          className={
            location.pathname === "/createtemplate" ? "click" : "unclick"
          }
        >
          Create form template
        </button>
      </Link>
    </div>
  );
}

export default Sidebar;

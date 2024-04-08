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
        alt="Logo"
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
          Management <br /> (Quản lí)
        </button>
      </Link>
      <Link to="/createform">
        <button
          className={location.pathname === "/createform" ? "click" : "unclick"}
        >
          Create maintenance form <br /> (Tạo đơn bảo trì)
        </button>
      </Link>
      <Link to="/detail">
        <button
          className={location.pathname === "/detail" ? "click" : "unclick"}
        >
          Detailed maintenance information <br /> (Thông tin bảo trì)
        </button>
      </Link>
      <Link to="/createtemplate">
        <button
          className={
            location.pathname === "/createtemplate" ? "click" : "unclick"
          }
        >
          Create form template <br /> (Tạo mẫu đơn)
        </button>
      </Link>
      <Link to="/templates">
        <button
          className={location.pathname === "/templates" ? "click" : "unclick"}
        >
          Manage form template <br /> (Quản lí mẫu đơn)
        </button>
      </Link>
    </div>
  );
}

export default Sidebar;

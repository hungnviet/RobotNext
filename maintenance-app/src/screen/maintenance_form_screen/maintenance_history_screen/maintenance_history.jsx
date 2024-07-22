import React from "react";
import "./maintenance_history.css";
import NavbarMaintenance from "../../../component/navbarMaintenance/NavbarMaintenance";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import SearchSparePart from "../../../component/searchSparePart/SearchSparePart";
export default function Machine_history() {
  const [listMaintenance, setListMaintenance] = useState([]);
  const [listMaintenanceDisplay, setListMaintenanceDisplay] = useState([]);

  async function getFormData(count = 0) {
    const response = await fetch("http://localhost:3001/maintenance_history");
    if (response.ok) {
      const data = await response.json();
      setListMaintenance(data);
      setListMaintenanceDisplay(data);
    } else {
      count++;
      if (count < 4) {
        getFormData();
      } else {
        alert("Error fetching data");
      }
    }
  }

  useEffect(() => {
    getFormData();
  }, []);

  return (
    <div className="maintenance_container">
      <NavbarMaintenance />
      <div>List Maintenance Forms ({listMaintenance.length} forms )</div>
      <div className="maintenance_table">
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Machine Name</th>
              <th>Machine Code</th>
              <th>Type of Maintenance</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {listMaintenance.map((maintain, index) => {
              return (
                <tr key={index}>
                  <td>{maintain.maintenance_date}</td>
                  <td>{maintain.machine_code}</td>
                  <td>{maintain.machine_name}</td>
                  <td>{maintain.type_of_maintenance}</td>
                  <td>Detail</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from "react";
import "./Machine_management.css";
import NavbarMachine from "../../../component/navbarMachine/NavbarMachine";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import SearchSparePart from "../../../component/searchSparePart/SearchSparePart";
export default function Machine_management() {
  const [listMachines, setListMachines] = useState([]);
  const [listMachinesDisplay, setListMachinesDisplay] = useState([]);

  async function getMachineData(count = 0) {
    const response = await fetch("http://localhost:3001/list_machines");
    if (response.ok) {
      const data = await response.json();
      setListMachines(data);
      setListMachinesDisplay(data);
    } else {
      count++;
      if (count < 4) {
        getMachineData();
      } else {
        alert("Error fetching data");
      }
    }
  }

  useEffect(() => {
    getMachineData();
  }, []);

  return (
    <div className="machine_management_container">
      <NavbarMachine />
      <div>Machine Management ({listMachines.length} machines )</div>
      <div className="machine_management_table">
        <table>
          <thead>
            <tr>
              <th>Machine Code</th>
              <th>Machine Name</th>
              <th>Date of purchase</th>
              <th>Plant</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {listMachines.map((machine, index) => {
              return (
                <tr key={index}>
                  <td>{machine.machine_code}</td>
                  <td>{machine.machine_name}</td>
                  <td>{machine.date_of_purchase}</td>
                  <td>{machine.plant}</td>
                  <td>
                    <Link
                      to={`/machine_detail/${machine.machine_code}`}
                      className="machine_management_table_link"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

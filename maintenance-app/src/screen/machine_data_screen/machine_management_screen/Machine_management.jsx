import React from "react";
import "./Machine_management.css";
import NavbarMachine from "../../../component/navbarMachine/NavbarMachine";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import SearchSparePart from "../../../component/searchSparePart/SearchSparePart";
export default function Machine_management() {
  const [listMachines, setListMachines] = useState([]);
  const [listMachinesDisplay, setListMachinesDisplay] = useState([]);

  const [listMachineType, setListMachineType] = useState([]);
  const [listPlant, setListPlant] = useState([]);

  const [selectedMachineType, setSelectedMachineType] = useState("All");
  const [searchMachineCode, setSearchMachineCode] = useState("");
  const [searchMachineName, setSearchMachineName] = useState("");
  const [selectedPlant, setSelectedPlant] = useState("All");

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

  function getListMachineType() {
    if (listMachines.length > 0) {
      let listMachineType = [];
      listMachines.forEach((machine) => {
        if (!listMachineType.includes(machine.machine_type)) {
          listMachineType.push(machine.machine_type);
        }
      });
      setListMachineType(listMachineType);
    }
  }

  function getListPlant() {
    if (listMachines.length > 0) {
      let listPlant = [];
      listMachines.forEach((machine) => {
        if (!listPlant.includes(machine.plant)) {
          listPlant.push(machine.plant);
        }
      });
      setListPlant(listPlant);
    }
  }

  function applyFilter() {
    const filteredMachines = listMachines.filter((machine) => {
      const isMachineTypeMatch =
        selectedMachineType === "All" ||
        machine.machine_type.toLowerCase() ===
          selectedMachineType.toLowerCase();
      const isPlantMatch =
        selectedPlant === "All" ||
        machine.plant.toLowerCase() === selectedPlant.toLowerCase();
      const isMachineCodeMatch =
        searchMachineCode === "" ||
        machine.machine_code.includes(searchMachineCode);
      const isMachineNameMatch =
        searchMachineName === "" ||
        machine.machine_name.includes(searchMachineName);

      return (
        isMachineTypeMatch &&
        isPlantMatch &&
        isMachineCodeMatch &&
        isMachineNameMatch
      );
    });

    setListMachinesDisplay(filteredMachines);
  }

  useEffect(() => {
    getMachineData();
  }, []);

  useEffect(() => {
    getListMachineType();
    getListPlant();
  }, [listMachines]);
  return (
    <div className="machine_management_container">
      <NavbarMachine />
      <div>Machine Management ({listMachines.length} machines )</div>
      <div className="machine_management_table">
        <table class="machine_table">
          <thead>
            <tr>
              <th>
                Machine Code
                <input
                  type="text"
                  placeholder="Input Machine Code"
                  value={searchMachineCode}
                  onChange={(e) => setSearchMachineCode(e.target.value)}
                />
              </th>
              <th>
                Machine Type
                <select
                  value={selectedMachineType}
                  onChange={(e) => setSelectedMachineType(e.target.value)}
                >
                  <option value="All">All</option>
                  {listMachineType.map((machineType, index) => (
                    <option key={index} value={machineType}>
                      {machineType}
                    </option>
                  ))}
                </select>
              </th>
              <th>
                Machine Name
                <input
                  type="text"
                  placeholder="Input Machine Name"
                  value={searchMachineName}
                  onChange={(e) => setSearchMachineName(e.target.value)}
                />
              </th>
              <th>Date of Purchase</th>
              <th>
                Plant
                <select
                  value={selectedPlant}
                  onChange={(e) => setSelectedPlant(e.target.value)}
                >
                  <option value="All">All</option>
                  {listPlant.map((plant, index) => (
                    <option key={index} value={plant}>
                      {plant}
                    </option>
                  ))}
                </select>
              </th>
              <th>
                Action
                <button onClick={applyFilter}>Search</button>
              </th>
            </tr>
          </thead>
          <tbody>
            {listMachinesDisplay.map((machine, index) => (
              <tr key={index}>
                <td>{machine.machine_code}</td>
                <td>{machine.machine_type}</td>
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

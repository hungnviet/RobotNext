import React from "react";
import "./maintenance_list.css";
import NavbarMaintenance from "../../../component/navbarMaintenance/NavbarMaintenance";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import SearchSparePart from "../../../component/searchSparePart/SearchSparePart";
export default function Machine_management() {
  const navigate = useNavigate();
  const [listMaintenance, setListMaintenance] = useState([]);
  const [listMachines, setListMachines] = useState([]);

  async function getFormData(count = 0) {
    const response = await fetch("http://localhost:3001/form_history");
    if (response.ok) {
      const data = await response.json();
      setListMaintenance(data);
    } else {
      count++;
      if (count < 4) {
        getFormData();
      } else {
        alert("Error fetching data");
      }
    }
  }
  async function getMachineData(count = 0) {
    const response = await fetch("http://localhost:3001/list_machines");
    if (response.ok) {
      const data = await response.json();
      setListMachines(data);
    } else {
      count++;
      if (count < 4) {
        getMachineData();
      } else {
        alert("Error fetching data");
      }
    }
  }
  function checkMaintenanceType(machineCode, maintenanceType) {
    return listMaintenance.some(
      (maintenance) =>
        maintenance.machine_code === machineCode &&
        maintenance.type_of_maintenance === maintenanceType
    );
  }

  useEffect(() => {
    getFormData();
    getMachineData();
  }, []);

  return (
    <div className="maintenance_container">
      <NavbarMaintenance />
      <div>
        <p>
          Currently, There are {listMachines.length} machines in the system and{" "}
          {listMaintenance.length} maintenance forms template
        </p>
        <p>
          (Hiện tại có {listMachines.length} máy trong hệ thống và{" "}
          {listMaintenance.length} mẫu đơn bảo tri.)
        </p>
      </div>
      <div className="maintenance_table">
        <table>
          <thead>
            <tr>
              <th>Machine Code</th>
              <th>Machine Name</th>
              <th>Weekly</th>
              <th>Monthly</th>
              <th>Half-Yearly</th>
              <th>Yearly</th>
            </tr>
          </thead>
          <tbody>
            {listMachines.map((machine, index) => (
              <tr key={index}>
                <td>{machine.machine_code}</td>
                <td>{machine.machine_name}</td>
                <td>
                  {checkMaintenanceType(machine.machine_code, "Weekly") ? (
                    <>
                      <button
                        onClick={() =>
                          navigate(
                            `/maintenance_detail/${machine.machine_code}/Weekly`
                          )
                        }
                        className="machine_management_table_link"
                      >
                        Fill in
                      </button>
                      <button>Edit</button>
                    </>
                  ) : (
                    "No"
                  )}
                </td>
                <td>
                  {checkMaintenanceType(machine.machine_code, "Monthly") ? (
                    <>
                      <button
                        onClick={() =>
                          navigate(
                            `/maintenance_detail/${machine.machine_code}/Monthly`
                          )
                        }
                        className="machine_management_table_link"
                      >
                        Fill in
                      </button>
                      <button>Edit</button>
                    </>
                  ) : (
                    "No"
                  )}
                </td>
                <td>
                  {checkMaintenanceType(machine.machine_code, "Half-Yearly") ? (
                    <>
                      <button
                        onClick={() =>
                          navigate(
                            `/maintenance_detail/${machine.machine_code}/Halfyearly`
                          )
                        }
                        className="machine_management_table_link"
                      >
                        Fill in
                      </button>
                      <button>Edit</button>
                    </>
                  ) : (
                    "No"
                  )}
                </td>
                <td>
                  {checkMaintenanceType(machine.machine_code, "Yearly") ? (
                    <>
                      <button
                        onClick={() =>
                          navigate(
                            `/maintenance_detail/${machine.machine_code}/Yearly`
                          )
                        }
                        className="machine_management_table_link"
                      >
                        Fill in
                      </button>
                      <button>Edit</button>
                    </>
                  ) : (
                    "No"
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import React from "react";
import "./Machine_management.css";
import NavbarMachine from "../../../component/navbarMachine/NavbarMachine";
import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function Machine_management() {
  const [listMachines, setListMachines] = useState([]);

  const [listMachinesDisplay, setListMachinesDisplay] = useState([]);
  const [orderDateOfPurchase, setOrderDateOfPurchase] = useState("none");

  async function getMachineData(count = 0) {
    const response = await fetch("http://localhost:3001/list_machines");
    if (response.ok) {
      const data = await response.json();
      setListMachines(data);
      setListMachinesDisplay(data);
    } else {
      count++;
      if (count < 4) {
        getMachineData(count); // Fixed missing count argument
      } else {
        alert("Error fetching data");
      }
    }
  }

  useEffect(() => {
    getMachineData();
  }, []);
  function viewMachineDetails(machine) {
    console.log(machine);
  }
  function deleteMachine(machineCode) {
    fetch(`http://localhost:3001/machine/${machineCode}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data === "Machine deleted successfully") {
          setListMachines((prevList) =>
            prevList.filter((machine) => machine.machine_code !== machineCode)
          );
          setListMachinesDisplay((prevList) =>
            prevList.filter((machine) => machine.machine_code !== machineCode)
          );
        } else {
          alert("Error deleting machine");
        }
      });
  }

  function sortByDateOfPurchase() {
    let sortedList = [...listMachinesDisplay];
    if (orderDateOfPurchase === "asc") {
      sortedList.sort((a, b) => {
        const dateA = new Date(
          a.date_of_purchase.split("-").reverse().join("-")
        );
        const dateB = new Date(
          b.date_of_purchase.split("-").reverse().join("-")
        );
        return dateA - dateB;
      });
    } else if (orderDateOfPurchase === "dec") {
      sortedList.sort((a, b) => {
        const dateA = new Date(
          a.date_of_purchase.split("-").reverse().join("-")
        );
        const dateB = new Date(
          b.date_of_purchase.split("-").reverse().join("-")
        );
        return dateB - dateA;
      });
    }
    setListMachinesDisplay(sortedList);
  }

  function toggleSortOrder() {
    setOrderDateOfPurchase((prevOrder) => {
      if (prevOrder === "none" || prevOrder === "desc") return "asc";
      if (prevOrder === "asc") return "desc";
    });
    sortByDateOfPurchase(); // Call sort function after updating the state
  }

  useEffect(() => {
    sortByDateOfPurchase(); // Re-sort whenever the order changes
  }, [orderDateOfPurchase]);

  return (
    <div className="machine_management_container">
      <NavbarMachine />
      <div>
        <p>You have totally {listMachines.length} machines in the system</p>
        <p>Hiện tại, có {listMachines.length} máy trong hệ thống</p>
        <select onChange={(e) => setOrderDateOfPurchase(e.target.value)}>
          <option value="none">None</option>
          <option value="asc">Ascending</option>
          <option value="dec">Descending</option>
        </select>{" "}
      </div>
      <div className="machine_management_table">
        <table>
          <thead>
            <tr>
              <th>Index</th> {/* Added Index column */}
              <th>Machine Code</th>
              <th>Machine Name</th>
              <th>Date of purchase</th>
              <th>Plant</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {listMachinesDisplay.map((machine, index) => (
              <tr key={index}>
                <td>{index + 1}</td> {/* Display index starting from 1 */}
                <td>{machine.machine_code}</td>
                <td>{machine.machine_name}</td>
                <td>{machine.date_of_purchase}</td>
                <td>{machine.plant}</td>
                <td>
                  <Link
                    to={`/machine_detail/${machine.machine_code}`}
                    className="viewbutton"
                  >
                    View
                  </Link>
                  <button
                    className="deletebutton"
                    onClick={() => deleteMachine(machine.machine_code)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Link to="/machine_add_data" className="addmachinebutton">
        Add new machine
      </Link>
    </div>
  );
}

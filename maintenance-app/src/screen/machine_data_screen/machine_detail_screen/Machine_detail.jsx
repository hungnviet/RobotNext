import React, { useEffect, useState } from "react";
import "./Machine_detail.css";
import { useParams } from "react-router-dom";
import NavbarMachine from "../../../component/navbarMachine/NavbarMachine";

export default function Machine_detail() {
  const { machineCode } = useParams();
  const [machine, setMachine] = useState(null);

  useEffect(() => {
    if (machineCode) {
      fetch(`http://localhost:3001/machine/${machineCode}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Machine not found");
          }
          return response.json();
        })
        .then((data) => setMachine(data))
        .catch((error) =>
          console.error("Failed to fetch machine details:", error)
        );
    }
  }, [machineCode]);

  function deletespec(name) {
    fetch(`http://localhost:3001/delete_specification/${machineCode}/${name}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setMachine((prevMachine) => {
            const newSpec = prevMachine.specification.filter(
              (spec) => spec.name !== name
            );
            return { ...prevMachine, specification: newSpec };
          });
        } else {
          alert("Error deleting specification");
        }
      });
  }

  return (
    <div>
      <NavbarMachine />
      {machine ? (
        <div className="machine-detail">
          <h2>{machine.machine_name}</h2>
          <p>Code: {machine.machine_code}</p>
          <p>Date of Purchase: {machine.date_of_purchase}</p>
          <p>Plant: {machine.plant}</p>
          <h3>Specifications:</h3>
          <table className="specification-table">
            <thead>
              <tr className="specification-header">
                <th>Name</th>
                <th>Value</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {machine.specification.map((spec, index) => (
                <tr key={index} className="specification-row">
                  <td>{spec.name}</td>
                  <td>{spec.value}</td>
                  <td>
                    <button
                      className="deletebutton"
                      onClick={() => deletespec(spec.name)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <form className="maintenance-form">
            <h3>List of spare parts for half yearly maintenance:</h3>
            <table>
              <thead>
                <tr>
                  <th>Spare part code</th>
                  <th>Spare part name</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {machine.spare_part_for_half_yearly_maintenance.map(
                  (part, index) => (
                    <tr key={index}>
                      <td>{part.spare_part_code}</td>
                      <td>{part.spare_part_name}</td>
                      <td>{part.quantity}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            <p>ESTIMATE PRICE: 100,000 VND</p>
            <button>Add spare part</button>
          </form>

          <form className="maintenance-form">
            <h3>List of spare parts for yearly maintenance:</h3>
            <table>
              <thead>
                <tr>
                  <th>Spare part code</th>
                  <th>Spare part name</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {machine.spare_part_for_yearly_maintenance.map(
                  (part, index) => (
                    <tr key={index}>
                      <td>{part.spare_part_code}</td>
                      <td>{part.spare_part_name}</td>
                      <td>{part.quantity}</td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            <p>ESTIMATE PRICE: 100,000 VND</p>
            <button>Add spare part</button>
          </form>

          <div className="additional-data">
            <h3>Additional Data:</h3>
            <ul>
              {machine.additional_data.map((data, index) => (
                <li key={index}>{data.content}</li>
              ))}
            </ul>
            <button>Add more information</button>
          </div>
        </div>
      ) : (
        <p>No machine code available or machine not found.</p>
      )}
    </div>
  );
}

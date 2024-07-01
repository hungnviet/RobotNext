import React, { useEffect, useState } from "react";
import "./Machine_add_data.css";
import NavbarMachine from "../../../component/navbarMachine/NavbarMachine";

export default function Machine_detail() {
  const [spareParts, setSpareParts] = useState([]);

  const [newMachine, setNewMachine] = useState({
    machine_name: "",
    machine_code: "",
    date_of_purchase: "",
    plant: "",
    specification: [],
    spare_part_for_half_yearly_maintenance: [],
    spare_part_for_yearly_maintenance: [],
    additional_data: [],
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMachine((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const addNewSpecification = () => {
    const newSpec = { name: "", value: "" };
    setNewMachine((prev) => ({
      ...prev,
      specification: [...prev.specification, newSpec],
    }));
  };

  const handleSpecificationChange = (index, field, value) => {
    const updatedSpecifications = newMachine.specification.map((spec, i) => {
      if (i === index) {
        return { ...spec, [field]: value };
      }
      return spec;
    });
    setNewMachine((prev) => ({
      ...prev,
      specification: updatedSpecifications,
    }));
  };

  const deleteSpecification = (index) => {
    setNewMachine((prev) => ({
      ...prev,
      specification: prev.specification.filter((_, i) => i !== index),
    }));
  };

  const addNewHalfYearlySparePart = () => {
    const newPart = { spare_part_code: "", spare_part_name: "", quantity: "" };
    setNewMachine((prev) => ({
      ...prev,
      spare_part_for_half_yearly_maintenance: [
        ...prev.spare_part_for_half_yearly_maintenance,
        newPart,
      ],
    }));
  };

  const deleteHalfYearlySparePart = (index) => {
    setNewMachine((prev) => ({
      ...prev,
      spare_part_for_half_yearly_maintenance:
        prev.spare_part_for_half_yearly_maintenance.filter(
          (_, i) => i !== index
        ),
    }));
  };

  const handleSparePartChange = (index, selectedCode) => {
    const selectedSparePart = spareParts.find(
      (sparePart) => sparePart.spare_part_code === selectedCode
    );

    if (!selectedSparePart) return;

    const updatedSpareParts =
      newMachine.spare_part_for_half_yearly_maintenance.map((part, i) => {
        if (i === index) {
          return {
            ...part,
            spare_part_code: selectedSparePart.spare_part_code,
            spare_part_name: selectedSparePart.spare_part_name,
            quantity: selectedSparePart.inventory_quantity,
          };
        }
        return part;
      });

    setNewMachine({
      ...newMachine,
      spare_part_for_half_yearly_maintenance: updatedSpareParts,
    });
  };

  const addNewYearlySparePart = () => {
    const newPart = { spare_part_code: "", spare_part_name: "", quantity: "" };
    setNewMachine((prev) => ({
      ...prev,
      spare_part_for_yearly_maintenance: [
        ...prev.spare_part_for_yearly_maintenance,
        newPart,
      ],
    }));
  };

  const deleteYearlySparePart = (index) => {
    setNewMachine((prev) => ({
      ...prev,
      spare_part_for_yearly_maintenance:
        prev.spare_part_for_yearly_maintenance.filter((_, i) => i !== index),
    }));
  };

  const handleYearlySparePartChange = (index, selectedCode) => {
    const selectedSparePart = spareParts.find(
      (sparePart) => sparePart.spare_part_code === selectedCode
    );

    if (!selectedSparePart) return;

    const updatedYearlySpareParts =
      newMachine.spare_part_for_yearly_maintenance.map((part, i) => {
        if (i === index) {
          return {
            ...part,
            spare_part_code: selectedSparePart.spare_part_code,
            spare_part_name: selectedSparePart.spare_part_name,
            quantity: selectedSparePart.inventory_quantity,
          };
        }
        return part;
      });

    setNewMachine({
      ...newMachine,
      spare_part_for_yearly_maintenance: updatedYearlySpareParts,
    });
  };

  const addNewAdditionalData = () => {
    const newData = { content: "" };
    setNewMachine((prev) => ({
      ...prev,
      additional_data: [...prev.additional_data, newData],
    }));
  };

  useEffect(() => {
    fetch("http://localhost:3001/list_spare_parts")
      .then((res) => res.json())
      .then((data) => {
        setSpareParts(data);
      });
  }, []);

  const transformData = (data) => {
    // Reformat date_of_purchase
    const dateParts = data.date_of_purchase.split("-");
    const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

    // Adjust spare parts (remove spare_part_name)
    const adjustSpareParts = (parts) =>
      parts.map(({ spare_part_code, quantity }) => ({
        spare_part_code,
        quantity,
      }));

    return {
      machine_name: data.machine_name,
      machine_code: data.machine_code,
      date_of_purchase: formattedDate,
      plant: data.plant,
      specification: data.specification,
      spare_part_for_half_yearly_maintenance: adjustSpareParts(
        data.spare_part_for_half_yearly_maintenance
      ),
      spare_part_for_yearly_maintenance: adjustSpareParts(
        data.spare_part_for_yearly_maintenance
      ),
      additional_data: data.additional_data, // Adjust as needed
    };
  };

  const handleSubmit = () => {
    const formattedData = transformData(newMachine);

    // Use fetch to send the data to your server endpoint
    fetch("http://localhost:3001/machine", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formattedData),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
        // Handle success response
      })
      .catch((error) => {
        console.error("Error:", error);
        // Handle errors here
      });
  };

  return (
    <div>
      <NavbarMachine />
      <div className="machine-detail">
        <h2>Add New Machine</h2>
        <form>
          <input
            type="text"
            name="machine_name"
            placeholder="Machine Name"
            value={newMachine.machine_name}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="machine_code"
            placeholder="Machine Code"
            value={newMachine.machine_code}
            onChange={handleInputChange}
          />
          <input
            type="date"
            name="date_of_purchase"
            placeholder="Date of Purchase"
            value={newMachine.date_of_purchase}
            onChange={handleInputChange}
          />
          <input
            type="text"
            name="plant"
            placeholder="Plant"
            value={newMachine.plant}
            onChange={handleInputChange}
          />
          <h3>Specifications:</h3>
          <table className="specification-table">
            <thead>
              <tr className="specification-header">
                <th>Name</th>
                <th>Value</th>
                <th style={{ width: "10%" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {newMachine.specification.map((spec, index) => (
                <tr key={index} className="specification-row">
                  <td>
                    <input
                      type="text"
                      value={spec.name}
                      onChange={(e) =>
                        handleSpecificationChange(index, "name", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={spec.value}
                      onChange={(e) =>
                        handleSpecificationChange(
                          index,
                          "value",
                          e.target.value
                        )
                      }
                    />
                  </td>
                  <td>
                    <button
                      className="deletebutton"
                      onClick={() => deleteSpecification(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button type="button" onClick={addNewSpecification}>
            Add specification
          </button>
          <form className="maintenance-form">
            <h3>List of spare parts for half yearly maintenance:</h3>
            <table>
              <thead>
                <tr>
                  <th>Spare part code</th>
                  <th>Spare part name</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {newMachine.spare_part_for_half_yearly_maintenance.map(
                  (part, index) => (
                    <tr key={index}>
                      <td>
                        <select
                          value={part.spare_part_code}
                          onChange={(e) =>
                            handleSparePartChange(index, e.target.value)
                          }
                        >
                          {spareParts.map((sparePart) => (
                            <option
                              key={sparePart.spare_part_code}
                              value={sparePart.spare_part_code}
                            >
                              {sparePart.spare_part_code}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input type="text" value={part.spare_part_name} />
                      </td>
                      <td>
                        <input type="text" value={part.quantity} />
                      </td>
                      <td>
                        <button
                          className="deletebutton"
                          onClick={() => deleteHalfYearlySparePart(index)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            <p>ESTIMATE PRICE: 100,000 VND</p>
            <button type="button" onClick={addNewHalfYearlySparePart}>
              Add spare part
            </button>
          </form>

          <form className="maintenance-form">
            <h3>List of spare parts for yearly maintenance:</h3>
            <table>
              <thead>
                <tr>
                  <th>Spare part code</th>
                  <th>Spare part name</th>
                  <th>Quantity</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {newMachine.spare_part_for_yearly_maintenance.map(
                  (part, index) => (
                    <tr key={index}>
                      <td>
                        <select
                          value={part.spare_part_code}
                          onChange={(e) =>
                            handleYearlySparePartChange(index, e.target.value)
                          }
                        >
                          {spareParts.map((sparePart) => (
                            <option
                              key={sparePart.spare_part_code}
                              value={sparePart.spare_part_code}
                            >
                              {sparePart.spare_part_code}
                            </option>
                          ))}
                        </select>{" "}
                      </td>
                      <td>
                        <input type="text" value={part.spare_part_name} />
                      </td>
                      <td>
                        <input type="text" value={part.quantity} />
                      </td>
                      <td>
                        <button
                          className="deletebutton"
                          onClick={() => deleteYearlySparePart(index)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
            <p>ESTIMATE PRICE: 100,000 VND</p>
            <button type="button" onClick={addNewYearlySparePart}>
              Add spare part
            </button>
          </form>

          <div className="additional-data">
            <h3>Additional Data:</h3>
            <ul>
              {newMachine.additional_data.map((data, index) => (
                <li key={index}>
                  <input type="text" value={data.content} />
                </li>
              ))}
            </ul>
            <button onClick={addNewAdditionalData}>Add more information</button>
          </div>
        </form>
        <div className="submit-button-container">
          <button type="button" onClick={handleSubmit}>
            Add New Machine
          </button>
        </div>
      </div>
    </div>
  );
}

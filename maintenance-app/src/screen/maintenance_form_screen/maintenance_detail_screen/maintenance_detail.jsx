import React, { useState, useEffect } from "react";
import "./maintenance_detail.css";
import { useParams } from "react-router-dom";
import NavbarMaintenance from "../../../component/navbarMaintenance/NavbarMaintenance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function Maintenance_detail() {
  const [formMaintain, setformMaintain] = useState("");
  const [searchMachineCode, setSearchMachineCode] = useState("");
  const [searchMaintenanceType, setSearchMaintenanceType] = useState("");
  const { machine_code, maintenanceType, maintenance_code } = useParams();
  const [checkboxState, setCheckboxState] = useState({});
  const [note, setNote] = useState("");
  const [remark, setRemark] = useState("");
  const [checkedBy, setCheckedBy] = useState("");
  const [isExist, setIsExist] = useState(false);
  const [approvedBy, setApprovedBy] = useState("");

  useEffect(() => {
    setSearchMachineCode(machine_code);
    setSearchMaintenanceType(maintenanceType);
    fetchData(machine_code, maintenanceType);
    fetchexistMaintin(maintenance_code);
  }, [machine_code, maintenanceType, maintenance_code]);

  async function fetchData(code, type) {
    await fetchformMaintain(code, type);
  }

  async function fetchformMaintain(code, type) {
    const response = await fetch(
      `http://localhost:3001/form_detail/${code}/${type}`
    );
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setformMaintain(data);
    } else {
      setformMaintain("");
    }
  }
  function updateCheckboxState(fields) {
    const newState = {};
    fields.forEach((field, fieldIndex) => {
      field.requirement.forEach((req, reqIndex) => {
        const key = `field_${fieldIndex}_req_${reqIndex}`;
        newState[key] = req.status ? "yes" : "no";
      });
    });
    setCheckboxState(newState);
  }
  async function fetchexistMaintin(code) {
    const response = await fetch(
      `http://localhost:3001/maintenance_detail/${code}`
    );
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setformMaintain(data);
      setIsExist(true);
      updateCheckboxState(data.fields);
      setNote(data.note);
      setRemark(data.remark);
      setCheckedBy(data["Checked by"]);
      setApprovedBy(data["Approved by"]);
    } else {
      setformMaintain("");
    }
  }
  function handleSearch(e) {
    fetchData(searchMachineCode, searchMaintenanceType);
  }
  const handleCheckboxChange = (fieldIndex, reqIndex, value) => {
    const key = `field_${fieldIndex}_req_${reqIndex}`;
    console.log(`Setting ${key} to ${value}`); // Log the key and value
    setCheckboxState({ ...checkboxState, [key]: value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let allRequirementsChecked = true;
    formMaintain.fields.forEach((field, index) => {
      field.fieldIndex = index;
    });

    for (const field of formMaintain.fields) {
      for (const [index, req] of field.requirement.entries()) {
        const key = `field_${field.fieldIndex}_req_${index}`;
        console.log(
          `Checking requirement: ${key}, Checked: ${checkboxState[key]}`
        );
        if (
          !checkboxState[key] ||
          (checkboxState[key] !== "yes" && checkboxState[key] !== "no")
        ) {
          allRequirementsChecked = false;
          break;
        }
      }
      if (!allRequirementsChecked) break;
    }

    if (!allRequirementsChecked) {
      toast.info("Please check all requirements before submitting.");
      return;
    }
    if (!remark || !checkedBy || !approvedBy) {
      toast.info("Please fill in all fields before submitting.");
      return;
    }

    const formData = {
      maintenance_date: new Date().toISOString().split("T")[0],
      machine_name: formMaintain.machine_name,
      machine_code: formMaintain.machine_code,
      type_of_maintenance: formMaintain.type_of_maintenance,
      fields: formMaintain.fields.map((field) => ({
        field_name: field.field_name,
        requirement: field.requirement.map((req, index) => ({
          name: req.name,
          status:
            checkboxState[`field_${field.fieldIndex}_req_${index}`] === "yes",
        })),
      })),
      note: note,
      remark: remark,
      "Checked by": checkedBy,
      "Approved by": approvedBy,
    };

    // Send the data to the server
    try {
      const response = await fetch("http://localhost:3001/maintenance_new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        toast.success("Form submitted successfully!");
      } else {
        console.error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <div>
      <NavbarMaintenance />
      <ToastContainer />

      <div className="maintaindetail">
        <form onSubmit={handleSearch} className="search-maintain">
          <input
            type="text"
            placeholder="Machine Code"
            value={searchMachineCode}
            onChange={(e) => setSearchMachineCode(e.target.value)}
          />
          <select
            value={searchMaintenanceType}
            onChange={(e) => setSearchMaintenanceType(e.target.value)}
          >
            <option value="">Select Maintenance Type</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="HalfYearly">HalfYearly</option>
            <option value="Yearly">Yearly</option>
          </select>
          <button type="submit">Search</button>
        </form>
        {formMaintain ? (
          <div className="fillformcontainer">
            <div className="machineinfor">
              <div>
                <h3>Machine Name:</h3>
                <p>{formMaintain.machine_name}</p>
              </div>
              <div>
                <h3>Machine Code:</h3>
                <p>{formMaintain.machine_code}</p>
              </div>
              <div>
                <h3>Type of Maintenance:</h3>
                <p>{formMaintain.type_of_maintenance}</p>
              </div>
              <div>
                <h3>Current Date:</h3>
                <p>{new Date().toLocaleDateString()}</p>
              </div>
            </div>
            <div>
              {formMaintain.fields.map((field, index) => (
                <div key={index} className="formtable-container">
                  <table className="formTable">
                    <thead>
                      <tr>
                        <th>{field.field_name}</th>
                        <th>Yes</th>
                        <th>No</th>
                      </tr>
                    </thead>
                    <tbody>
                      {field.requirement.map((req, reqIndex) => {
                        const key = `field_${index}_req_${reqIndex}`;
                        return (
                          <tr key={reqIndex}>
                            <td>
                              Requirement {reqIndex + 1}: {req.name}
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name={`yes_${index}_${reqIndex}`}
                                className="formfillcheck"
                                checked={checkboxState[key] === "yes"}
                                onChange={() =>
                                  handleCheckboxChange(index, reqIndex, "yes")
                                }
                              />
                            </td>
                            <td>
                              <input
                                type="checkbox"
                                name={`no_${index}_${reqIndex}`}
                                className="formfillcheck"
                                checked={checkboxState[key] === "no"}
                                onChange={() =>
                                  handleCheckboxChange(index, reqIndex, "no")
                                }
                                style={{
                                  backgroundColor:
                                    checkboxState[key] === "no"
                                      ? "red"
                                      : "transparent",
                                }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
            <div className="notefill">
              <h2>Note</h2>
              <input
                type="text"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
            <div className="confirmfill">
              <div>
                <h3>Remark</h3>
                <input
                  type="text"
                  value={remark}
                  onChange={(e) => setRemark(e.target.value)}
                />
              </div>
              <div>
                <h3>Checked by</h3>
                <input
                  type="text"
                  value={checkedBy}
                  onChange={(e) => setCheckedBy(e.target.value)}
                />
              </div>
              <div>
                <h3>Approved by</h3>
                <input
                  type="text"
                  value={approvedBy}
                  onChange={(e) => setApprovedBy(e.target.value)}
                />
              </div>
            </div>
            {!isExist ? (
              <button className="submitfill" onClick={handleSubmit}>
                Save
              </button>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

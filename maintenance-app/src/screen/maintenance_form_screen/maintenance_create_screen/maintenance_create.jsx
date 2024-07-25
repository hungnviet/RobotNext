import React, { useState, useEffect } from "react";
import "./maintenance_create.css";
import { useParams } from "react-router-dom";
import SearchSparePart from "../../../component/searchSparePart/SearchSparePart";
import NavbarMaintenance from "../../../component/navbarMaintenance/NavbarMaintenance";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Form_Create() {
  const { machine_code, maintenanceType } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [listMachines, setListMachines] = useState([]);
  const [machineCode, setMachineCode] = useState("");
  const [typemaintain, setTypeMaintain] = useState("Weekly");
  const [formData, setFormData] = useState([]);
  const [isValid, setIsValid] = useState(false);
  const [isExist, setExist] = useState(false);
  const [fields, setFields] = useState([
    {
      field_name: "",
      requirement: [{ name: "", status: false }],
    },
  ]);

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
  async function getFormData(count = 0) {
    const response = await fetch("http://localhost:3001/form_history");
    if (response.ok) {
      const data = await response.json();
      setFormData(data);
    } else {
      count++;
      if (count < 4) {
        getFormData();
      } else {
        alert("Error fetching data");
      }
    }
  }
  function updateFormFieldsWithFetchedData(fetchedData) {
    setMachineCode(fetchedData.machine_code);
    setTypeMaintain(fetchedData.type_of_maintenance);

    const updatedFields = fetchedData.fields.map((field) => ({
      field_name: field.field_name,
      requirement: field.requirement.map((req) => ({
        name: req.name,
        status: req.status,
        requirement: req.requirement || "",
      })),
    }));

    setFields(updatedFields);
  }

  async function fetchformMaintain(code, type) {
    const response = await fetch(
      `http://localhost:3001/form_detail/${code}/${type}`
    );
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      updateFormFieldsWithFetchedData(data);
    }
  }

  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      setSearchResults(listMachines);
      return;
    }

    const filteredResults = listMachines.filter(
      (machine) =>
        machine.machine_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        machine.machine_code.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setSearchResults(filteredResults);
  };
  const verifyFormData = () => {
    if (!machineCode || !typemaintain) {
      toast.error("Please fill in all fields.");
      return;
    }
    if (
      listMachines.find((machine) => machine.machine_code === machineCode) ===
      undefined
    ) {
      toast.error("Machine code not found in the system");
      setExist(false);
      setIsValid(false);
      return;
    }

    const exists = formData.find(
      (form) =>
        form.machine_code === machineCode &&
        form.type_of_maintenance === typemaintain
    );

    if (exists) {
      toast.info(
        "A form is already created for this machine with the specified type of maintenance. You can edit it now."
      );
      fetchformMaintain(machineCode, typemaintain);
      setExist(true);
    } else {
      toast.success(
        "No existing form found for this machine with the specified type of maintenance. You can create a new one."
      );
      setIsValid(true);
      setExist(false);
      setFields([
        {
          field_name: "",
          requirement: [{ name: "", status: false }],
        },
      ]);
    }
  };
  const handleAddField = () => {
    const newField = {
      field_name: "",
      requirement: [{ name: "", requirement: "", status: false }],
    };
    setFields([...fields, newField]);
  };

  const handleAddRequirement = (fieldIndex) => {
    const newRequirement = { name: "", requirement: "", status: false };
    const updatedFields = [...fields];
    updatedFields[fieldIndex].requirement.push(newRequirement);
    setFields(updatedFields);
  };
  const handleFieldNameChange = (e, fieldIndex) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].field_name = e.target.value;
    setFields(updatedFields);
  };
  const handleRequirementNameChange = (e, fieldIndex, reqIndex) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].requirement[reqIndex].name = e.target.value;
    setFields(updatedFields);
  };

  const deleteField = (fieldIndex) => {
    const updatedFields = fields.filter((_, index) => index !== fieldIndex);
    setFields(updatedFields);
  };

  const deleteRequirement = (fieldIndex, reqIndex) => {
    const updatedFields = [...fields];
    updatedFields[fieldIndex].requirement = updatedFields[
      fieldIndex
    ].requirement.filter((_, index) => index !== reqIndex);
    setFields(updatedFields);
  };
  const handleSubmit = async () => {
    const submissionData = {
      machine_name:
        listMachines.find((machine) => machine.machine_code === machineCode)
          ?.machine_name || "",
      machine_code: machineCode,
      type_of_maintenance: typemaintain,
      fields: fields,
      note: "",
      remark: "",
      "Checked by": "",
      "Approved by": "",
    };

    try {
      const response = await fetch("http://localhost:3001/form_new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message);
      } else {
        toast.error(result.message || "Error saving template data");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error saving template data");
    }
  };
  const handleUpdate = async () => {
    const submissionData = {
      machine_name:
        listMachines.find((machine) => machine.machine_code === machineCode)
          ?.machine_name || "",
      machine_code: machineCode,
      type_of_maintenance: typemaintain,
      fields: fields,
      note: "",
      remark: "",
      "Checked by": "",
      "Approved by": "",
    };

    try {
      const url = `http://localhost:3001/form_update/${machineCode}/${typemaintain}`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Updated form successfully");
      } else {
        toast.error(result.message || "Error saving template data");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error saving template data");
    }
  };
  useEffect(() => {
    getMachineData();
    getFormData();
    setMachineCode(machine_code);
    if (maintenanceType) setTypeMaintain(maintenanceType);
    if (machine_code && maintenanceType) {
      fetchformMaintain(machine_code, maintenanceType);
      setExist(true);
    }
  }, [machine_code, maintenanceType]);

  return (
    <div>
      <NavbarMaintenance />
      <ToastContainer />

      <div className="maintenance_search">
        <div className="search_field">
          <p>
            Search your machine code with name (truy suất mã số máy thông qua
            tên)
          </p>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search..."
          />
          <button onClick={() => handleSearch(searchTerm)}>Search</button>
        </div>
        <div className="search_results">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Machine Name</th>
                  <th>Machine Code</th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((machine, index) => (
                  <tr
                    style={{ cursor: "pointer" }}
                    key={index}
                    onClick={() => setMachineCode(machine.machine_code)}
                  >
                    <td>{machine.machine_name}</td>
                    <td>{machine.machine_code}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <div className="createform">
        <h1>Create Form Template</h1>
        <p>
          *Note: You can only create forms for existing machines in the system;
          please use the above search engine to find your exact machine code.
        </p>
        <p>
          *Ghi chú: Bạn chỉ có thể tạo biểu mẫu cho các máy hiện có trong hệ
          thống; vui lòng sử dụng công cụ tìm kiếm ở trên để tìm mã máy chính
          xác của bạn.
        </p>
        <div className="formname">
          <p>Machine code: </p>
          <input
            type="text"
            value={machineCode}
            onChange={(e) => setMachineCode(e.target.value)}
            placeholder="Enter machine code"
          />
          <p>Type of Maintenance</p>
          <select
            className="typemaintain"
            value={typemaintain}
            onChange={(e) => setTypeMaintain(e.target.value)}
          >
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
            <option value="HalfYearly">HalfYearly</option>
            <option value="Yearly">Yearly</option>
          </select>
          <button onClick={verifyFormData}>Verify(kiểm tra)</button>{" "}
        </div>
        <p>
          We will check the existence of the machine and whether the form
          already exists.
        </p>
        <p>
          Chúng tôi sẽ kiểm tra sự tồn tại của máy và liệu mẫu đã tồn tại hay
          chưa.
        </p>
        {isValid || isExist ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            {isExist && (
              <div className="notice_existed_form">
                The form has existed, you can edit it now!
              </div>
            )}
            <div>
              {fields.map((field, fieldIndex) => (
                <div key={fieldIndex}>
                  <table>
                    <thead>
                      <tr>
                        <th>Field Name</th>
                        <th>Requirement</th>
                        <th>
                          <button
                            className="deletemaintain"
                            onClick={() => deleteField(fieldIndex)}
                          >
                            Delete Field
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {field.requirement.map((req, reqIndex) => (
                        <tr key={reqIndex}>
                          {reqIndex === 0 ? (
                            <td rowSpan={field.requirement.length}>
                              <input
                                type="text"
                                value={field.field_name}
                                size={40}
                                style={{
                                  border: "none",
                                  borderBottom: "1px solid",
                                  padding: "10px",
                                }}
                                onChange={(e) =>
                                  handleFieldNameChange(e, fieldIndex)
                                }
                              />
                            </td>
                          ) : null}
                          <td>
                            <input
                              type="text"
                              value={req.name}
                              size={40}
                              style={{
                                border: "none",
                                borderBottom: "1px solid",
                                padding: "10px",
                              }}
                              onChange={(e) =>
                                handleRequirementNameChange(
                                  e,
                                  fieldIndex,
                                  reqIndex
                                )
                              }
                            />
                          </td>

                          <td>
                            <button
                              className="deletemaintain"
                              style={{ color: "black" }}
                              onClick={() =>
                                deleteRequirement(fieldIndex, reqIndex)
                              }
                            >
                              Delete Requirement
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <button
                    className="addmaintain"
                    onClick={() => handleAddRequirement(fieldIndex)}
                  >
                    Add Requirement
                  </button>
                </div>
              ))}
              <button className="addmaintain" onClick={handleAddField}>
                Add Field
              </button>
            </div>
            {!isExist ? (
              <button className="submitmaintain" onClick={handleSubmit}>
                CREATE TEMPLATE <br /> (THÊM MẪU ĐƠN)
              </button>
            ) : (
              <button className="submitmaintain" onClick={handleUpdate}>
                Update Form
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}

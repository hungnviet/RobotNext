import React, { useState } from "react";

const DailyTemplate = ({
  machineName,
  typemaintain,
  machineCode,
  fields,
  handleFieldNameChange,
  deleteField,
  handleRequirementNameChange,
  deleteRequirement,
  handleAddRequirement,
  handleAddField,
}) => {
  const [dailyType, setdaily] = useState("first");
  const generateDayHeaders = () => {
    const start = dailyType === "first" ? 1 : 16;
    const end = dailyType === "first" ? 15 : 31;
    const headers = [];
    for (let i = start; i <= end; i++) {
      headers.push(<th key={i}>{i}</th>);
    }
    return headers;
  };

  const renderRows = (field, fieldIndex) => {
    return field.requirement.map((req, reqIndex) => (
      <tr key={`${fieldIndex}-${reqIndex}`}>
        {/* Serial number */}
        <td>{reqIndex + 1}</td>
        {/* Machine type */}
        {reqIndex === 0 ? (
          <td rowSpan={field.requirement.length}>
            <input
              type="text"
              placeholder="Type the field name"
              value={field.field_name}
              size={40}
              style={{
                border: "none",
                borderBottom: "1px solid",
                padding: "10px",
              }}
              onChange={(e) => handleFieldNameChange(e, fieldIndex)}
            />
            <button
              className="deletemaintain"
              onClick={() => deleteField(fieldIndex)}
            >
              Delete Field
            </button>
          </td>
        ) : null}
        {/* Checking description */}
        <td>
          <input
            type="text"
            value={req.name}
            size={40}
            placeholder="Type the requirement"
            style={{
              border: "none",
              borderBottom: "1px solid",
              padding: "10px",
            }}
            onChange={(e) =>
              handleRequirementNameChange(e, fieldIndex, reqIndex)
            }
          />
          <button
            className="deletemaintain"
            style={{ color: "black" }}
            onClick={() => deleteRequirement(fieldIndex, reqIndex)}
          >
            Delete Requirement
          </button>
        </td>
        <td></td>
        <td></td>

        {generateDayHeaders().map((header) => (
          <td key={header.key}></td>
        ))}
      </tr>
    ));
  };

  return (
    <div className="formcontainer">
      <select
        className="typemaintain"
        value={dailyType}
        onChange={(e) => setdaily(e.target.value)}
      >
        <option value="first">First half of month</option>
        <option value="second">Last half of month</option>
      </select>
      <div className="titleformcontain">
        <img src="/cqs.png" alt="" width={160} height={64} />
        <div className="text-container" style={{ paddingLeft: "20%" }}>
          <p className="texttemplate" style={{ paddingLeft: "12px" }}>
            {machineName} Preventive Maintenance Daily Checklist
          </p>
          <p>{machineName} Bảo trì phòng ngừa Danh sách kiểm tra hàng ngày</p>
        </div>
      </div>
      <div className="machineinfocontain">
        <div>
          <p>Machine Name: {machineName}</p>
        </div>
        <div>
          <p>Month:............ Year:............</p>
        </div>
        <div>
          <p>Machine Number: {machineCode}</p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <p style={{ fontWeight: "bold" }}>
          Preventive Maintenance Description / Mô tả bảo trì phòng ngừa
        </p>
        {fields.map((field, fieldIndex) => (
          <div key={fieldIndex}>
            <table className="templateTable">
              <thead>
                <tr>
                  <th>Sl:No</th>
                  <th>
                    <p>Machine type</p>
                    <p>Loại máy</p>
                  </th>
                  <th>
                    <p>Checking description</p>
                    <p>Mô tả kiểm tra</p>
                  </th>
                  <th>
                    <p>Checking description</p>
                    <p>Mô tả kiểm tra</p>
                  </th>
                  <th>P.I.C</th>

                  {generateDayHeaders()}
                </tr>
              </thead>
              <tbody>{renderRows(field, fieldIndex)}</tbody>
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
    </div>
  );
};

export default DailyTemplate;

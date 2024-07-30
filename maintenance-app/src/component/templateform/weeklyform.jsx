import React from "react";

const WeeklyTemplate = ({
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
  return (
    <div className="formcontainer">
      <div className="titleformcontain">
        <img src="/cqs.png" alt="" width={160} height={64} />
        <div className="text-container">
          <p className="texttemplate">
            {machineName} Preventive Maintenance {typemaintain} Checklist
          </p>
          <p style={{ padding: "8px 12px" }}>
            {machineName} Preventive Maintenance {typemaintain} Checklist
          </p>
        </div>
      </div>
      <div className="machineinfocontain">
        <div>
          <p>Machine Name: {machineName}</p>
          <p>Tên máy móc: {machineName}</p>
          <p style={{ marginTop: "12px" }}>
            Maintenance Time: Start... Finish...
          </p>
        </div>
        <div>
          <p>Machine Number: {machineCode}</p>
          <p>Số máy: {machineCode}</p>
        </div>
      </div>
      <div className="imagecontainer">
        <p>Machine Picture / hình ảnh máy</p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <img src="./vd1.jpg" alt="" style={{ width: "100%" }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              src="./vd2.jpg"
              alt=""
              style={{ width: "100%", height: "50%" }}
            />
            <img
              src="./vd2.jpg"
              alt=""
              style={{ width: "100%", height: "50%" }}
            />
          </div>
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
                  <th>
                    <input
                      type="text"
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
                  </th>
                  <th>
                    <p>Verify</p>
                    <p>Xác minh</p>
                  </th>
                  <th>Corrective Action / hành động khắc phục</th>
                </tr>
              </thead>
              <tbody>
                {field.requirement.map((req, reqIndex) => (
                  <tr key={reqIndex}>
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
    </div>
  );
};

export default WeeklyTemplate;

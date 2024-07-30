import React, { useState } from "react";
import Select from "react-select";
import { IoCheckmark, IoCloseOutline } from "react-icons/io5";

const DailyMaintenance = ({
  formMaintain,
  Month,
  Year,
  setMonth,
  setYear,
  selectedValues,
  handleCheckingMethod,
  handleCellChange,
  handlePIC,

  isExist,
  preparedBy,
  setPreparedBy,
  checkedBy,
  setCheckedBy,
  approvedBy,
  setApprovedBy,
  handleSubmit,
}) => {
  const [dailyType, setdaily] = useState("first");
  const generateDayHeaders = (dailyType) => {
    const start = dailyType === "first" ? 1 : 16;
    const end = dailyType === "first" ? 15 : 31;
    const headers = [];
    for (let i = start; i <= end; i++) {
      headers.push(<th key={i}>{i}</th>);
    }
    return headers;
  };

  const renderRows = (fields, dailyType) => {
    let counter = 1;

    const rows = fields.flatMap((field, fieldIndex) =>
      field.requirement.map((req, reqIndex) => (
        <tr key={`${fieldIndex}-${reqIndex}`}>
          <td style={{ width: "5%" }}>{counter++}</td>{" "}
          {/* Increment the counter */}
          {reqIndex === 0 ? (
            <td
              rowSpan={field.requirement.length}
              className="table_title_left"
              style={{ width: "10%" }}
            >
              <div>{field.field_name}</div>
            </td>
          ) : null}
          <td style={{ width: "20%", fontWeight: "bold" }}>{req.name}</td>
          <td style={{ width: "15%" }}>
            <input
              type="text"
              placeholder="Corrective Action..."
              style={{
                width: "98%",
                height: "50px",
                paddingLeft: "10px",
                border: "none",
                boxSizing: "border-box",
              }}
              onChange={(e) =>
                handleCheckingMethod(fieldIndex, reqIndex, e.target.value)
              }
            />
          </td>
          <td style={{ width: "5%" }}>
            <CustomSelect
              fieldIndex={fieldIndex}
              reqIndex={reqIndex}
              handlePIC={handlePIC}
              selectedValue={
                selectedValues[`field_${fieldIndex}_req_${reqIndex}`]
              }
            />
          </td>
          {generateDayHeaders(dailyType).map((header, dayIndex) => (
            <td key={dayIndex}>
              <CustomCell
                fieldIndex={fieldIndex}
                reqIndex={reqIndex}
                dayIndex={dayIndex}
                handleCellChange={handleCellChange}
              />
            </td>
          ))}
        </tr>
      ))
    );

    rows.push(
      <tr key="final-row">
        <td
          colSpan={3}
          style={{
            width: "35%",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              fontWeight: "bold",
            }}
          >
            <p>Operator: &#9632;</p> {/* Square: &#9632; */}
            <p>Leader: &#9675;</p> {/* Circle: &#9675; */}
            <p>Maintenance: &#9651;</p> {/* Triangle: &#9651; */}
          </div>
        </td>
        <td
          colSpan={2}
          style={{
            width: "20%",
            border: "1px solid black",
            fontWeight: "bold",
            textAlign: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
              justifyContent: "space-between",
            }}
          >
            <div style={{ borderBottom: "1px solid black" }}>Operator</div>
            <div>Leader</div>
          </div>
        </td>
        <td
          colSpan={generateDayHeaders(dailyType).length}
          style={{ width: "80%" }}
        >
          <table
            style={{
              width: "100%",
              height: "100%",
              borderCollapse: "collapse",
            }}
          >
            <tbody>
              <tr style={{ height: "50%" }}>
                {generateDayHeaders(dailyType).map((header, dayIndex) => (
                  <td
                    key={`upper-${dayIndex}`}
                    style={{ border: "1px solid black", padding: 0 }}
                  >
                    <CustomCell
                      fieldIndex={"operator"}
                      reqIndex={null}
                      dayIndex={dayIndex}
                      handleCellChange={handleCellChange}
                    />
                  </td>
                ))}
              </tr>
              <tr style={{ height: "50%" }}>
                {generateDayHeaders(dailyType).map((header, dayIndex) => (
                  <td
                    key={`lower-${dayIndex}`}
                    style={{ border: "1px solid black", padding: 0 }}
                  >
                    <CustomCell
                      fieldIndex={"Leader"}
                      reqIndex={null}
                      dayIndex={dayIndex}
                      handleCellChange={handleCellChange}
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    );

    return rows;
  };
  const options = [
    {
      value: "Operator",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "30px",
            fontWeight: "bold",
          }}
        >
          <p>&#9632;</p>
        </div>
      ),
    },
    {
      value: "Leader",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "30px",
            fontWeight: "bold",
          }}
        >
          <p>&#9675;</p>
        </div>
      ),
    },
    {
      value: "Maintenance",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "30px",
            fontWeight: "bold",
          }}
        >
          <p>&#9651;</p>
        </div>
      ),
    },
  ];
  const CustomCell = ({ fieldIndex, reqIndex, dayIndex, handleCellChange }) => {
    const [value, setValue] = useState("");
    const [showInput, setShowInput] = useState(false);

    const handleChange = (e) => {
      const newValue = e.target.value;
      setValue(newValue);
      handleCellChange(fieldIndex, reqIndex, dayIndex, newValue);
    };

    const handleSelectChange = (e) => {
      const newValue = e.target.value;
      setValue(newValue);
      if (newValue === "number") {
        setShowInput(true);
      } else {
        setShowInput(false);
        handleCellChange(fieldIndex, reqIndex, dayIndex, newValue);
      }
    };

    return (
      <div style={{ width: "100%", height: "100%" }}>
        {!showInput ? (
          <select
            value={value}
            onChange={handleSelectChange}
            style={{ width: "100%", height: "100%" }}
          >
            <option value=""></option>
            <option value="OK">&#10003; </option>
            <option value="NG">&#10060; </option>
            <option value="number">Number</option>
          </select>
        ) : (
          <input
            type="number"
            value={value}
            onChange={handleChange}
            style={{ width: "100%", height: "100%", boxSizing: "border-box" }}
          />
        )}
      </div>
    );
  };

  const CustomSelect = ({ fieldIndex, reqIndex, handlePIC, selectedValue }) => (
    <Select
      options={options}
      value={options.find((option) => option.value === selectedValue)}
      onChange={(selectedOption) =>
        handlePIC(fieldIndex, reqIndex, selectedOption.value)
      }
    />
  );

  return (
    <div className="formcontainer">
      <div className="titleformcontain">
        <img src="/cqs.png" alt="" width={160} height={64} />
        <div className="text-container">
          <p className="texttemplate">
            {formMaintain.machine_name} PrDITMEeventive Maintenance
            {formMaintain.type_of_maintenance} Checklist
          </p>
          <p style={{ padding: "8px 12px" }}>
            {formMaintain.machine_name} Preventive Maintenance
            {formMaintain.type_of_maintenance} Checklist
          </p>
        </div>
      </div>
      <div className="machineinfocontain">
        <div>
          <p>Machine Name: {formMaintain.machine_name}</p>
        </div>
        <div style={{ display: "flex", flexDirection: "row" }}>
          <p style={{ paddingRight: "10px" }}>Month: </p>
          <select value={Month} onChange={(e) => setMonth(e.target.value)}>
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i + 1} value={i + 1}>
                {i + 1}
              </option>
            ))}
          </select>
          <p style={{ paddingRight: "10px" }}>Year:</p>
          <input
            type="number"
            value={Year}
            onChange={(e) => setYear(e.target.value)}
            style={{ border: "none", fontWeight: "bold", fontSize: "20px" }}
            placeholder="..."
          />
        </div>
        <div>
          <p>Machine Number: {formMaintain.machine_code}</p>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
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
                <p>Checking method</p>
                <p>Phương pháp kiểm tra</p>
              </th>
              <th>P.I.C</th>
              {generateDayHeaders(dailyType)}
            </tr>
          </thead>
          <tbody>{renderRows(formMaintain.fields, dailyType)}</tbody>
        </table>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          width: "99%",
          border: "1px solid black",
        }}
      >
        <div
          style={{
            flex: "0 0 20%",
            borderRightStyle: "solid",
            borderColor: "black",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>
            Verification Symbol
          </p>
          <p>Biểu tượng xác minh</p>
        </div>
        <div
          style={{
            flex: "0 0 20%",
            borderRightStyle: "solid",
            borderColor: "black",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            fontSize: "20px",
            fontWeight: "bold",
          }}
        >
          <p>OK</p>
          <div
            style={{
              borderBottomStyle: "solid",
              borderColor: "black",
              width: "100%",
            }}
          ></div>
          <p>NG</p>
          <div
            style={{
              borderBottomStyle: "solid",
              borderColor: "black",
              width: "100%",
            }}
          ></div>
          <p>Measured Value / giá trị đo</p>
        </div>
        <div
          style={{
            flex: "0 0 10%",
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            fontSize: "40px",
            fontWeight: "bold",
            borderRightStyle: "solid",
            borderColor: "black",
          }}
        >
          <IoCheckmark />
          <div
            style={{
              borderBottomStyle: "solid",
              borderColor: "black",
              width: "100%",
            }}
          ></div>
          <IoCloseOutline />
          <div
            style={{
              borderBottomStyle: "solid",
              borderColor: "black",
              width: "100%",
            }}
          ></div>
          <p style={{ fontSize: "16px" }}>Number / con số (123)</p>
        </div>
        <div
          style={{
            flex: "0 0 70%",
            justifyContent: "center",
            display: "flex",
            flexDirection: "column",
            marginLeft: "10px",
          }}
        >
          <p style={{ fontSize: "20px", fontWeight: "bold" }}>
            Note: If have any Problem Immediately Inform to Leader
          </p>
          <p>Lưu ý: Nếu có vấn đề gì Thông báo ngay cho Leader</p>
        </div>
      </div>
      <div className="confirmfill">
        <div>
          <h3>Leaded by</h3>
          <input
            type="text"
            value={preparedBy}
            onChange={(e) => setPreparedBy(e.target.value)}
            disabled={isExist}
          />
        </div>

        <div>
          <h3>Checked by</h3>
          <input
            type="text"
            value={checkedBy}
            onChange={(e) => setCheckedBy(e.target.value)}
            disabled={isExist}
          />
        </div>

        <div style={{ border: "none" }}>
          <h3>Approved by</h3>
          <input
            type="text"
            value={approvedBy}
            onChange={(e) => setApprovedBy(e.target.value)}
            disabled={isExist}
          />
        </div>
      </div>
      {!isExist ? (
        <button className="submitfill" onClick={handleSubmit}>
          Save
        </button>
      ) : null}
    </div>
  );
};

export default DailyMaintenance;

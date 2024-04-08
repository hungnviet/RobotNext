import React, { useState, useRef } from "react"; // add useRef
import "./detail.css";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Detail() {
  const [data, setData] = useState(null);
  const [machineName, setMachineName] = useState("");
  const [machineCode, setMachineCode] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("daily");

  const [selectedDate, setSelectedDate] = useState("");
  const componentRef = useRef(); // create a reference here

  async function handleFind() {
    try {
      const response = await fetch("http://localhost:3001/data");
      const jsonResponse = await response.json();
      const originalData = jsonResponse.map((item) => item.data);

      let initData = originalData.filter((item) => {
        const isMachineNameMatch = machineName
          ? item.machine_name.toLowerCase() === machineName.toLowerCase()
          : true;

        const isMachineCodeMatch = machineCode
          ? item.machine_number === machineCode
          : true;

        const isMaintenanceTypeMatch = maintenanceType
          ? item.type_of_maintenance.toLowerCase() ===
            maintenanceType.toLowerCase()
          : true;
        const isDateMatch = selectedDate
          ? item.maintenace_time.date === selectedDate
          : true;

        return (
          isMachineNameMatch &&
          isMachineCodeMatch &&
          isMaintenanceTypeMatch &&
          isDateMatch
        );
      });
      console.log(initData); // This will log the filtered data
      if (initData.length === 0) {
        toast.error("cannot find data");
        setData(null);
        return;
      }

      // After filtering the data
      initData = initData.sort((a, b) => {
        const dateA = new Date(a.maintenace_time.date);
        const dateB = new Date(b.maintenace_time.date);
        return dateB - dateA; // sort in descending order
      });

      // Take the first item (latest data)
      const latestData = initData[0];

      // Update data state with the latest data
      setData([latestData]);
    } catch (error) {
      console.error("Fetch error:", error);
      toast.error("cannot find data");
    }
  }

  return (
    <div>
      <div className="detailscreen">
        <header className="managehead">
          Detail maintenance information for your machine
          <br />{" "}
          <span style={{ fontWeight: "normal" }}>
            (Chi tiết thông tin bảo trì máy móc)
          </span>
        </header>
        <p className="detailsubtext">
          Find maintenance form of machine - Tìm kiếm đơn bảo trì
        </p>
        <div className="managesubtext2">
          Machine Name:
          <input
            type="text"
            className="manageinput"
            placeholder="___________________"
            value={machineName}
            onChange={(e) => setMachineName(e.target.value)}
          />{" "}
          Machine Code:{" "}
          <input
            type="text"
            className="manageinput"
            placeholder="___________________"
            value={machineCode}
            onChange={(e) => setMachineCode(e.target.value)}
          />{" "}
          Type of maintenance:{" "}
          <select
            className="managedropdown"
            value={maintenanceType}
            onChange={(e) => setMaintenanceType(e.target.value)}
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
            <option value="halfyearly">Half-yearly</option>
            <option value="yearly">Yearly</option>
          </select>{" "}
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
          />
          <br />
          <span>(Tên máy)</span>
          <span style={{ marginLeft: "16%" }}>(Mã máy)</span>
          <span style={{ marginLeft: "16.6%" }}>(Loại bảo trì)</span>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button className="filterdetail" onClick={handleFind}>
              Find
            </button>
          </div>
          <ToastContainer />
        </div>
        <div>
          <div className="detailbody">
            <header className="detailbodyheader">
              Machine’s maintenance data <br />
              <span style={{ fontWeight: "normal" }}>
                Thông tin bảo trì máy
              </span>
            </header>

            {data &&
              data.map((item, index) => {
                let counter = 0;
                return item.type_of_maintenance === "daily" ? (
                  <div key={index} className="detailbodydaily">
                    <p className="detailbodytext">
                      Machine Name:{" "}
                      <span className="detaildata">{item.machine_name}</span>{" "}
                      <span style={{ marginLeft: "30%" }}>
                        Month:{" "}
                        <span className="detaildata">
                          {new Date(item.daily_time).getMonth() + 1}
                        </span>
                        Year:{" "}
                        <span className="detaildata">
                          {new Date(item.daily_time).getFullYear()}
                        </span>{" "}
                      </span>
                      0 Machine No:{" "}
                      <span className="detaildata">{item.machine_number}</span>
                    </p>
                    <table
                      style={{
                        border: "1px solid black",
                        borderCollapse: "collapse",
                      }}
                    >
                      <thead>
                        <tr>
                          <th className="tableelement">SL: NO</th>
                          <th style={{ border: "1px solid black" }}>
                            Machine type <br />
                            <span style={{ fontWeight: "normal" }}>
                              loại máy
                            </span>
                          </th>
                          <th style={{ border: "1px solid black" }}>
                            Checking Description <br />
                            <span style={{ fontWeight: "normal" }}>
                              mô tả kiểm tra
                            </span>
                          </th>
                          <th style={{ border: "1px solid black" }}>
                            Checking method
                            <br />
                            <span style={{ fontWeight: "normal" }}>
                              phương pháp kiểm tra
                            </span>
                          </th>
                          <th style={{ border: "1px solid black" }}>P.I.C</th>
                          {Array.from({ length: 31 }, (_, i) => (
                            <th style={{ border: "1px solid black" }} key={i}>
                              {i + 1}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {data.map((item, index) =>
                          item.maintenance_details.map(
                            (detail, detailIndex) => (
                              <React.Fragment key={`${index}-${detailIndex}`}>
                                {detail.requirement.map(
                                  (requirement, requirementIndex) => {
                                    counter++;
                                    return (
                                      <tr
                                        key={`${index}-${detailIndex}-${requirementIndex}`}
                                      >
                                        <td className="tableelement">
                                          {counter}
                                        </td>
                                        {requirementIndex === 0 && (
                                          <td
                                            className="tableelement"
                                            rowSpan={detail.requirement.length}
                                            style={{ fontWeight: "bold" }}
                                          >
                                            {detail.field} <br />
                                            <span
                                              style={{ fontWeight: "normal" }}
                                            >
                                              {detail.vietnamese}
                                            </span>
                                          </td>
                                        )}
                                        <td
                                          className="tableelement"
                                          style={{ fontWeight: "bold" }}
                                        >
                                          {requirement.name}
                                          <br />
                                          <span
                                            style={{ fontWeight: "normal" }}
                                          >
                                            {requirement.vietnamese}
                                          </span>
                                        </td>
                                        <td
                                          className="tableelement"
                                          style={{ fontWeight: "bold" }}
                                        >
                                          {requirement.checking_method} /
                                          <span
                                            style={{ fontWeight: "normal" }}
                                          >
                                            {" "}
                                            {requirement.methodvn}
                                          </span>
                                        </td>
                                        <td className="tableelement">
                                          {requirement.pic}
                                        </td>
                                        {requirement.dailyChecks.map(
                                          (check, i) => (
                                            <td
                                              className="tableelement"
                                              key={i}
                                              style={{
                                                color: check
                                                  ? "green"
                                                  : check === null
                                                  ? "black"
                                                  : "red",
                                              }}
                                            >
                                              {check
                                                ? "Yes"
                                                : check === null
                                                ? "NG"
                                                : "No"}
                                            </td>
                                          )
                                        )}
                                      </tr>
                                    );
                                  }
                                )}
                              </React.Fragment>
                            )
                          )
                        )}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div key={index} className="detailbodycontain">
                    <div
                      className="detailbodytext"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "3fr 2fr",
                      }}
                    >
                      <div>
                        <span>Machine Name: </span>

                        <span className="detaildata">{item.machine_name}</span>
                        <br />
                        <span style={{ fontWeight: "normal" }}>
                          Tên máy móc:{" "}
                        </span>
                      </div>
                      <div>
                        <span>Type of maintenance: </span>

                        <span className="detaildata">
                          {item.type_of_maintenance}
                        </span>
                        <br />
                        <span style={{ fontWeight: "normal" }}>
                          Loại bảo trì:{" "}
                        </span>
                      </div>
                    </div>
                    <div
                      className="detailbodytext"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "3fr 2fr",
                      }}
                    >
                      <div>
                        <span>Maintenance operator number: </span>
                        <span className="detaildata">
                          {item.maintenace_operater}
                        </span>
                      </div>
                      <div>
                        <span>Machine number: </span>
                        <span className="detaildata">
                          {item.machine_number}
                        </span>
                        <br />
                        <span style={{ fontWeight: "normal" }}>Số máy: </span>
                      </div>
                    </div>
                    <div
                      className="detailbodytext"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "2fr 2fr 2.7fr",
                      }}
                    >
                      <div>
                        <span>Maintenance time: Start: </span>
                        <span className="detaildata">
                          {item.maintenace_time.start}
                        </span>
                        <br />
                        <span style={{ fontWeight: "normal" }}>
                          Thời gian bảo trì:{" "}
                        </span>
                      </div>
                      <div>
                        <span>End: </span>
                        <span className="detaildata">
                          {item.maintenace_time.end}
                        </span>
                      </div>
                      <div>
                        <span>Date: </span>
                        <span className="detaildata">
                          {item.maintenace_time.date}
                        </span>
                      </div>
                    </div>
                    <div className="drawline"></div>
                    <p className="detailbodytext">
                      {" "}
                      Machine Picture/ Hình ảnh máy{" "}
                    </p>
                    <div className="image-container">
                      {item.image &&
                        item.image.map((img, imgIndex) => (
                          <img
                            key={imgIndex}
                            src={img.image_url}
                            alt="Maintenance"
                            className={`image-${imgIndex}`}
                          />
                        ))}
                    </div>
                    <header className="detailbodyheader">
                      Preventive Maintenance Description
                    </header>
                    {item.maintenance_details &&
                      item.maintenance_details.map((detail, detailIndex) => (
                        <div key={detailIndex}>
                          <table style={{ width: "100%" }}>
                            <thead>
                              <tr
                                style={{
                                  textDecoration: "underline",
                                  fontSize: "18px",
                                }}
                              >
                                <th
                                  className="tableelement2"
                                  style={{ width: "33%" }}
                                >
                                  {detail.field} <span>/ </span>
                                  {detail.vietnamese}
                                </th>
                                <th
                                  className="tableelement2"
                                  style={{ color: "green", width: "33%" }}
                                >
                                  Verify / Xác minh
                                </th>
                                <th
                                  className="tableelement2"
                                  style={{ color: "red", width: "33%" }}
                                >
                                  Corrective Action/
                                  <br />
                                  <span>Hành động khắc phục</span>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {detail.requirement.map((req, reqIndex) => (
                                <tr
                                  key={reqIndex}
                                  style={{ fontWeight: "normal" }}
                                >
                                  <td
                                    className="tableelement2"
                                    style={{ width: "33%", fontWeight: "bold" }}
                                  >
                                    {reqIndex + 1} <span>.</span>
                                    {req.name} <br />
                                    <span style={{ fontWeight: "normal" }}>
                                      {req.vietnamese}
                                    </span>
                                  </td>
                                  <td
                                    className="tableelement2"
                                    style={{ width: "33%" }}
                                  >
                                    {req.status}
                                  </td>
                                  <td
                                    className="tableelement2"
                                    style={{ width: "33%" }}
                                  >
                                    {req.corrective_action}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ))}
                    <p className="remarktext">Remark/ Ghi chú</p>
                    <div className="remark">
                      <p>{item.remark}</p>
                    </div>
                    <div style={{ display: "flex" }}>
                      <div className="detailfoot">
                        <p>Prepared by:</p>
                        <p style={{ fontSize: "16px", fontWeight: "normal" }}>
                          {item.prepared_by}
                        </p>
                      </div>
                      <div className="detailfoot">
                        <p style={{ color: "red" }}>Checked by:</p>
                        <p style={{ fontSize: "16px", fontWeight: "normal" }}>
                          {item.checked_by}
                        </p>
                      </div>
                      <div className="detailfoot">
                        <p style={{ color: "green" }}>Approved by:</p>
                        <p style={{ fontSize: "16px", fontWeight: "normal" }}>
                          {item.approved_by}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;

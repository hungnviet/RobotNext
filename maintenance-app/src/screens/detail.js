import React, { useState, useRef } from "react"; // add useRef
import "./detail.css";
import ReactToPrint from "react-to-print";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function Detail() {
  const [data, setData] = useState(null);
  const [machineName, setMachineName] = useState("");
  const [machineCode, setMachineCode] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("");

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
        </header>
        <p className="detailsubtext">Find maintenance form of machine</p>
        <p className="managesubtext2">
          Machine Name:{" "}
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
          <div style={{ display: "flex", justifyContent: "center" }}>
            <button className="filterdetail" onClick={handleFind}>
              Find
            </button>
          </div>
          <ToastContainer />
        </p>
      </div>
      <div>
        <div ref={componentRef}>
          <div className="detailbody">
            <header className="detailbodyheader">
              Machine’s maintenance data
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
                      Machine No:{" "}
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
                            Machine type
                          </th>
                          <th style={{ border: "1px solid black" }}>
                            Checking Description
                          </th>
                          <th style={{ border: "1px solid black" }}>
                            Checking method
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
                                          >
                                            {detail.field}
                                          </td>
                                        )}
                                        <td className="tableelement">
                                          {requirement.name}
                                        </td>
                                        <td className="tableelement">
                                          {requirement.checking_method}
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
                    <p className="detailbodytext">
                      Machine Name:
                      <span className="detaildata">{item.machine_name}</span>
                      <span style={{ marginLeft: "32%" }}></span>
                      Type of maintenance:{" "}
                      <span className="detaildata">
                        {item.type_of_maintenance}
                      </span>
                    </p>
                    <p className="detailbodytext">
                      Maintenance operator number:{" "}
                      <span className="detaildata">
                        {item.maintenace_operater}
                      </span>
                      {"  "}
                      <span style={{ marginLeft: "20%" }}></span>
                      Mainchine number:{" "}
                      <span className="detaildata">{item.machine_number}</span>
                    </p>
                    <p className="detailbodytext">
                      {" "}
                      Maintenance time: Start:{" "}
                      <span className="detaildata">
                        {item.maintenace_time.start}
                      </span>{" "}
                      <span style={{ marginLeft: "25%" }}></span>
                      End:{" "}
                      <span className="detaildata">
                        {" "}
                        {item.maintenace_time.end}
                      </span>
                      Date{" "}
                      <span className="detaildata">
                        {item.maintenace_time.date}
                      </span>
                    </p>
                    <div className="drawline"></div>

                    <p className="detailbodytext"> Machine Picture </p>

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
                    <div className="drawline"></div>

                    <header className="detailbodyheader">
                      Preventive Maintenance Description
                    </header>
                    {item.maintenance_details &&
                      item.maintenance_details.map((detail, detailIndex) => (
                        <div key={detailIndex}>
                          <div className="drawline"></div>
                          <div className="detailfieldhead">
                            <div
                              style={{
                                textDecoration: "underline",
                                fontSize: "18px",
                              }}
                            >
                              {" "}
                              <span>{detail.field}</span>
                              <span style={{ color: "green" }}>Verify</span>
                              <span style={{ color: "red" }}>
                                Corrective Action
                              </span>
                            </div>
                            {detail.requirement.map((req, reqIndex) => (
                              <div
                                key={reqIndex}
                                style={{ fontWeight: "normal" }}
                              >
                                <p>{req.name}</p>
                                <p>{req.status}</p>
                                <p>{req.corrective_action}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    <div className="drawline"></div>
                    <p className="remarktext">Remark</p>

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

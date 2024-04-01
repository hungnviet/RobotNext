import React, { useEffect, useState } from "react";
import "./detail.css";

function Detail() {
  const [data, setData] = useState(null);
  const [machineName, setMachineName] = useState("");
  const [machineCode, setMachineCode] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("");

  async function handleFind() {
    try {
      const response = await fetch("http://localhost:3001/data");
      const jsonResponse = await response.json();
      const originalData = jsonResponse.map((item) => item.data);

      const initData = originalData.filter((item) => {
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

        return (
          isMachineNameMatch && isMachineCodeMatch && isMaintenanceTypeMatch
        );
      });
      console.log(initData); // This will log the filtered data
      if (initData.length === 0) {
        alert("cannot find data");
        setData(null);
        return;
      }

      // Update data state with the filtered data
      setData(initData);
    } catch (error) {
      console.error("Fetch error:", error);
      alert("cannot find data");
    }
  }
  return (
    <div>
      <div className="detailscreen">
        <header className="managehead">
          Detail maintenance information for your machine
        </header>
        <p className="detailsubtext">Find maintenance form of machine</p>
        <p className="maagesubtext2">
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
            <option value="halfyearly">Half-yearly</option>
            <option value="yearly">Yearly</option>
          </select>{" "}
          <button className="filter" onClick={handleFind}>
            Find
          </button>
        </p>
      </div>
      <div className="detailbody">
        <header className="detailbodyheader">Machine’s maintenance data</header>
        {data &&
          data.map((item, index) => (
            <div key={index} className="detailbodycontain">
              <p className="detailbodytext">
                Machine Name:{" "}
                <span className="detaildata">{item.machine_name}</span>
                Type of maintenance:{" "}
                <span className="detaildata">{item.type_of_maintenance}</span>
              </p>
              <p className="detailbodytext">
                Maintenance operator name:{" "}
                <span className="detaildata">{item.maintenace_operater}</span>
                {"  "}
                Mainchine number:{" "}
                <span className="detaildata">{item.machine_number}</span>
              </p>
              <p className="detailbodytext">
                {" "}
                Maintenance time: Start:{" "}
                <span className="detaildata">
                  {item.maintenace_time.start}
                </span>{" "}
                End:{" "}
                <span className="detaildata"> {item.maintenace_time.end}</span>
                Date{" "}
                <span className="detaildata">{item.maintenace_time.date}</span>
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
                        <span style={{ color: "red" }}>Corrective Action</span>
                      </div>
                      {detail.requirement.map((req, reqIndex) => (
                        <div key={reqIndex} style={{ fontWeight: "normal" }}>
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
          ))}
      </div>
    </div>
  );
}

export default Detail;

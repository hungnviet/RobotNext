import "./management.css";
import { useEffect, useState } from "react";

function Management() {
  const [data, setData] = useState(null);
  const [machineName, setMachineName] = useState("");
  const [machineCode, setMachineCode] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("");
  const [Start, setStart] = useState("");
  const [End, setEnd] = useState("");

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
        const isDateInRange =
          Start && End
            ? new Date(item.maintenace_time.date) >= new Date(Start) &&
              new Date(item.maintenace_time.date) <= new Date(End)
            : true;

        return (
          isMachineNameMatch &&
          isMachineCodeMatch &&
          isMaintenanceTypeMatch &&
          isDateInRange
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
    <div className="detailscreen">
      <div className="headermanage">
        <header className="managehead">
          List of machines that need maintenance
          <br />
          Danh sách máy cần bảo trì
        </header>
        <p className="managesubtext">
          The machines have to make maintenance from <br />
          <span>(Khoảng thời gian máy được bảo trì) </span>
          <span className="managecalendartext">
            <input
              type="date"
              value={Start}
              onChange={(e) => setStart(e.target.value)}
            />{" "}
            to{" "}
            <input
              type="date"
              value={End}
              onChange={(e) => setEnd(e.target.value)}
            />
          </span>
        </p>
        <p className="managesubtext">Filter: </p>
        <p className="managesubtext2">
          Machine Name:{" "}
          <input
            type="text"
            className="manageinput"
            value={machineName}
            onChange={(e) => setMachineName(e.target.value)}
            placeholder="_________________"
          />{" "}
          Machine Code:{" "}
          <input
            type="text"
            className="manageinput"
            value={machineCode}
            onChange={(e) => setMachineCode(e.target.value)}
            placeholder="_________________"
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
            Apply
          </button>
        </p>
      </div>
      <div className="detailbody">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th className="tableelement">
                  Machine Name <br /> (Tên máy)
                </th>
                <th className="tableelement">
                  Machine Number <br />
                  (Mã máy)
                </th>
                <th className="tableelement">
                  Last Maintenance Time <br />
                  (Bảo trì lần cuối)
                </th>
                <th className="tableelement">
                  Type of Maintenance <br />
                  (Loại bảo trì)
                </th>
                <th className="tableelement">
                  Maintenance Operator number <br />
                  (Số nhà điều hành bảo trì)
                </th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.map((item, index) => (
                  <tr key={index}>
                    <td className="tableelement">{item.machine_name}</td>
                    <td className="tableelement">{item.machine_number}</td>
                    <td className="tableelement">
                      {item.maintenace_time.date}
                    </td>
                    <td className="tableelement">{item.type_of_maintenance}</td>
                    <td className="tableelement">{item.maintenace_operater}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Management;

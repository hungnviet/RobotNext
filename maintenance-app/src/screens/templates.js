import "./templates.css";
import React, { useState, useRef, useEffect } from "react"; // add useRef
import { ToastContainer, toast } from "react-toastify";

function Templates() {
  const [data, setData] = useState(null);
  const [machineName, setMachineName] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("daily");
  const [Start, setStart] = useState("");
  const [End, setEnd] = useState("");
  const [selectedMachine, setSelectedMachine] = useState(null);
  useEffect(() => {
    async function handleFind() {
      try {
        const response = await fetch(`http://localhost:3001/allFormTemplate`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error(error);
        toast.error("Can not find the data");
      }
    }

    handleFind();
  }, []);
  return (
    <div className="templateallscreen">
      <div>
        <header className="managehead">
          List of all form templates
          <br />
          Danh sách toàn bộ các mẫu báo cáo
        </header>
      </div>
      <div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th className="tableelementtemplate">Machine Name/Tên máy</th>
                <th className="tableelementtemplate">
                  Type of Maintenance/Loại bảo trì
                </th>
                <th className="tableelementtemplate">
                  Number of Fields/Số lượng trường
                </th>
                <th className="tableelementtemplate">
                  Total Requirement/Tổng số yêu cầu
                </th>
                <th className="tableelementtemplate">Preview/Xem trước</th>
              </tr>
            </thead>
            <tbody>
              {data &&
                data.map((machine, index) => (
                  <tr
                    key={index}
                    className={
                      selectedMachine === machine ? "selected-row" : ""
                    }
                  >
                    <td className="tableelementtemplate">
                      {machine.form_template.machine_name}
                    </td>
                    <td className="tableelementtemplate">
                      {machine.form_template.type_of_maintenance}
                    </td>
                    <td className="tableelementtemplate">
                      {machine.form_template.maintenance_details.length}
                    </td>
                    <td className="tableelementtemplate">
                      {machine.form_template.maintenance_details.reduce(
                        (acc, detail) => acc + detail.requirement.length,
                        0
                      )}
                    </td>
                    <td className="tableelementtemplate">
                      <button
                        className="buttontemplate"
                        onClick={() => setSelectedMachine(machine)}
                      >
                        View detail
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
        {selectedMachine && (
          <div className="table-container">
            <div>
              <h2 className="centered-content">
                Preview of selected template <br />
                Chi tiết mẫu
              </h2>
              <table className="centered-table">
                <thead>
                  <tr>
                    <th className="tableelementtemplate">Machine Name</th>
                    <th className="tableelementtemplate">
                      Type of Maintenance
                    </th>
                    <th className="tableelementtemplate">Field</th>
                    <th className="tableelementtemplate">Requirements</th>
                    {/* Add more columns as needed */}
                  </tr>
                </thead>
                <tbody>
                  {selectedMachine.form_template.maintenance_details.map(
                    (detail, index) => (
                      <React.Fragment key={index}>
                        {index === 0 && (
                          <tr>
                            <td
                              className="tableelementtemplate"
                              rowSpan={
                                selectedMachine.form_template
                                  .maintenance_details.length
                              }
                            >
                              {selectedMachine.form_template.machine_name}
                            </td>
                            <td
                              className="tableelementtemplate"
                              rowSpan={
                                selectedMachine.form_template
                                  .maintenance_details.length
                              }
                            >
                              {
                                selectedMachine.form_template
                                  .type_of_maintenance
                              }
                            </td>
                            <td className="tableelementtemplate">
                              {detail.field}
                            </td>
                            <td>
                              {detail.requirement.map((req, reqIndex) => (
                                <div className="tableelement" key={reqIndex}>
                                  {req.name}
                                </div>
                              ))}
                            </td>
                          </tr>
                        )}
                        {index !== 0 && (
                          <tr>
                            <td className="tableelementtemplate">
                              {detail.field}
                            </td>
                            <td>
                              {detail.requirement.map((req, reqIndex) => (
                                <div
                                  className="tableelementtemplate"
                                  key={reqIndex}
                                >
                                  {req.name}
                                </div>
                              ))}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    )
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Templates;

import "./createform.css";
import { useState } from "react";
function CreateForm() {
  const [machineName, setMachineName] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("daily");
  const [template, setTemplate] = useState({});
  async function fetchData() {
    try {
      const response = await fetch(
        `http://localhost:3001/formTemplate/${machineName}/${maintenanceType}`
      );
      const data = await response.json();
      setTemplate(data.form_template);
    } catch (error) {
      console.error(error);
      alert("Can not find the data");
    }
  }
  return (
    <div className="update_form_data_screen">
      <div className="header_update_form_template">
        <h3>Input data for maintenance form</h3>
        <div className="filer_update_form_template">
          <div>
            <p>Machine Name</p>
            <input
              type="text"
              placeholder="Ex: Toshiba"
              onChange={(e) => {
                setMachineName(e.target.value);
              }}
              value={machineName}
            />
          </div>
          <div>
            <p>Maintenance type</p>
            <select
              value={maintenanceType}
              onChange={(e) => {
                setMaintenanceType(e.target.value);
              }}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="halfyearly">Half yearly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <button onClick={fetchData}>Find</button>
        </div>
      </div>
      {template && (
        <div className="content_update_form">
          <div className="header_update_form">
            <p>Machine Name : {template.machine_name}</p>
            <p>Type of maintenance: {template.type_of_maintenance}</p>
          </div>
          <div className="update_form_time_container">
            <p>Maintenance Time:</p>
            <div className="update_form_time">
              <p>Start: </p>
              <input type="time"></input>
              <p>End: </p>
              <input type="time"></input>
              <p>Date</p>
              <input type="date"></input>
            </div>
          </div>
          <div className="machine_operator_in4">
            <div>
              <p>Machine code: </p>
              <input type="text"></input>
            </div>
            <div>
              <p>Maintenance operator: </p>
              <input type="text"></input>
            </div>
          </div>
          {template.maintenance_details && (
            <div className="form_maintenance_detail_container">
              {template.maintenance_details.map((item, index) => {
                return (
                  <div className="field_container">
                    <div className="field_header">
                      <div className="field_name">
                        <p>{item.field}</p>
                      </div>
                      <div className="verify">
                        <p>Verify</p>
                      </div>
                      <div className="corrective_action">
                        <p>Corrective action</p>
                      </div>
                    </div>
                    {item.requirement.map((requirement, index) => {
                      return (
                        <div className="requirement_row">
                          <div className="requirement_name">
                            <p>{requirement.name}</p>
                          </div>
                          <div className="requirement_verify">
                            <select>
                              <option>OK</option>
                              <option>NG</option>
                            </select>
                          </div>
                          <div className="requiremet_correctvie_action">
                            <input type="text"></input>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          )}
          <div className="footer_updated_form">
            <div>
              <p>Prepared by:</p>
              <input type="text"></input>
            </div>
            <div>
              <p>Checked by:</p>
              <input type="text"></input>
            </div>
            <div>
              <p>Approved by: </p>
              <input type="text"></input>
            </div>
          </div>
        </div>
      )}
      <button>SAVE</button>
    </div>
  );
}

export default CreateForm;

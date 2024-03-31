import "./createform.css";
import { useState } from "react";
function CreateForm() {
  const [machineName, setMachineName] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("daily");
  async function fetchData() {
    try {
      const response = await fetch(
        `http://localhost:3001/formTemplate/${machineName}/${maintenanceType}`
      );
      const data = await response.json();
      alert(JSON.stringify(data));
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
      <div className="content_update_form"></div>
    </div>
  );
}

export default CreateForm;

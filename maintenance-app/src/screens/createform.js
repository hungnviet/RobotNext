import "./createform.css";
import { useState, useEffect } from "react";
function CreateForm() {
  const [machineName, setMachineName] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("daily");
  const [template, setTemplate] = useState({});
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [date, setDate] = useState("");
  const [machineCode, setMachineCode] = useState("");
  const [maintenanceOperator, setMaintenanceOperator] = useState("");
  const [PreparedBy, setPreparedBy] = useState("");
  const [CheckedBy, setCheckedBy] = useState("");
  const [ApprovedBy, setApprovedBy] = useState("");
  const [remark, setRemark] = useState("");

  const [images, setImages] = useState([]);

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      if (images.length < 3) {
        let img = event.target.files[0];
        setImages([...images, URL.createObjectURL(img)]);
      } else {
        alert("You can only upload a maximum of 3 images");
      }
    }
  };
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

  async function onSave() {
    if (machineName === "" || maintenanceType === "") {
      alert("Please input machine name and maintenance type");
      return;
    } else {
      const data = { ...template };
      data.machine_number = machineCode;
      data.maintenace_operater = maintenanceOperator;
      data.prepared_by = PreparedBy;
      data.checked_by = CheckedBy;
      data.approved_by = ApprovedBy;
      data.maintenace_time.start = start;
      data.maintenace_time.end = end;
      data.maintenace_time.date = date;
      data.remark = remark;
      data.image = images.map((image) => ({ image_url: image }));
      setTemplate(data);

      const response = await fetch("http://localhost:3001/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });
      if (!response.ok) {
        alert("Update form failed, please try again");
      }
    }
  }
  function updatState(fieldIndex, requirementIndex, state) {
    const newTemplate = { ...template };
    newTemplate.maintenance_details[fieldIndex].requirement[
      requirementIndex
    ].status = state;
    setTemplate(newTemplate);
  }
  function updateCorrectiveAction(fieldIndex, requirementIndex, value) {
    const newTemplate = { ...template };
    newTemplate.maintenance_details[fieldIndex].requirement[
      requirementIndex
    ].corrective_action = value;
    setTemplate(newTemplate);
  }

  useEffect(() => {
    const now = new Date();
    const timeString = now.toISOString().substr(11, 5);
    const dateString = now.toISOString().substr(0, 10);

    setStart(timeString);
    setEnd(timeString);
    setDate(dateString);
  }, []);
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
              <input
                type="time"
                value={start}
                onChange={(e) => {
                  setStart(e.target.value);
                }}
              ></input>
              <p>End: </p>
              <input
                type="time"
                value={end}
                onChange={(e) => {
                  setEnd(e.target.value);
                }}
              ></input>
              <p>Date</p>
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  setEnd(e.target.value);
                }}
              ></input>
            </div>
          </div>
          <div className="machine_operator_in4">
            <div>
              <p>Machine code: </p>
              <input
                type="text"
                value={machineCode}
                onChange={(e) => {
                  setMachineCode(e.target.value);
                }}
              ></input>
            </div>
            <div>
              <p>Maintenance operator: </p>
              <input
                type="text"
                value={maintenanceOperator}
                onChange={(e) => {
                  setMaintenanceOperator(e.target.value);
                }}
              ></input>
            </div>
          </div>
          {template.maintenance_details && (
            <div className="form_maintenance_detail_container">
              {template.maintenance_details.map((item, indexField) => {
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
                    {item.requirement.map((requirement, indexRequiremnt) => {
                      return (
                        <div className="requirement_row">
                          <div className="requirement_name">
                            <p>{requirement.name}</p>
                          </div>
                          <div className="requirement_verify">
                            <select
                              value={requirement.status}
                              onChange={(e) => {
                                updatState(
                                  indexField,
                                  indexRequiremnt,
                                  e.target.value
                                );
                              }}
                            >
                              <option value="OK">OK</option>
                              <option value="NG">NG</option>
                              <option value=""></option>
                            </select>
                          </div>
                          <div className="requiremet_correctvie_action">
                            <input
                              type="text"
                              value={requirement.corrective_action}
                              onChange={(e) => {
                                updateCorrectiveAction(
                                  indexField,
                                  indexRequiremnt,
                                  e.target.value
                                );
                              }}
                            ></input>
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
              <input
                type="text"
                value={PreparedBy}
                onChange={(e) => {
                  setPreparedBy(e.target.value);
                }}
              ></input>
            </div>
            <div>
              <p>Checked by:</p>
              <input
                type="text"
                value={CheckedBy}
                onChange={(e) => setCheckedBy(e.target.value)}
              ></input>
            </div>
            <div>
              <p>Approved by: </p>
              <input
                type="text"
                value={ApprovedBy}
                onChange={(e) => setApprovedBy(e.target.value)}
              ></input>
            </div>
          </div>
          <div className="upload_image_container">
            <input type="file" accept="image/*" onChange={onImageChange} />
            {images.map((image, index) => (
              <img key={index} src={image} alt={`uploaded ${index}`} />
            ))}
          </div>
          <h3 className="remark_text">Remark</h3>
          <input
            type="text"
            className="remark"
            onChange={(e) => setRemark(e.target.value)}
            value={remark}
          ></input>
          <button onClick={onSave}>SAVE</button>
        </div>
      )}
    </div>
  );
}

export default CreateForm;

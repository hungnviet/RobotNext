import "./createform.css";
import React, { useRef } from "react"; // add useRef
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
function CreateForm() {
  const [machineName, setMachineName] = useState("");
  const [maintenanceType, setMaintenanceType] = useState("daily");
  const [template, setTemplate] = useState({});
  const [dailyForm, setDailyForm] = useState({});
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
  const [dailyTime, setDailyTime] = useState("");

  const onImageChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      if (images.length < 3) {
        let img = event.target.files[0];
        setImages([...images, URL.createObjectURL(img)]);
      } else {
        toast.error("You can only upload a maximum of 3 images");
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
      toast.error("Can not find the data");
    }
  }

  async function onSave() {
    if (machineName === "" || maintenanceType === "") {
      toast.error("Please input machine name and maintenance type");
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

      setTemplate(data);

      const response = await fetch("http://localhost:3001/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data }),
      });
      if (!response.ok) {
        toast.error("Update form failed, please try again");
      } else {
        toast.success("Update form successfully");
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
  function dailyCheckForm(fieldIndex, requirement, day) {
    const newDailyTemplate = { ...dailyForm };
    newDailyTemplate.data.maintenance_details[fieldIndex].requirement[
      requirement
    ].dailyChecks[day] = true;
    setDailyForm(newDailyTemplate);
  }
  async function fetchDailyForm() {
    try {
      const response = await fetch(
        `http://localhost:3001/dailyForm/${machineName}/${dailyTime}/${machineCode}`
      );
      const data = await response.json();
      setDailyForm(data);
    } catch (error) {
      console.error(error);
      toast.error("Can not find the data");
    }
  }
  async function SaveDailyForm() {
    const response = await fetch("http://localhost:3001/dailyForm", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ dailyForm }),
    });
    if (!response.ok) {
      toast.error("Update form failed, please try again");
    } else {
      toast.success("Update form successfully");
    }
  }
  useEffect(() => {
    console.log(dailyForm);
  }, [dailyForm]);
  useEffect(() => {
    const now = new Date();
    const timeString = now.toISOString().substr(11, 5);
    const dateString = now.toISOString().substr(0, 10);

    setStart(timeString);
    setEnd(timeString);
    setDate(dateString);
  }, []);
  let counter = 0;
  return (
    <div className="update_form_data_screen">
      <div className="header_update_form_template">
        <h3>Input data for maintenance form</h3>
        <h4>(Điền Thông Tin Để Hoàn Thành Biên Bản Bảo Trì)</h4>
        <div className="filer_update_form_template">
          <div className="container_filter">
            <div className="filter_title_create_form">
              <p>Machine Name</p>
              <p>(Tên máy)</p>
            </div>

            <input
              type="text"
              placeholder="Ex: Toshiba"
              onChange={(e) => {
                setMachineName(e.target.value);
              }}
              value={machineName}
            />
          </div>
          <div className="container_filter">
            <div className="filter_title_create_form">
              <p>Maintenance type </p>
              <p>(Loại bảo trì)</p>
            </div>

            <select
              value={maintenanceType}
              onChange={(e) => {
                setMaintenanceType(e.target.value);
              }}
            >
              <option value="daily">Daily/Hàng ngày</option>
              <option value="weekly">Weekly/Hàng tuần</option>
              <option value="monthly">Monthly/Hàng tháng</option>
              <option value="halfyearly">Half yearly/Hàng nữa năm</option>
              <option value="yearly">Yearly/Hàng năm</option>
            </select>
          </div>
          <button onClick={fetchData}>Find</button>
        </div>
      </div>
      {maintenanceType === "daily" && (
        <div className="content_update_form_daily">
          <div className="header_update_form">
            <p>Machine Name : {machineName}</p>
            <p>Type of maintenance: {maintenanceType}</p>
          </div>
          <div className="form_date_daily">
            <div>
              <div className="title_form_date_daily">
                <p>Machine Number</p>
                <p>(Mã số máy)</p>
              </div>
              <input
                type="text"
                value={machineCode}
                onChange={(e) => {
                  setMachineCode(e.target.value);
                }}
              />
            </div>
            <div>
              <div className="title_form_date_daily">
                <p>Month-Year</p>
                <p>(Tháng-Năm)</p>
              </div>
              <input
                type="month"
                value={dailyTime}
                onChange={(e) => setDailyTime(e.target.value)}
              ></input>
              {dailyTime}
            </div>
            <button onClick={fetchDailyForm}>Apply (Áp dụng)</button>
          </div>
          <div className="table_daily_form_contanier">
            <table
              style={{
                border: "1px solid black",
                borderCollapse: "collapse",
                width: "100%", // set a width on the table
                tableLayout: "fixed", // add this line
              }}
            >
              <thead>
                <tr>
                  <th
                    className="tableelement"
                    style={{ border: "1px solid black", width: "50px" }}
                  >
                    SL: NO
                  </th>
                  <th style={{ border: "1px solid black", width: "300px" }}>
                    Machine type
                    <p style={{ fontSize: "16px", fontWeight: "400" }}>
                      loại máy
                    </p>
                  </th>
                  <th style={{ border: "1px solid black", width: "300px" }}>
                    Checking Description
                    <p style={{ fontSize: "16px", fontWeight: "400" }}>
                      Mô tả kiểm tra
                    </p>
                  </th>
                  <th style={{ border: "1px solid black", width: "300px" }}>
                    Checking method
                    <p style={{ fontSize: "16px", fontWeight: "400" }}>
                      phương pháp kiểm tra
                    </p>
                  </th>
                  <th style={{ border: "1px solid black" }}>P.I.C</th>
                  {Array.from({ length: 31 }, (_, i) => (
                    <th
                      style={{ border: "1px solid black", width: "100px" }}
                      key={i}
                    >
                      {i + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {dailyForm &&
                  dailyForm.data &&
                  dailyForm.data.maintenance_details &&
                  dailyForm.data.maintenance_details.map(
                    (detail, detailIndex) => (
                      <React.Fragment key={`${detailIndex}`}>
                        {detail.requirement.map(
                          (requirement, requirementIndex) => {
                            counter++;
                            return (
                              <tr key={`${detailIndex}-${requirementIndex}`}>
                                <td className="tableelement">{counter}</td>
                                {requirementIndex === 0 && (
                                  <td
                                    className="tableelement"
                                    rowSpan={detail.requirement.length}
                                  >
                                    <div
                                      style={{
                                        display: "flex",
                                        flexDirection: "column",
                                      }}
                                    >
                                      <p
                                        style={{
                                          fontWeight: "bold",
                                          margin: "0",
                                        }}
                                      >
                                        {detail.field}
                                      </p>
                                      <p>{detail.vietnamese}</p>
                                    </div>
                                  </td>
                                )}
                                <td className="tableelement">
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <p
                                      style={{
                                        fontWeight: "bold",
                                        margin: "0",
                                      }}
                                    >
                                      {requirement.name}
                                    </p>
                                    <p>{requirement.vietnamese}</p>
                                  </div>
                                </td>
                                <td className="tableelement">
                                  <div
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                    }}
                                  >
                                    <p
                                      style={{
                                        fontWeight: "bold",
                                        margin: "0",
                                      }}
                                    >
                                      {requirement.checking_method}
                                    </p>
                                    <p>{requirement.methodvn}</p>
                                  </div>
                                </td>
                                <td className="tableelement">
                                  {requirement.pic}
                                </td>
                                {requirement.dailyChecks.map((check, i) => (
                                  <td className="tableelement" key={i}>
                                    {check ? (
                                      "Yes"
                                    ) : (
                                      <input
                                        type="checkbox"
                                        checked={check}
                                        onChange={() =>
                                          dailyCheckForm(
                                            detailIndex,
                                            requirementIndex,
                                            i
                                          )
                                        }
                                      />
                                    )}
                                  </td>
                                ))}
                              </tr>
                            );
                          }
                        )}
                      </React.Fragment>
                    )
                  )}
              </tbody>
            </table>
            <div className="btn_save_daily">
              <button onClick={SaveDailyForm}>Save/Lưu</button>
            </div>
          </div>
        </div>
      )}
      {template && maintenanceType !== "daily" && (
        <div className="content_update_form">
          <div className="header_update_form">
            <p>Machine Name : {template.machine_name}</p>
            <p>Type of maintenance: {template.type_of_maintenance}</p>
          </div>
          <div className="update_form_time_container">
            <p>Maintenance Time(Thời gian bảo trì):</p>
            <div className="update_form_time">
              <p>Start (Bắt đầu): </p>
              <input
                type="time"
                value={start}
                onChange={(e) => {
                  setStart(e.target.value);
                }}
              ></input>
              <p>End (Kết Thúc): </p>
              <input
                type="time"
                value={end}
                onChange={(e) => {
                  setEnd(e.target.value);
                }}
              ></input>
              <p>Date(Ngày)</p>
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
              <div className="title_form_date_daily">
                <p>Machine Number</p>
                <p>(Mã số máy)</p>
              </div>
              <input
                type="text"
                value={machineCode}
                onChange={(e) => {
                  setMachineCode(e.target.value);
                }}
              ></input>
            </div>
            <div>
              <div className="title_form_date_daily">
                <p>Maintenance Operator Number</p>
                <p>(Mã Số Người Kiểm Tra)</p>
              </div>
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
              <p className="detailbodytext"> Machine Picture </p>
              <div className="image-container">
                {template.image &&
                  template.image.map((img, imgIndex) => (
                    <img
                      key={imgIndex}
                      src={img.image_url}
                      alt="Maintenance"
                      className={`image-${imgIndex}`}
                    />
                  ))}
              </div>
              {template.maintenance_details.map((item, indexField) => {
                return (
                  <div className="field_container">
                    <div className="field_header">
                      <div className="field_name">
                        <p>
                          {item.field}/{item.vietnamese}
                        </p>
                      </div>
                      <div className="verify">
                        <p>Verify/Xác minh</p>
                      </div>
                      <div className="corrective_action">
                        <p>Corrective action/Phương án sữa chữa</p>
                      </div>
                    </div>
                    {item.requirement.map((requirement, indexRequiremnt) => {
                      return (
                        <div className="requirement_row">
                          <div className="requirement_name">
                            <p>{requirement.name}</p>
                            <p>({requirement.vietnamese})</p>
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
          <h3 className="remark_text">Remark/Ghi Chú</h3>
          <input
            type="text"
            className="remark"
            onChange={(e) => setRemark(e.target.value)}
            value={remark}
          ></input>
          <button onClick={onSave}>SAVE(LƯU)</button>
        </div>
      )}
      {template && maintenanceType === "daily" && (
        <div className="form_maintenance_detail_container"></div>
      )}
      <ToastContainer />
    </div>
  );
}

export default CreateForm;

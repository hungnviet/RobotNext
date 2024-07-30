import React, { useState, useEffect } from "react";
import Select from "react-select";
import { IoCheckmark, IoCloseOutline } from "react-icons/io5";

const WeeklyMaintenance = ({
  formMaintain,
  maintenanceStartDate,
  setMaintenanceStartDate,
  maintenanceEndDate,
  setMaintenanceEndDate,
  maintenace_date,
  setMaintenace_date,
  operatorNumber,
  setOperatorNumber,
  selectedValues,
  handleCheckboxChange,
  handleCorrectiveActionChange,
  correctiveAction,
  checkboxState,
  remark,
  setRemark,
  isExist,
  preparedBy,
  setPreparedBy,
  checkedBy,
  setCheckedBy,
  approvedBy,
  setApprovedBy,
  handleSubmit,
}) => {
  const options = [
    {
      value: "OK",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "40px",
            fontWeight: "bold",
          }}
        >
          <IoCheckmark />
        </div>
      ),
    },
    {
      value: "NG",
      label: (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "40px",
            fontWeight: "bold",
          }}
        >
          <IoCloseOutline />
        </div>
      ),
    },
  ];

  const CustomSelect = ({
    fieldIndex,
    reqIndex,
    handleCheckboxChange,
    selectedValue,
  }) => (
    <Select
      options={options}
      value={options.find((option) => option.value === selectedValue)}
      onChange={(selectedOption) =>
        handleCheckboxChange(fieldIndex, reqIndex, selectedOption.value)
      }
      isDisabled={isExist}
    />
  );

  return (
    <div className="formcontainer">
      <div className="titleformcontain">
        <img src="/cqs.png" alt="" width={160} height={64} />
        <div className="text-container">
          <p className="texttemplate">
            {formMaintain.machine_name} Preventive Maintenance{" "}
            {formMaintain.type_of_maintenance} Checklist
          </p>
          <p style={{ padding: "8px 12px" }}>
            {formMaintain.machine_name} Preventive Maintenance{" "}
            {formMaintain.type_of_maintenance} Checklist
          </p>
        </div>
      </div>
      <div className="machineinfocontain">
        <div>
          <p>Machine Name: {formMaintain.machine_name}</p>
          <p>Tên máy móc: {formMaintain.machine_name}</p>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "12px",
              width: "100%",
            }}
          >
            <p style={{ flexShrink: 0 }}>Maintenance Time:</p>
            <p
              style={{
                marginLeft: "8px",
                marginRight: "8px",
                flexShrink: 0,
              }}
            >
              Start:
            </p>

            <input
              type="date"
              value={maintenanceStartDate}
              onChange={(e) => setMaintenanceStartDate(e.target.value)}
              placeholder="Start..."
              style={{ width: "30%", border: "none" }}
              disabled={isExist}
            />
            <p
              style={{
                marginLeft: "8px",
                marginRight: "8px",
                flexShrink: 0,
              }}
            >
              End:
            </p>

            <input
              type="date"
              value={maintenanceEndDate}
              onChange={(e) => setMaintenanceEndDate(e.target.value)}
              placeholder="End..."
              style={{ width: "30%", border: "none" }}
              disabled={isExist}
            />
          </div>
          <div style={{ marginTop: "12px" }}>
            <p>
              MAINTENANCE Operator Number:
              <input
                type="text"
                value={operatorNumber}
                onChange={(e) => setOperatorNumber(e.target.value)}
                placeholder="Operator Number..."
                style={{
                  margin: "0px 10px",
                  border: "none",
                }}
                disabled={isExist}
              />
            </p>
          </div>
        </div>
        <div>
          <p>Machine Number: {formMaintain.machine_code}</p>
          <p>Số máy: {formMaintain.machine_code}</p>
          <div style={{ marginTop: "12px" }}>
            <p>
              Date:
              <input
                type="date"
                value={maintenace_date}
                onChange={(e) => setMaintenace_date(e.target.value)}
                style={{
                  margin: "0px 10px",
                  border: "none",
                  fontSize: "20px",
                }}
                disabled={isExist}
              />
            </p>
          </div>
        </div>
      </div>
      <div className="imagecontainer">
        <p>Machine Picture / hình ảnh máy</p>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <img src="./vd1.jpg" alt="" style={{ width: "100%" }} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <img
              src="./vd2.jpg"
              alt=""
              style={{ width: "100%", height: "50%" }}
            />
            <img
              src="./vd2.jpg"
              alt=""
              style={{ width: "100%", height: "50%" }}
            />
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          textAlign: "center",
        }}
      >
        <p
          style={{
            fontWeight: "bold",
            paddingTop: "10px",
            paddingBottom: "10px",
          }}
        >
          Preventive Maintenance Description / Mô tả bảo trì phòng ngừa
        </p>
        <div className="formtable-container">
          {formMaintain.fields.map((field, index) => (
            <table
              className="fillformTable"
              key={index}
              style={{
                borderCollapse: "collapse",
                margin: 0,
                padding: 0,
              }}
            >
              <thead>
                <tr>
                  <th style={{ width: "50%" }}>{field.field_name}</th>
                  {index === 0 ? (
                    <>
                      <th style={{ width: "10%" }}>
                        <p>Verify</p>
                        <p
                          style={{
                            fontWeight: "normal",
                            fontSize: "16px",
                          }}
                        >
                          Xác minh
                        </p>
                      </th>
                      <th
                        style={{
                          width: "40%",
                          border: "1px solid black",
                        }}
                      >
                        Corrective Action / hành động khắc phục
                      </th>
                    </>
                  ) : (
                    <>
                      <th style={{ width: "10%" }}></th>
                      <th style={{ width: "40%" }}></th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {field.requirement.map((req, reqIndex) => (
                  <tr key={reqIndex}>
                    <td style={{ border: "1px solid black" }}>
                      {reqIndex + 1}. {req.name}
                    </td>
                    <td style={{ border: "1px solid black" }}>
                      <CustomSelect
                        fieldIndex={index}
                        reqIndex={reqIndex}
                        handleCheckboxChange={handleCheckboxChange}
                        selectedValue={
                          checkboxState[`field_${index}_req_${reqIndex}`]
                        }
                      />
                    </td>
                    <td style={{ border: "1px solid black", padding: 0 }}>
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
                        disabled={isExist}
                        onChange={(e) =>
                          handleCorrectiveActionChange(
                            index,
                            reqIndex,
                            e.target.value
                          )
                        }
                        value={
                          correctiveAction[`field_${index}_req_${reqIndex}`] ||
                          ""
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ))}
        </div>
      </div>
      <div>
        <p style={{ fontWeight: "bold" }}>REMARK / GHI CHÚ</p>
        <input
          type="text"
          className="remark"
          value={remark}
          onChange={(e) => setRemark(e.target.value)}
          disabled={isExist}
        />
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
            flex: "0 0 5%",
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
        </div>
        <div
          style={{
            flex: "0 0 5%",
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
            Note: If When verify found abnormal immediately taken corrective
            Action Required
          </p>
          <p>
            Lưu ý: Nếu khi kiểm tra thấy bất thường lập tức thực hiện hành động
            khắc phục Yêu cầu
          </p>
        </div>
      </div>
      <div className="confirmfill">
        <div>
          <h3>Prepared by</h3>
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

export default WeeklyMaintenance;

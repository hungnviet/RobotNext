import React, { useState, useEffect } from "react";
import "./maintenance_detail.css";
import { Router, useParams } from "react-router-dom";
import Select from "react-select";

import NavbarMaintenance from "../../../component/navbarMaintenance/NavbarMaintenance";
import DailyMaintenance from "../../../component/fillform/dailyform";

import WeeklyMaintenance from "../../../component/fillform/weeklyform";
import { ToastContainer, toast } from "react-toastify";
import { IoCheckmark, IoCloseOutline } from "react-icons/io5";

import "react-toastify/dist/ReactToastify.css";
export default function Maintenance_detail() {
  const [formMaintain, setformMaintain] = useState("");
  const [searchMachineCode, setSearchMachineCode] = useState("");
  const [searchMaintenanceType, setSearchMaintenanceType] = useState("");

  //Nondaily
  const { machine_code, maintenanceType, maintenance_code } = useParams();
  const [maintenanceStartDate, setMaintenanceStartDate] = useState("");
  const [maintenanceEndDate, setMaintenanceEndDate] = useState("");
  const [maintenace_date, setMaintenace_date] = useState("");
  const [operatorNumber, setOperatorNumber] = useState("");

  //Daily
  const [Month, setMonth] = useState("");
  const [Year, setYear] = useState("");
  const [checkingMethod, setCheckingMethod] = useState({});
  const [pic, setPIC] = useState({});
  const [datechecked, setDateChecked] = useState({});

  const [checkboxState, setCheckboxState] = useState({});
  const [selectedValues, setSelectedValues] = useState({});
  const [correctiveAction, setCorrectiveAction] = useState({});

  const [remark, setRemark] = useState("");
  const [preparedBy, setPreparedBy] = useState("");
  const [checkedBy, setCheckedBy] = useState("");
  const [isExist, setIsExist] = useState(false);
  const [approvedBy, setApprovedBy] = useState("");

  useEffect(() => {
    setSearchMachineCode(machine_code);
    setSearchMaintenanceType(maintenanceType);
    fetchData(machine_code, maintenanceType);
    fetchexistMaintin(maintenance_code);
  }, [machine_code, maintenanceType, maintenance_code]);
  //fetch_function
  async function fetchData(code, type) {
    await fetchformMaintain(code, type);
  }

  async function fetchformMaintain(code, type) {
    const response = await fetch(
      `http://localhost:3001/form_detail/${code}/${type}`
    );
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setformMaintain(data);

      const newCheckboxState = {};
      const newCorrectiveAction = {};
      data.fields.forEach((field, fieldIndex) => {
        field.requirement.forEach((req, reqIndex) => {
          const key = `field_${fieldIndex}_req_${reqIndex}`;
          newCheckboxState[key] = req.status;
          newCorrectiveAction[key] = req.corrective_action;
        });
      });
      setCheckboxState(newCheckboxState);
      console.log(checkboxState);
      console.log(correctiveAction);

      setCorrectiveAction(newCorrectiveAction);
    } else {
      setformMaintain("");
    }
  }

  async function fetchexistMaintin(code) {
    const response = await fetch(
      `http://localhost:3001/maintenance_detail/${code}`
    );
    if (response.ok) {
      const data = await response.json();
      console.log(data);
      setformMaintain(data);
      setIsExist(true);
      updateCheckboxState(data.fields);
      setRemark(data.remark);
      setPreparedBy(data["Prepared by"]);
      if (data.type_of_maintenance === "Daily") {
        setMonth(data.month);
        setYear(data.year);
        setPreparedBy(data["Leaded by"]);
      }
      setCheckedBy(data["Checked by"]);
      setApprovedBy(data["Approved by"]);
      setMaintenace_date(data.maintenance_date);
      setMaintenanceStartDate(data.maintenance_start_date);
      setMaintenanceEndDate(data.maintenance_end_date);
      setOperatorNumber(data.operator_number);
      const newDateChecked = {};
      const newCheckingMethod = {};
      const newPIC = {};
      const newCheckboxState = {};
      const newCorrectiveAction = {};
      data.fields.forEach((field, fieldIndex) => {
        field.requirement.forEach((req, reqIndex) => {
          const key = `field_${fieldIndex}_req_${reqIndex}`;
          newCheckboxState[key] = req.status;
          newCorrectiveAction[key] = req.corrective_action;
          newCheckingMethod[key] = req.checking_method;
          newPIC[key] = req.PIC;
          req.date?.forEach((dayData) => {
            const dayKey = `field_${fieldIndex}_req_${reqIndex}_day_${dayData.day}`;
            newDateChecked[dayKey] = dayData.status || "";
          });
        });
      });
      console.log(newCheckboxState);
      data.operator?.forEach((dayData) => {
        const dayKey = `field_operator_req_operator_day_${dayData.day}`;
        newDateChecked[dayKey] = dayData.status || "";
      });
      data.leader?.forEach((dayData) => {
        const dayKey = `field_leader_req_leader_day_${dayData.day}`;
        newDateChecked[dayKey] = dayData.status || "";
      });
      setCheckingMethod(newCheckingMethod);
      setPIC(newPIC);

      setDateChecked(newDateChecked);
      setCheckboxState(newCheckboxState);
      setCorrectiveAction(newCorrectiveAction);
    } else {
      setformMaintain("");
    }
  }

  //handle_function
  function handleSearch(e) {
    fetchData(searchMachineCode, searchMaintenanceType);
  }
  function updateCheckboxState(fields) {
    const newState = {};
    fields.forEach((field, fieldIndex) => {
      field.requirement.forEach((req, reqIndex) => {
        const key = `field_${fieldIndex}_req_${reqIndex}`;
        newState[key] = req.status ? "OK" : "NG";
      });
    });
    setCheckboxState(newState);
  }
  const handleCheckboxChange = (fieldIndex, reqIndex, value) => {
    const key = `field_${fieldIndex}_req_${reqIndex}`;
    console.log(`Setting ${key} to ${value}`); // Log the key and value
    setCheckboxState({ ...checkboxState, [key]: value });
    setSelectedValues({ ...selectedValues, [key]: value });
  };
  const handlePIC = (fieldIndex, reqIndex, value) => {
    const key = `field_${fieldIndex}_req_${reqIndex}`;
    console.log(`Setting ${key} to ${value}`); // Log the key and value
    setPIC({ ...pic, [key]: value });
    setSelectedValues({ ...selectedValues, [key]: value });
  };
  const handleCorrectiveActionChange = (fieldIndex, reqIndex, value) => {
    const key = `field_${fieldIndex}_req_${reqIndex}`;
    console.log(`Setting ${key} to ${value}`); // Log the key and value
    setCorrectiveAction({ ...correctiveAction, [key]: value });
  };
  const handleCellChange = (fieldIndex, reqIndex, dayIndex, value) => {
    console.log(
      `Field: ${fieldIndex}, Req: ${reqIndex}, Day: ${dayIndex}, Value: ${value}`
    );
    const key = `field_${fieldIndex}_req_${reqIndex}_day_${dayIndex + 1}`;
    console.log(`Setting ${key} to ${value}`); // Log the key and value
    setDateChecked({ ...datechecked, [key]: value });
  };

  const handleCheckingMethod = (fieldIndex, reqIndex, value) => {
    const key = `field_${fieldIndex}_req_${reqIndex}`;
    console.log(`Setting ${key}  to ${value}`); // Log the key and value
    setCheckingMethod({ ...checkingMethod, [key]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let allRequirementsChecked = true;
    if (
      !maintenace_date ||
      !maintenanceStartDate ||
      !maintenanceEndDate ||
      !operatorNumber ||
      !preparedBy ||
      !checkedBy ||
      !approvedBy
    ) {
      toast.info("Please fill in all fields before submitting.");
      return;
    }
    formMaintain.fields.forEach((field, index) => {
      field.fieldIndex = index;
    });

    for (const field of formMaintain.fields) {
      for (const [index, req] of field.requirement.entries()) {
        const key = `field_${field.fieldIndex}_req_${index}`;
        console.log(
          `Checking requirement: ${key}, Checked: ${checkboxState[key]}`
        );
        if (
          !checkboxState[key] ||
          (checkboxState[key] !== "OK" && checkboxState[key] !== "NG")
        ) {
          allRequirementsChecked = false;
          break;
        }
      }
      if (!allRequirementsChecked) break;
    }

    if (!allRequirementsChecked) {
      toast.info("Please check all requirements before submitting.");
      return;
    }
    if (!remark || !checkedBy || !approvedBy) {
      toast.info("Please fill in all fields before submitting.");
      return;
    }

    const formData = {
      machine_name: formMaintain.machine_name,
      machine_code: formMaintain.machine_code,
      type_of_maintenance: formMaintain.type_of_maintenance,
      maintenance_date: maintenace_date,
      maintenance_start_date: maintenanceStartDate,
      maintenance_end_date: maintenanceEndDate,
      operator_number: operatorNumber,
      fields: formMaintain.fields.map((field) => ({
        field_name: field.field_name,
        requirement: field.requirement.map((req, index) => ({
          name: req.name,
          status: checkboxState[`field_${field.fieldIndex}_req_${index}`],
          corrective_action:
            correctiveAction[`field_${field.fieldIndex}_req_${index}`],
        })),
      })),
      remark: remark,
      "Prepared by": preparedBy,
      "Checked by": checkedBy,
      "Approved by": approvedBy,
    };

    // Send the data to the server
    try {
      const response = await fetch("http://localhost:3001/maintenance_new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        toast.success("Form submitted successfully!");
      } else {
        console.error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  const handleSubmit2 = async (e) => {
    e.preventDefault();
    formMaintain.fields.forEach((field, index) => {
      field.fieldIndex = index;
    });
    if (!Month || !Year || !preparedBy || !checkedBy || !approvedBy) {
      toast.info("Please fill in all fields before submitting.");
      return;
    }
    const formData = {
      machine_name: formMaintain.machine_name,
      machine_code: formMaintain.machine_code,
      type_of_maintenance: formMaintain.type_of_maintenance,
      month: Month,
      year: Year,
      fields: formMaintain.fields.map((field) => ({
        field_name: field.field_name,
        requirement: field.requirement.map((req, index) => ({
          name: req.name,
          checking_method:
            checkingMethod[`field_${field.fieldIndex}_req_${index}`],
          PIC: pic[`field_${field.fieldIndex}_req_${index}`],
          date: Array.from({ length: 31 }, (_, i) => ({
            day: i + 1,
            status:
              datechecked[
                `field_${field.fieldIndex}_req_${index}_day_${i + 1}`
              ],
          })),
        })),
      })),
      operator: Array.from({ length: 31 }, (_, i) => ({
        day: i + 1,
        status: datechecked[`field_operator_req_operator_day_${i + 1}`],
      })),
      leader: Array.from({ length: 31 }, (_, i) => ({
        day: i + 1,
        status: datechecked[`field_leader_req_leader_day_${i + 1}`],
      })),

      "Leaded by": preparedBy,
      "Checked by": checkedBy,
      "Approved by": approvedBy,
    };
    console.log(formData);

    // Send the data to the server
    try {
      const response = await fetch("http://localhost:3001/maintenance_new", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const result = await response.json();
        console.log(result.message);
        toast.success("Form submitted successfully!");
      } else {
        console.error("Failed to submit form");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };
  return (
    <div>
      <NavbarMaintenance />
      <ToastContainer />

      <div className="maintaindetail">
        {isExist ? (
          <div>
            <p>You are viewing the maintenance result</p>
          </div>
        ) : (
          <form onSubmit={handleSearch} className="search-maintain">
            <input
              type="text"
              placeholder="Machine Code"
              value={searchMachineCode}
              onChange={(e) => setSearchMachineCode(e.target.value)}
            />
            <select
              value={searchMaintenanceType}
              onChange={(e) => setSearchMaintenanceType(e.target.value)}
            >
              <option value="">Select Maintenance Type</option>
              <option value="Daily">Daily</option>
              <option value="Weekly">Weekly</option>
              <option value="Monthly">Monthly</option>
              <option value="HalfYearly">HalfYearly</option>
              <option value="Yearly">Yearly</option>
            </select>
            <button type="submit">Search</button>
          </form>
        )}
        {formMaintain ? (
          searchMaintenanceType !== "Daily" ? (
            <WeeklyMaintenance
              formMaintain={formMaintain}
              checkboxState={checkboxState}
              correctiveAction={correctiveAction}
              maintenanceStartDate={maintenanceStartDate}
              setMaintenanceStartDate={setMaintenanceStartDate}
              maintenanceEndDate={maintenanceEndDate}
              setMaintenanceEndDate={setMaintenanceEndDate}
              maintenace_date={maintenace_date}
              setMaintenace_date={setMaintenace_date}
              operatorNumber={operatorNumber}
              setOperatorNumber={setOperatorNumber}
              selectedValues={selectedValues}
              handleCheckboxChange={handleCheckboxChange}
              handleCorrectiveActionChange={handleCorrectiveActionChange}
              remark={remark}
              setRemark={setRemark}
              isExist={isExist}
              preparedBy={preparedBy}
              setPreparedBy={setPreparedBy}
              checkedBy={checkedBy}
              setCheckedBy={setCheckedBy}
              approvedBy={approvedBy}
              setApprovedBy={setApprovedBy}
              handleSubmit={handleSubmit}
            />
          ) : (
            <DailyMaintenance
              formMaintain={formMaintain}
              Month={Month}
              setMonth={setMonth}
              checkingMethod={checkingMethod}
              pic={pic}
              Year={Year}
              setYear={setYear}
              maintenanceStartDate={maintenanceStartDate}
              handleCellChange={handleCellChange}
              setMaintenanceStartDate={setMaintenanceStartDate}
              maintenanceEndDate={maintenanceEndDate}
              setDateChecked={setDateChecked}
              setMaintenanceEndDate={setMaintenanceEndDate}
              datechecked={datechecked}
              maintenace_date={maintenace_date}
              setMaintenace_date={setMaintenace_date}
              operatorNumber={operatorNumber}
              setOperatorNumber={setOperatorNumber}
              selectedValues={selectedValues}
              handleCheckingMethod={handleCheckingMethod}
              handlePIC={handlePIC}
              remark={remark}
              setRemark={setRemark}
              datecheck={datechecked}
              isExist={isExist}
              preparedBy={preparedBy}
              setPreparedBy={setPreparedBy}
              checkedBy={checkedBy}
              setCheckedBy={setCheckedBy}
              approvedBy={approvedBy}
              setApprovedBy={setApprovedBy}
              handleSubmit={handleSubmit2}
            />
          )
        ) : null}
      </div>
    </div>
  );
}

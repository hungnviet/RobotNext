import { AiOutlineCalendar } from "react-icons/ai";
import "./management.css";

function Management() {
  return (
    <div className="managementscreen">
      <div className="headermanage">
        <header className="managehead">
          List of machines that need maintenance
        </header>
        <p className="managesubtext">
          The machines have to make maintenance from{" "}
          <span className="managecalendartext">
            <AiOutlineCalendar /> 10/3/2024 to <AiOutlineCalendar /> 30/3/2024
          </span>
        </p>
        <p className="managesubtext">Filter: </p>
        <p className="managesubtext2">
          Machine Name:{" "}
          <input
            type="text"
            className="manageinput"
            placeholder="___________________"
          />{" "}
          Machine Code:{" "}
          <input
            type="text"
            className="manageinput"
            placeholder="___________________"
          />{" "}
          Type of maintenance:{" "}
          <select className="managedropdown">
            <option value="">All</option>
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="halfyearly">Half-yearly</option>
            <option value="yearly">Yearly</option>
          </select>{" "}
          <button className="filter">Apply</button>
        </p>
      </div>
      <div className="managebody">
        <p className="managesubtext3">
          <span>Machine Name </span>{" "}
          <span className="managetitle">Machine Number</span>
          <span className="managetitle">Last maintenance time</span>
          <span className="managetitle">Type of maintenance</span>
          <span className="managetitle">Maintenance operator</span>
        </p>
        <div
          style={{
            borderTop: "1px solid black",
            width: "120vh",
            height: "1px",
            marginLeft: "12px", // Corrected here
          }}
        ></div>
        <p className="managesubtext4">
          <span>Toshiba 45HC2 </span>
          <span className="managenumber">12312393471</span>
          <span className="managelasttime">12/1/2024</span>
          <span className="managetype">Monthly</span>
          <span className="manageoperator">Adam Smith</span>
        </p>
        <div
          style={{
            borderTop: "1px solid black",
            width: "120vh",
            height: "1px",
            marginLeft: "12px", // Corrected here
          }}
        ></div>
        <p className="managesubtext4">
          <span>Toshiba 45HC2 </span>
          <span className="managenumber">12312393471</span>
          <span className="managelasttime">12/1/2024</span>
          <span className="managetype">Monthly</span>
          <span className="manageoperator">Adam Smith</span>
        </p>
        <div
          style={{
            borderTop: "1px solid black",
            width: "120vh",
            height: "1px",
            marginLeft: "12px", // Corrected here
          }}
        ></div>
      </div>
    </div>
  );
}

export default Management;

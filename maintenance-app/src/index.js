import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Navbar from "./component/navbar/Navbar";
import reportWebVitals from "./reportWebVitals";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./screen/homepage_screen/Homepage";
import Spare_part_management from "./screen/spare_part_screen/Spare_part_management/Spare_part_management";
import Spare_part_add_data from "./screen/spare_part_screen/Spare_part_add_data/Spare_part_add_data";
import Machine_management from "./screen/machine_data_screen/machine_management_screen/Machine_management";
import Machine_add_data from "./screen/machine_data_screen/machine_add_data_screen/Machine_add_data";
import Machine_detail from "./screen/machine_data_screen/machine_detail_screen/Machine_detail";
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <div>
        <Navbar />
        <Routes>
          {/* <Route path="/management" element={<Management />} /> */}
          <Route path="/" element={<Homepage />} />
          <Route
            path="/spare_part_management"
            element={<Spare_part_management />}
          />
          <Route
            path="/spare_part_add_data"
            element={<Spare_part_add_data />}
          />
          <Route path="/machine_management" element={<Machine_management />} />
          <Route path="/machine_add_data" element={<Machine_add_data />} />
          <Route
            path="/machine_detail/:machineCode?"
            element={<Machine_detail />}
          />
        </Routes>
      </div>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

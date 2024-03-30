import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import Management from "./screens/management";
import CreateTemplate from "./screens/createtemplate";
import CreateForm from "./screens/createform";
import Detail from "./screens/detail";
import Sidebar from "./components/Sidebar"; // Import the Sidebar component
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <div
        style={{
          display: "flex",
          backgroundColor: "grey",
          minHeight: "100vh",
          justifyContent: "space-between",
        }}
      >
        <Sidebar /> {/* Add the Sidebar component */}
        <Routes>
          <Route path="/management" element={<Management />} />
          <Route path="/createtemplate" element={<CreateTemplate />} />
          <Route path="/createform" element={<CreateForm />} />
          <Route path="/detail" element={<Detail />} />
        </Routes>
      </div>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

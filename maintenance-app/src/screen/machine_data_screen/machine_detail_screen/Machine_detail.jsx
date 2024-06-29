import React from "react";
import "./Machine_detail.css";
import { useParams } from "react-router-dom";
import NavbarMachine from "../../../component/navbarMachine/NavbarMachine";
export default function Machine_detail() {
  const { machineCode } = useParams();
  return (
    <div>
      <NavbarMachine />
      <div>Machine detail</div>
    </div>
  );
}

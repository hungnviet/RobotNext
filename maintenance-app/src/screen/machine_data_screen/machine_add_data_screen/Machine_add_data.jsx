import React from "react";
import "./Machine_add_data.css";
import SearchSparePart from "../../../component/searchSparePart/SearchSparePart";
import NavbarMachine from "../../../component/navbarMachine/NavbarMachine";
import { useState, useEffect } from "react";

export default function Machine_add_data() {
  const [machineName, setMachineName] = useState("");
  const [machineCode, setMachineCode] = useState("");
  const [dateOfPurchase, setDateOfPurchase] = useState("");
  const [listSparePart, setListSparePart] = useState([]);
  const [listSpefication, setListSpefication] = useState([
    { specification: "", value: "" },
  ]);

  const [listSpecification, setListSpecification] = useState([
    {
      field_of_speicification: "",
      list_specification_in_field: [{ specification: "", value: "" }],
    },
  ]);

  const [additional_data, setAdditional_data] = useState("");
  useEffect(() => {
    fetch("http://localhost:3001/list_spare_parts")
      .then((res) => res.json())
      .then((data) => {
        setListSparePart(data);
      });
  }, []);

  ///-----------------Half Yearly Maintenance-------------------///
  const [inputCodeHalfYearly, setInputCodeHalfYearly] = useState("");
  const [listSparePartForHalfYearly, setListSparePartForHalfYearly] = useState(
    []
  );

  const handleAddSparePartHalfYearly = () => {
    const foundPart = listSparePart.find(
      (part) => part.spare_part_code === inputCodeHalfYearly
    );
    if (foundPart) {
      setListSparePartForHalfYearly((prevList) => [
        ...prevList,
        {
          spare_part_code: foundPart.spare_part_code,
          quantity: 1, // You can set the default quantity here or allow user input
          price: foundPart.unit_price,
          name: foundPart.spare_part_name,
        },
      ]);
      setInputCodeHalfYearly("");
    } else {
      alert("Spare part not found!");
    }
  };

  const handleInputChangeHalfYearly = (e) => {
    setInputCodeHalfYearly(e.target.value);
  };

  const handleQuantityChangeHalfYearly = (e, index) => {
    const newQuantity = e.target.value;
    setListSparePartForHalfYearly((prevList) => {
      const newList = [...prevList];
      newList[index].quantity = newQuantity;
      return newList;
    });
  };

  const handleDeleteSparePartHalfYearly = (index) => {
    setListSparePartForHalfYearly((prevList) =>
      prevList.filter((_, i) => i !== index)
    );
  };

  ///-----------------Yearly Maintenance-------------------///
  const [inputCodeYearly, setInputCodeYearly] = useState("");
  const [listSparePartForYearly, setListSparePartForYearly] = useState([]);

  const handleAddSparePartYearly = () => {
    const foundPart = listSparePart.find(
      (part) => part.spare_part_code === inputCodeYearly
    );
    if (foundPart) {
      setListSparePartForYearly((prevList) => [
        ...prevList,
        {
          spare_part_code: foundPart.spare_part_code,
          quantity: 1, // Default quantity
          price: foundPart.unit_price,
          name: foundPart.spare_part_name,
        },
      ]);
      setInputCodeYearly("");
    } else {
      alert("Spare part not found!");
    }
  };

  const handleInputChangeYearly = (e) => {
    setInputCodeYearly(e.target.value);
  };

  const handleQuantityChangeYearly = (e, index) => {
    const newQuantity = e.target.value;
    setListSparePartForYearly((prevList) => {
      const newList = [...prevList];
      newList[index].quantity = newQuantity;
      return newList;
    });
  };

  const handleDeleteSparePartYearly = (index) => {
    setListSparePartForYearly((prevList) =>
      prevList.filter((_, i) => i !== index)
    );
  };

  ///-----------------Save Machine-------------------///
  const saveMachine = async () => {
    const newMachine = {
      machine_name: machineName,
      machine_code: machineCode,
      date_of_purchase: dateOfPurchase,
      specification: listSpefication,
      additional_data: additional_data,
      spare_part_for_half_yearly_maintenance: listSparePartForHalfYearly,
      spare_part_for_yearly_maintenance: listSparePartForYearly,
      plant: "A",
    };

    try {
      const response = await fetch("http://localhost:3001/list_machines", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newMachine }),
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message);
      } else {
        alert(result.message || "Error saving machine data");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error saving machine data");
    }
  };
  return (
    <div>
      <NavbarMachine />
      <div className="div1_add_machine_data">
        <div>
          <p>Machine Name</p>
          <input
            type="text"
            value={machineName}
            onChange={(e) => {
              setMachineName(e.target.value);
            }}
          />
        </div>
        <div>
          <p>Machine Code</p>
          <input
            type="text"
            value={machineCode}
            onChange={(e) => {
              setMachineCode(e.target.value);
            }}
          />
        </div>
        <div>
          <p>Date of purchase</p>
          <input
            type="date"
            value={dateOfPurchase}
            onChange={(e) => setDateOfPurchase(e.target.value)}
          />
        </div>
      </div>
      <div className="spefication_added_container">
        <h4>Input specification data of the machine</h4>
        {listSpefication.map((oneFieldOfSpecification, index) => {
          <div className="one_field_of_specification_added">
            <div className="field_container_of_specification_added"></div>
            <div className="each_specification_container_added"></div>
            <button>+</button>
          </div>;
        })}
      </div>
      <div className="search_spare_part_container_used">
        <SearchSparePart />{" "}
      </div>
      <div className="header_add_spare_part_for_machine">
        <p>
          List of spare parts for half yearly maintenance ( danh sách vật tư
          dùng cho bảo hành định kỳ nữa năm )
        </p>
        <p>
          Note: Input the correct spare part code which is already exist in the
          systems
        </p>
        <p>Search spare part in the search box</p>
      </div>

      <div className="input_code">
        <input
          type="text"
          value={inputCodeHalfYearly}
          onChange={handleInputChangeHalfYearly}
          placeholder="Enter spare part code"
        />
        <button onClick={handleAddSparePartHalfYearly}>Add Spare Part</button>
      </div>

      <div className="header_list_spare_part_for_machine_maintenance">
        <div>Name</div>
        <div>Code</div>
        <div>Price</div>
        <div>Quantity </div>
        <div>Action</div>
      </div>

      <div>
        {listSparePartForHalfYearly.map((item, index) => {
          return (
            <div className="item_spare_part_for_machine_management">
              <div>{item.name}</div>
              <div>{item.spare_part_code}</div>
              <div>{item.price}</div>
              <div>
                <input
                  value={item.quantity}
                  type="number"
                  onChange={(e) => handleQuantityChangeHalfYearly(e, index)}
                ></input>
              </div>
              <div>
                <button onClick={() => handleDeleteSparePartHalfYearly(index)}>
                  delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="header_add_spare_part_for_machine">
        <p>
          List of spare parts for yearly maintenance ( danh sách vật tư dùng cho
          bảo hành định kỳ nữa năm )
        </p>
        <p>
          Note: Input the correct spare part code which is already exist in the
          systems
        </p>
        <p>Search spare part in the search box</p>
      </div>
      <div className="input_code">
        <input
          type="text"
          value={inputCodeYearly}
          onChange={handleInputChangeYearly}
          placeholder="Enter spare part code"
        />
        <button onClick={handleAddSparePartYearly}>Add Spare Part</button>
      </div>

      <div className="header_list_spare_part_for_machine_maintenance">
        <div>Name</div>
        <div>Code</div>
        <div>Price</div>
        <div>Quantity </div>
        <div>Action</div>
      </div>

      <div>
        {listSparePartForYearly.map((item, index) => {
          return (
            <div key={index} className="item_spare_part_for_machine_management">
              <div>{item.name}</div>
              <div>{item.spare_part_code}</div>
              <div>{item.price}</div>
              <div>
                <input
                  value={item.quantity}
                  type="number"
                  onChange={(e) => handleQuantityChangeYearly(e, index)}
                ></input>
              </div>
              <div>
                <button onClick={() => handleDeleteSparePartYearly(index)}>
                  delete
                </button>
              </div>
            </div>
          );
        })}
      </div>
      <div className="additional_data">
        <p>Additional data</p>
        <textarea
          value={additional_data}
          onChange={(e) => setAdditional_data(e.target.value)}
        ></textarea>
      </div>
      <div className="btn_container">
        <button onClick={saveMachine}>Save Machine</button>
      </div>
    </div>
  );
}

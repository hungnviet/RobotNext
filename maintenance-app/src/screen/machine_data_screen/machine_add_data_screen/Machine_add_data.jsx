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
  const [machineType, setMachineType] = useState("");
  const [plant, setPlant] = useState("A");

  const [listSpecification, setListSpecification] = useState([
    {
      specification: "",
      value: "",
    },
  ]);

  const [listSpecificationTemplate, setListSpecificationTemplate] = useState(
    []
  );
  const [isShowTemplate, setIsShowTemplate] = useState(false);
  const [additional_data, setAdditional_data] = useState("");

  const [img1, setImg1] = useState(null);
  const [img2, setImg2] = useState(null);
  const [img3, setImg3] = useState(null);
  const [img1Preview, setImg1Preview] = useState(null);
  const [img2Preview, setImg2Preview] = useState(null);
  const [img3Preview, setImg3Preview] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3001/list_spare_parts")
      .then((res) => res.json())
      .then((data) => {
        setListSparePart(data);
      });

    fetch("http://localhost:3001/list_specification_template")
      .then((res) => res.json())
      .then((data) => {
        setListSpecificationTemplate(data);
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
    const formData = new FormData();
    formData.append("machineCode", machineCode);
    formData.append("image1", img1);
    formData.append("image2", img2);
    formData.append("image3", img3);
    let formDataString = "";
    try {
      const uploadResponse = await fetch("http://localhost:3001/upload_image", {
        method: "POST",
        body: formData,
      });

      if (!uploadResponse.ok) {
        alert("Error uploading images");
      }

      const uploadResult = await uploadResponse.json();
      const imagePaths = uploadResult.imagePaths;

      const newMachine = {
        machine_name: machineName,
        machine_code: machineCode,
        date_of_purchase: dateOfPurchase,
        machine_type: machineType,
        specification: listSpecification,
        additional_data: additional_data,
        spare_part_for_half_yearly_maintenance: listSparePartForHalfYearly,
        spare_part_for_yearly_maintenance: listSparePartForYearly,
        plant: plant,
        imagePaths: imagePaths,
      };

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

  ///-----------------Handle Specification-------------------///
  function applyTemplate(template) {
    const specifications = template.map((spec) => ({
      specification: spec,
      value: "",
    }));
    setListSpecification(specifications);
  }

  ///-----------------Handle Image-------------------///
  const handleImageChange = (e, setImage, setPreview) => {
    const file = e.target.files[0];
    if (!file) {
      return;
    }
    setImage(file);
    setPreview(URL.createObjectURL(file));
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
          <p>Machine Type</p>
          <input
            type="text"
            value={machineType}
            onChange={(e) => {
              setMachineType(e.target.value);
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
        <div className="select_plant_add_machine">
          <p>Plant</p>
          <select value={plant} onChange={(e) => setPlant(e.target.value)}>
            <option value="A">A</option>
            <option value="B">B</option>
            <option value="C">C</option>
            <option value="D">D</option>
          </select>
        </div>
      </div>
      <div className="spefication_added_container">
        <h4>Input specification data of the machine</h4>

        <div className="suggested_template_container">
          {isShowTemplate ? (
            <button onClick={() => setIsShowTemplate(!isShowTemplate)}>
              Hide Template
            </button>
          ) : (
            <button onClick={() => setIsShowTemplate(!isShowTemplate)}>
              Show Template
            </button>
          )}
          {isShowTemplate && (
            <div className="list_template_container">
              {listSpecificationTemplate.map((item) => {
                return (
                  <div>
                    <p>{item.machineType}</p>
                    <button
                      onClick={() => {
                        applyTemplate(item.listSpecification);
                      }}
                    >
                      Use Template
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {listSpecification.map((item, index) => {
          return (
            <div className="each_specification_container">
              <input
                type="text"
                value={item.specification}
                onChange={(e) => {
                  const newSpecification = e.target.value;
                  setListSpecification((prevList) => {
                    const newList = [...prevList];
                    newList[index].specification = newSpecification;
                    return newList;
                  });
                }}
                placeholder="Specification"
              />
              <input
                type="text"
                value={item.value}
                onChange={(e) => {
                  const newValue = e.target.value;
                  setListSpecification((prevList) => {
                    const newList = [...prevList];
                    newList[index].value = newValue;
                    return newList;
                  });
                }}
                placeholder="Value"
              />
              <button
                onClick={() => {
                  setListSpecification((prevList) => {
                    const newList = [...prevList];
                    newList.splice(index, 1);
                    return newList;
                  });
                }}
              >
                -
              </button>
            </div>
          );
        })}
        <button
          className="btn_add_specifiation"
          onClick={() => {
            setListSpecification((prevList) => {
              return [...prevList, { specification: "", value: "" }];
            });
          }}
        >
          +
        </button>
      </div>
      <p style={{ fontWeight: "bold" }}>Add Machine Image</p>
      <div className="add_img_big_container">
        <div className="section_add_image_left">
          <input
            type="file"
            onChange={(e) => handleImageChange(e, setImg1, setImg1Preview)}
          />
          <div className="display_img">
            {img1 ? (
              <img src={img1Preview} alt="Preview" />
            ) : (
              <p>No image selected</p>
            )}
          </div>
        </div>
        <div className="section_add_image_right">
          <div className="sub_section_add_image_right">
            <input
              type="file"
              onChange={(e) => handleImageChange(e, setImg2, setImg2Preview)}
            />
            <div className="display_img">
              {img2 ? (
                <img src={img2Preview} alt="Preview" />
              ) : (
                <p>No image selected</p>
              )}
            </div>
          </div>
          <div className="sub_section_add_image_right">
            <input
              type="file"
              onChange={(e) => handleImageChange(e, setImg3, setImg3Preview)}
            />
            <div className="display_img">
              {img3 ? (
                <img src={img3Preview} alt="Preview" />
              ) : (
                <p>No image selected</p>
              )}
            </div>
          </div>
        </div>
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

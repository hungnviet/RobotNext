import React from "react";
import "./createtemplate.css";
import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

function CreateTemplate() {
  const [machineName, setMachineName] = useState("");
  const [typeOfMaintenance, setTypeOfMaintenance] = useState("daily");
  const [formDetail, setFormDetail] = useState([]);
  const [images, setImages] = useState([]);

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
  function addField() {
    setFormDetail([
      ...formDetail,
      {
        field: "",
        requirement: [{ name: "", checking_method: "" }],
      },
    ]);
  }
  function addRequirement(fieldIndex) {
    if (fieldIndex >= 0 && fieldIndex < formDetail.length) {
      let newFormDetail = [...formDetail];
      newFormDetail[fieldIndex].requirement.push({ name: "", checking_method: "" });
      setFormDetail(newFormDetail);
    } else {
      toast.error(`Invalid fieldIndex: ${fieldIndex}`);
    }
  }
  function deleteField(fieldIndex) {
    if (fieldIndex >= 0 && fieldIndex < formDetail.length) {
      let newFormDetail = [...formDetail];
      newFormDetail.splice(fieldIndex, 1);
      setFormDetail(newFormDetail);
    } else {
      toast.error(`Invalid fieldIndex: ${fieldIndex}`);
    }
  }
  function deleteRequirement(fieldIndex, requirementIndex) {
    if (fieldIndex >= 0 && fieldIndex < formDetail.length) {
      let newFormDetail = [...formDetail];
      if (
        requirementIndex >= 0 &&
        requirementIndex < newFormDetail[fieldIndex].requirement.length
      ) {
        newFormDetail[fieldIndex].requirement.splice(requirementIndex, 1);
        setFormDetail(newFormDetail);
      } else {
        toast.error(`Invalid requirementIndex: ${requirementIndex}`);
      }
    } else {
      toast.error(`Invalid fieldIndex: ${fieldIndex}`);
    }
  }
  function onChangeField(fieldIndex, value) {
    if (fieldIndex >= 0 && fieldIndex < formDetail.length) {
      let newFormDetail = [...formDetail];
      newFormDetail[fieldIndex].field = value;
      setFormDetail(newFormDetail);
    } else {
      toast.error(`Invalid fieldIndex: ${fieldIndex}`);
    }
  }
  function onChangeRequirement(fieldIndex, requirementIndex, value) {
    if (fieldIndex >= 0 && fieldIndex < formDetail.length) {
      let newFormDetail = [...formDetail];
      if (
        requirementIndex >= 0 &&
        requirementIndex < newFormDetail[fieldIndex].requirement.length
      ) {
        newFormDetail[fieldIndex].requirement[requirementIndex].name = value;
        setFormDetail(newFormDetail);
      } else {
        toast.error(`Invalid requirementIndex: ${requirementIndex}`);
      }
    } else {
      toast.error(`Invalid fieldIndex: ${fieldIndex}`);
    }
  }
  function onChangeChecking_method(fieldIndex, requirementIndex, value) {
    if (fieldIndex >= 0 && fieldIndex < formDetail.length) {
      let newFormDetail = [...formDetail];
      if (
        requirementIndex >= 0 &&
        requirementIndex < newFormDetail[fieldIndex].requirement.length
      ) {
        newFormDetail[fieldIndex].requirement[requirementIndex].checking_method = value;
        setFormDetail(newFormDetail);
      } else {
        toast.error(`Invalid requirementIndex: ${requirementIndex}`);
      }
    } else {
      toast.error(`Invalid fieldIndex: ${fieldIndex}`);
    }
  }
  async function CreateFormTemplate() {
    let data = {
      machine_name: machineName,
      type_of_maintenance: typeOfMaintenance,
      machine_number: "",
      maintenace_time: {
        start: "",
        end: "",
        date: "",
      },
      maintenace_operater: "",
      prepared_by: "",
      approved_by: "",
      checked_by: "",
      check_out: "",
      maintenance_details: formDetail.map((detail) => ({
        field: detail.field,
        requirement: detail.requirement.map((req) => ({
          name: req.name,
          checking_method: req.checking_method,
          status: "",
          corrective_action: "",
          dailyChecks: typeOfMaintenance === "daily" ? new Array(31).fill(false) : undefined,
        })),
      })),
      image: [
        {
          image_url: "",
        },
      ],
    };
    data.image = images.map((image) => ({ image_url: image }));
    const response = await fetch("http://localhost:3001/formTemplate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ form_template: data }),
    });

    if (response.ok) {
      toast.success("Form template created successfully");
    } else {
      const error = await response.text();
      toast.error(`Error creating form template: ${error}`);
    }
  }
  return (
    <div className="Create_Form_Template_Screen">
      <div className="header_create_form_template">
        <h3>Create form template</h3>
        <h4>Please input these information for creating form template</h4>
        <div className="form_in4_create_template">
          <div>
            <p>Machine Name:</p>{" "}
            <input
              type="text"
              placeholder="Ex: Toshiba"
              value={machineName}
              onChange={(e) => {
                setMachineName(e.target.value);
              }}
            />
          </div>
          <div>
            <p>Type of maintenacne: </p>
            <select
              value={typeOfMaintenance}
              onChange={(e) => {
                setTypeOfMaintenance(e.target.value);
              }}
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="halfyearly">Half-yearly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>
      </div>
      <div className="content_create_form">
        <h3>Customize your requirement</h3>
        <div className="content_container_create_template">
          {formDetail.map((item, fieldIndex) => (
            <div className="field_container_create_template" key={fieldIndex}>
              <div className="field_header_create_template">
                <p>Field: </p>
                <input
                  type="text"
                  value={item.field}
                  onChange={(e) => onChangeField(fieldIndex, e.target.value)}
                />
                <button
                  onClick={() => {
                    deleteField(fieldIndex);
                  }}
                >
                  Delete field
                </button>
              </div>
              <div className="requirement_container_create_template">
                {item.requirement.map((requirement, index) => (
                  <div key={index}>
                    <input
                      type="text"
                      value={requirement.name}
                      onChange={(e) =>
                        onChangeRequirement(fieldIndex, index, e.target.value)
                      }
                    />
                    <p>Checking method</p>
                    <input type="text" placeholder="Ex: visual" value={requirement.checking_method} onChange={(e) => onChangeChecking_method(fieldIndex, index, e.target.value)}></input>
                    <button
                      onClick={() => {
                        deleteRequirement(fieldIndex, index);
                      }}
                    >
                      Delete requirement
                    </button>
                  </div>
                ))}
              </div>
              <button
                className="btn_add_requirement"
                onClick={() => {
                  addRequirement(fieldIndex);
                }}
              >
                Add requirement
              </button>
            </div>
          ))}
        </div>
        <div className="btn_add_field_container">
          <button className="btn_add_field" onClick={addField}>
            Add field
          </button>
        </div>
        <div className="upload_image_container">
          <input type="file" accept="image/*" onChange={onImageChange} />
          {images.map((image, index) => (
            <img key={index} src={image} alt={`uploaded ${index}`} />
          ))}
        </div>
        <button
          className="btn_create_form_template"
          onClick={CreateFormTemplate}
        >
          Create form template
        </button>
        <ToastContainer />
      </div>
    </div>
  );
}

export default CreateTemplate;

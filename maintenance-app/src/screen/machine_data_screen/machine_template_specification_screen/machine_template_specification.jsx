import React from "react";
import NavbarMachine from "../../../component/navbarMachine/NavbarMachine";
import "./machine_template_specification.css";

import { useState, useEffect } from "react";
export default function MachineTemplateSpecification() {
  const [listSpecificationTemplate, setListSpecificationTemplate] = useState(
    []
  );

  const [isEditeExistedTemplate, setIsEditeExistedTemplate] = useState(false);
  const [templateToEdit, setTemplateToEdit] = useState({});

  const [newTemplate, setNewTemplate] = useState({
    machineType: "",
    listSpecification: [""],
  });

  useEffect(() => {
    fetch("http://localhost:3001/list_specification_template")
      .then((res) => res.json())
      .then((data) => {
        setListSpecificationTemplate(data);
      });
  }, []);

  async function validateTemplate(template) {
    if (!template.machineType) {
      alert("Machine type cannot be empty");
      return false;
    }

    if (
      listSpecificationTemplate.some(
        (existingTemplate) =>
          existingTemplate.machineType === template.machineType
      )
    ) {
      alert("Machine type already exists");
      return false;
    }

    if (template.listSpecification.some((spec) => spec === "")) {
      alert("All specifications must have a value");
      return false;
    }

    return true;
  }

  async function validateUpdateTemplate(template) {
    if (!template.machineType) {
      alert("Machine type cannot be empty");
      return false;
    }

    if (template.listSpecification.some((spec) => spec === "")) {
      alert("All specifications must have a value");
      return false;
    }

    return true;
  }

  async function createTemplate() {
    const isValid = await validateTemplate(newTemplate);
    if (!isValid) return;

    const response = await fetch(
      "http://localhost:3001/list_specification_template",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTemplate),
      }
    );
    if (response.ok) {
      alert("Create template successfully");
      fetch("http://localhost:3001/list_specification_template")
        .then((res) => res.json())
        .then((data) => {
          setListSpecificationTemplate(data);
        });

      setIsEditeExistedTemplate(false);
      setNewTemplate({ machineType: "", listSpecification: [""] });
    }
  }

  async function deleteTemplate(machineType) {
    const response = await fetch(
      "http://localhost:3001/list_specification_template",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ machineType }),
      }
    );
    if (response.ok) {
      alert(`Delete template of machine ${machineType} successfully`);
      fetch("http://localhost:3001/list_specification_template")
        .then((res) => res.json())
        .then((data) => {
          setListSpecificationTemplate(data);
        });
    } else {
      alert(`Delete template of machine ${machineType} failed`);
    }
  }

  function editTemplate(machineType) {
    const template = listSpecificationTemplate.find((item) => {
      return item.machineType === machineType;
    });
    setIsEditeExistedTemplate(true);
    setTemplateToEdit(template);
  }

  function BackToCreateNewTemplate() {
    setIsEditeExistedTemplate(false);
    setNewTemplate({ machineType: "", listSpecification: [""] });
  }

  async function saveChange() {
    const isValid = await validateUpdateTemplate(templateToEdit);
    if (!isValid) return;

    const response = await fetch(
      "http://localhost:3001/list_specification_template",
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(templateToEdit),
      }
    );
    if (response.ok) {
      alert("Edit template successfully");
      fetch("http://localhost:3001/list_specification_template")
        .then((res) => res.json())
        .then((data) => {
          setListSpecificationTemplate(data);
        });

      setIsEditeExistedTemplate(false);
      setNewTemplate({ machineType: "", listSpecification: [""] });
    }
  }

  return (
    <div className="machine_template_specification_big_container">
      <NavbarMachine />
      <div className="body_machine_template_specification_container">
        <div className="left_section_machine_template_specification_container">
          {isEditeExistedTemplate && (
            <div className="create_template_specification_big_container">
              <p style={{ fontWeight: "bold" }}>Edit existed template</p>
              <div className="machine_type_container_create_template">
                <p>Machine Type: {templateToEdit.machineType} </p>
              </div>
              <p>List Specification</p>
              <div className="list_create_template_specification_container">
                {templateToEdit.listSpecification.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="each_create_template_specification"
                    >
                      <input
                        type="text"
                        value={item}
                        placeholder="EX: Power"
                        onChange={(e) => {
                          let newListSpecification =
                            templateToEdit.listSpecification;
                          newListSpecification[index] = e.target.value;
                          setNewTemplate({
                            ...templateToEdit,
                            listSpecification: newListSpecification,
                          });
                        }}
                      />
                      <button
                        onClick={() => {
                          let newListSpecification =
                            templateToEdit.listSpecification;
                          newListSpecification.splice(index, 1);
                          setNewTemplate({
                            ...templateToEdit,
                            listSpecification: newListSpecification,
                          });
                        }}
                      >
                        -
                      </button>
                    </div>
                  );
                })}
                <button
                  className="add_specification_create_template"
                  onClick={() => {
                    let newListSpecification = templateToEdit.listSpecification;
                    newListSpecification.push("");
                    setNewTemplate({
                      ...newTemplate,
                      listSpecification: newListSpecification,
                    });
                  }}
                >
                  +
                </button>
                <button
                  className="create_template_specification_btn"
                  onClick={saveChange}
                >
                  Save Change
                </button>
                <button
                  onClick={BackToCreateNewTemplate}
                  className="btn_cancle_edite_form"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {!isEditeExistedTemplate && (
            <div className="create_template_specification_big_container">
              <p style={{ fontWeight: "bold" }}>Create new template</p>
              <div className="machine_type_container_create_template">
                <p>Machine Type: </p>
                <input
                  type="text"
                  value={newTemplate.machineType}
                  placeholder="EX: CNC"
                  onChange={(e) =>
                    setNewTemplate({
                      ...newTemplate,
                      machineType: e.target.value,
                    })
                  }
                />
              </div>
              <p>List Specification</p>
              <div className="list_create_template_specification_container">
                {newTemplate.listSpecification.map((item, index) => {
                  return (
                    <div
                      key={index}
                      className="each_create_template_specification"
                    >
                      <input
                        type="text"
                        value={item}
                        placeholder="EX: Power"
                        onChange={(e) => {
                          let newListSpecification =
                            newTemplate.listSpecification;
                          newListSpecification[index] = e.target.value;
                          setNewTemplate({
                            ...newTemplate,
                            listSpecification: newListSpecification,
                          });
                        }}
                      />
                      <button
                        onClick={() => {
                          let newListSpecification =
                            newTemplate.listSpecification;
                          newListSpecification.splice(index, 1);
                          setNewTemplate({
                            ...newTemplate,
                            listSpecification: newListSpecification,
                          });
                        }}
                      >
                        -
                      </button>
                    </div>
                  );
                })}
                <button
                  className="add_specification_create_template"
                  onClick={() => {
                    let newListSpecification = newTemplate.listSpecification;
                    newListSpecification.push("");
                    setNewTemplate({
                      ...newTemplate,
                      listSpecification: newListSpecification,
                    });
                  }}
                >
                  +
                </button>
                <button
                  className="create_template_specification_btn"
                  onClick={createTemplate}
                >
                  Create Template
                </button>
              </div>
            </div>
          )}
        </div>
        <div className="right_section_machine_template_specification_container">
          <p style={{ fontWeight: "bold" }}>Existed template</p>
          <div className="list_existed_specification_template">
            {listSpecificationTemplate.map((item, index) => (
              <div key={index} className="each_existed_specification_template">
                <p>{item.machineType}</p>
                <div className="btn_container_action_each_specification">
                  <button
                    onClick={() => {
                      editTemplate(item.machineType);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      deleteTemplate(item.machineType);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

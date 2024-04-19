import "./templates.css";
import React, { useState, useRef, useEffect } from "react"; // add useRef
import { ToastContainer, toast } from "react-toastify";
import ReactToPrint from "react-to-print";
import Modal from "react-modal"; // Import the Modal component
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
Modal.setAppElement("#root"); // This line is needed for accessibility reasons

function Templates() {
  const [data, setData] = useState(null);
  const [machineName, setMachineName] = useState("");
  const [template, setTemplate] = useState({});
  const [maintenanceType, setMaintenanceType] = useState("daily");
  const [selectedMachine, setSelectedMachine] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false); // State to control the modal
  // Transform the data
  const imageLink = ["https://cpimg.tistatic.com/06555612/b/4/Used-Toshiba-Die-Casting-Machine.jpg", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRykyWRfStol0MM3uhDWMqSClqf9fbQo73aKSOcuxNY8Q&s", "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSeCCDxZy64bX70AcImFihilv5gKLL4afa4JX-SdRd8w&s"]
  let transformedData = {};
  if (data) {
    transformedData = data.reduce((acc, machine) => {
      if (!acc[machine.form_template.machine_name]) {
        acc[machine.form_template.machine_name] = {
          machine,
          types: {
            [machine.form_template.type_of_maintenance]: true,
          },
        };
      } else {
        acc[machine.form_template.machine_name].types[
          machine.form_template.type_of_maintenance
        ] = true;
      }

      return acc;
    }, {});
  }
  useEffect(() => {
    async function handleFind() {
      try {
        const response = await fetch(`http://localhost:3001/allFormTemplate`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setData(data);
      } catch (error) {
        console.error(error);
        toast.error("Can not find the data");
      }
    }

    handleFind();
  }, []);
  async function fetchData(machine, type) {
    setMachineName(machine);
    setMaintenanceType(type);
    try {
      const response = await fetch(
        `http://localhost:3001/formTemplate/${machine}/${type}`
      );
      const data = await response.json();
      setTemplate(data.form_template);
    } catch (error) {
      console.error(error);
      toast.error("Can not find the data");
    }
  }
  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };
  async function handlePrint() {
    const images = Array.from(document.querySelectorAll("#capture img"));
    let loadedImagesCount = 0;

    images.forEach((img) => {
      const image = new Image();
      image.crossOrigin = "anonymous"; // This enables CORS for the image
      image.src = img.src;
      image.onload = () => {
        loadedImagesCount++;
        if (loadedImagesCount === images.length) {
          html2canvas(document.querySelector("#capture"), { scale: 5, useCORS: true }).then(
            (canvas) => {
              const imgData = canvas.toDataURL("image/png");
              const pdf = new jsPDF("p", "mm", "a4"); // A4 size page of PDF
              const imgProps = pdf.getImageProperties(imgData);
              const pdfWidth = pdf.internal.pageSize.getWidth();
              const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
              pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
              pdf.save("download.pdf");
            }
          );
        }
      };
    });
  };
  return (
    <div className="templateallscreen">
      <div>
        <header className="managehead">
          List of all form templates
          <br />
          Danh sách toàn bộ các mẫu báo cáo
        </header>
      </div>
      <div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th className="tableelementtemplate">Machine Name/Tên máy</th>
                <th className="tableelementtemplate">Daily</th>
                <th className="tableelementtemplate">Weekly</th>
                <th className="tableelementtemplate">Monthly</th>
                <th className="tableelementtemplate">Half-Yearly</th>
                <th className="tableelementtemplate">Yearly</th>
              </tr>
            </thead>
            <tbody>
              {Object.values(transformedData).map((machineData, index) => (
                <tr
                  key={index}
                  className={
                    selectedMachine === machineData.machine
                      ? "selected-row"
                      : ""
                  }
                >
                  <td className="tableelementtemplate">
                    {machineData.machine.form_template.machine_name}
                  </td>
                  {["daily", "weekly", "monthly", "half-yearly", "yearly"].map(
                    (type) => (
                      <td className="tableelementtemplate">
                        {machineData.types[type] ? (
                          <button
                            className="buttontemplate"
                            onClick={() => {
                              fetchData(
                                machineData.machine.form_template.machine_name,
                                type
                              );
                              openModal();
                            }}
                          >
                            View detail
                          </button>
                        ) : (
                          "Not exist"
                        )}
                      </td>
                    )
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        contentLabel="Machine Details"
        style={{
          overlay: {
            display: "flex",
            alignItems: "center", // Vertically center the modal
            justifyContent: "center", // Horizontally center the modal
          },
          content: {
            position: "relative",
            display: "flex",
            flexDirection: "column",
            width: "794px",
            height: "1080px",
            overflow: "scroll", // Prevent scrolling
            marginTop: "280px",
          },
        }}
      >
        <div id="capture">
          {template && maintenanceType !== "daily" && (
            <div className="content_update_form2">
              <div className="header_update_form2">
                <p>Machine Name : {template.machine_name}</p>
                <p>Type of maintenance: {template.type_of_maintenance}</p>
              </div>
              <div className="update_form_time_container">
                <p>Maintenance Time(Thời gian bảo trì):</p>
                <div className="update_form_time">
                  <p>Start (Bắt đầu): </p>
                  <input
                    type="time"
                    style={{ fontSize: "0.2em", height: "auto" }}
                  ></input>
                  <p>End (Kết Thúc): </p>
                  <input
                    type="time"
                    style={{ fontSize: "0.2em", height: "auto" }}
                  ></input>
                  <p>Date(Ngày)</p>
                  <input
                    type="date"
                    style={{ fontSize: "0.2em", height: "auto" }}
                  ></input>
                </div>
              </div>
              <div className="machine_operator_in4">
                <div>
                  <div className="title_form_date_daily">
                    <p>Machine Number</p>
                    <p>(Mã số máy)</p>
                  </div>
                  <input
                    type="text"
                    style={{ fontSize: "0.2em", height: "auto" }}
                  ></input>
                </div>
                <div>
                  <div className="title_form_date_daily">
                    <p>Maintenance Operator Number</p>
                    <p>(Mã Số Người Kiểm Tra)</p>
                  </div>
                  <input
                    type="text"
                    style={{ fontSize: "0.2em", height: "auto" }}
                  ></input>
                </div>
              </div>
              <div className="img_container_print">
                <div className="img_left_print">
                  <img src="https://cpimg.tistatic.com/06555612/b/4/Used-Toshiba-Die-Casting-Machine.jpg"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </div>
                <div className="img_right_print">
                  <div>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRykyWRfStol0MM3uhDWMqSClqf9fbQo73aKSOcuxNY8Q&s"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>

                  <div>
                    <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQSeCCDxZy64bX70AcImFihilv5gKLL4afa4JX-SdRd8w&s"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>
              {template.maintenance_details && (
                <div className="">
                  {template.maintenance_details.map((item, indexField) => {
                    return (
                      <div className="field_container">
                        <div className="field_header">
                          <div className="field_name">
                            <p>
                              {item.field}/{item.vietnamese}
                            </p>
                          </div>
                          <div className="verify">
                            <p>Verify/Xác minh</p>
                          </div>
                          <div className="corrective_action">
                            <p>Corrective action/Phương án sữa chữa</p>
                          </div>
                        </div>
                        {item.requirement.map(
                          (requirement, indexRequiremnt) => {
                            return (
                              <div className="requirement_row">
                                <div className="requirement_name">
                                  <p style={{ fontWeight: 'bold' }}>{indexRequiremnt + 1}.{requirement.name}</p>
                                  <p>({requirement.vietnamese})</p>
                                </div>
                                <div className="requirement_verify">

                                </div>
                                <div className="requiremet_correctvie_action">

                                </div>
                              </div>
                            );
                          }
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
              <div className="footer_updated_form2">
                <div>
                  <p>Prepared by:</p>
                </div>
                <div>
                  <p>Checked by:</p>
                </div>
                <div>
                  <p>Approved by: </p>
                </div>
              </div>
            </div>
          )}
        </div>
        <button onClick={handlePrint} className="btn_print">Print</button>
      </Modal>
    </div>
  );
}

export default Templates;

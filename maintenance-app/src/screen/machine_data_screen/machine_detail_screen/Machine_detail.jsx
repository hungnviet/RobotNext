import React from "react";
import "./Machine_detail.css";
import { useParams } from "react-router-dom";
import NavbarMachine from "../../../component/navbarMachine/NavbarMachine";
import { useState, useEffect } from "react";

export default function Machine_detail() {
  const { machineCode } = useParams();
  const [machineCodeSearch, setMachineCodeSearch] = useState(machineCode || "");
  const [machineDetail, setMachineDetail] = useState(null);
  const [error, setError] = useState(null);

  async function getMachineDetail(machineCode) {
    try {
      const response = await fetch(
        `http://localhost:3001/machine_detail/${machineCode}`
      );

      if (response.ok) {
        const data = await response.json();
        setMachineDetail(data);
        setError(null); // Clear any previous errors
      } else {
        const errorData = await response.json();
        setMachineDetail(null);
        if (response.status === 404) {
          setError(errorData.message || "Machine not found");
        } else {
          setError("Error fetching data");
        }
      }
    } catch (error) {
      setMachineDetail(null);
      setError("Error fetching data");
    }
  }

  const handleInputChange = (e) => {
    setMachineCodeSearch(e.target.value);
  };

  const handleSearch = () => {
    if (machineCodeSearch) {
      getMachineDetail(machineCodeSearch);
    } else {
      setError("Please enter a machine code");
    }
  };

  useEffect(() => {
    if (machineCodeSearch) {
      getMachineDetail(machineCodeSearch);
    }
  }, []);

  return (
    <div>
      <NavbarMachine />
      <div className="machine_detail_input_code">
        <div>
          <input
            value={machineCodeSearch}
            onChange={handleInputChange}
            placeholder="Enter machine code"
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        {error && <p>{error}</p>}
      </div>
      {machineDetail && (
        <div className="machine_data_big_container">
          <div className="general_information_detail_machine">
            <div>
              <h4>Machine Name</h4>
              <p>{machineDetail.machine_name}</p>
            </div>
            <div>
              <h4>Machine Code</h4>
              <p>{machineDetail.machine_code}</p>
            </div>
            <div>
              <h4>Machine Type</h4>
              <p>{machineDetail.machine_type}</p>
            </div>
            <div>
              <h4>Date of purchase</h4>
              <p>{machineDetail.date_of_purchase}</p>
            </div>
            <div className="display_plant_machine_detail">
              <h4>Plant</h4>
              <p>{machineDetail.plant}</p>
            </div>
          </div>

          <div className="display_image_machine_detail">
            <div className="section_display_image_machine_detail">
              <div className="display_image_machine_detail_1">
                <img src={machineDetail.imagePaths[1]} alt="machine" />
              </div>
            </div>
            <div className="section_display_image_machine_detail">
              <div className="display_image_machine_detail_2">
                <img src={machineDetail.imagePaths[1]} alt="machine" />
              </div>
              <div className="display_image_machine_detail_2">
                <img src={machineDetail.imagePaths[2]} alt="machine" />
              </div>
            </div>
          </div>
          <div className="spefication_container_machine_detail">
            <h4>Machine spefication</h4>
            <div className="header_spefication_machine_detail">
              <div>Spefication</div>
              <div>Value</div>
            </div>
            {machineDetail.specification.map((spefication, index) => (
              <div key={index} className="each_spefication_machine_detail">
                <div>{spefication.specification}</div>
                <div>{spefication.value}</div>
              </div>
            ))}
          </div>
          <div className="list_spare_part_for_maintenacne_machine_detail">
            <h4>List spare part for half yearly maintenance</h4>
            <div className="header_spare_part_machine_detail">
              <div>Spare part code</div>
              <div>Spare part name</div>
              <div>Spare part price</div>
              <div>Quantity</div>
            </div>
            {machineDetail.spare_part_for_half_yearly_maintenance.map(
              (sparePart, index) => (
                <div key={index} className="each_spare_part_machine_detail">
                  <div>{sparePart.spare_part_code}</div>
                  <div>{sparePart.name}</div>
                  <div>{sparePart.price} VND</div>
                  <div>{sparePart.quantity}</div>
                </div>
              )
            )}
          </div>
          <div className="list_spare_part_for_maintenacne_machine_detail">
            <h4>List spare part for yearly maintenance</h4>
            <div className="header_spare_part_machine_detail">
              <div>Spare part code</div>
              <div>Spare part name</div>
              <div>Spare part price</div>
              <div>Quantity</div>
            </div>
            {machineDetail.spare_part_for_yearly_maintenance.map(
              (sparePart, index) => (
                <div key={index} className="each_spare_part_machine_detail">
                  <div>{sparePart.spare_part_code}</div>
                  <div>{sparePart.name}</div>
                  <div>{sparePart.price} VND</div>
                  <div>{sparePart.quantity}</div>
                </div>
              )
            )}
          </div>
          <div className="additional_data_machine_detail">
            <h4>Additional data</h4>
            <textarea value={machineDetail.additional_data}></textarea>
          </div>
        </div>
      )}
    </div>
  );
}

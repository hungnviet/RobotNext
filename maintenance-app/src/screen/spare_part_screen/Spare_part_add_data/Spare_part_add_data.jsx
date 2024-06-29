import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "./page.css";
import NavbarSparePart from "../../../component/navbarSparePart/NavbarSparePart";

export default function Spare_part_add_data() {
  const [sparePartCode, setSparePartCode] = useState("");
  const [sparePartName, setSparePartName] = useState("");
  const [suplierCompanyName, setSuplierCompanyName] = useState("");
  const [deliveryTime, setDeliveryTime] = useState("");
  const [priceOn1SparePart, setPriceOn1SparePart] = useState("");
  const [inventoryQuantity, setInventoryQuantity] = useState("");

  const [errMessage, setErrMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  async function addSparePart() {
    setIsLoading(true);
    setErrMessage(null);
    setSuccessMessage(null);

    if (
      !sparePartCode ||
      !sparePartName ||
      !suplierCompanyName ||
      !deliveryTime ||
      !priceOn1SparePart ||
      !inventoryQuantity
    ) {
      setErrMessage("Please fill all the fields");
      setIsLoading(false);
      return;
    } else {
      const newSparePart = {
        spare_part_code: sparePartCode,
        spare_part_name: sparePartName,
        spare_part_suplier: suplierCompanyName,
        delivery_time: deliveryTime,
        inventory_quantity: 0,
        unit_price: priceOn1SparePart,
      };

      try {
        const response = await fetch("http://localhost:3001/list_spare_parts", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ newSparePart }),
        });
        if (response.status === 400) {
          setErrMessage("Spare part already exists");
          setIsLoading(false);
          return;
        } else if (response.ok) {
          setSuccessMessage("Spare part added");
          setSparePartCode("");
          setSparePartName("");
          setSuplierCompanyName("");
          setDeliveryTime("");
          setPriceOn1SparePart("");
          setInventoryQuantity("");
          setIsLoading(false);
        } else {
          setErrMessage("Something went wrong");
          setIsLoading(false);
        }
      } catch (error) {
        setErrMessage("Something went wrong");
      }
    }
  }
  return (
    <div className="spare_part_add_data_container">
      <NavbarSparePart />
      <h3>Add Spare Part</h3>
      <div className="add_spare_part_infor_container">
        <div className="spare_part_key_infor_input">
          <div>
            <label>Spare Part Code</label>
            <input
              type="text"
              placeholder="Ex:SP001"
              value={sparePartCode}
              onChange={(e) => setSparePartCode(e.target.value)}
            />
          </div>
          <div>
            <label>Spare Part Name</label>
            <input
              type="text"
              placeholder="Ex:Engine"
              value={sparePartName}
              onChange={(e) => setSparePartName(e.target.value)}
            />
          </div>
        </div>
        <div className="spare_part_suplier_infor_input">
          <div>
            <label>Suplier Company Name</label>
            <input
              type="text"
              placeholder="Ex:Robot Next"
              value={suplierCompanyName}
              onChange={(e) => setSuplierCompanyName(e.target.value)}
            />
          </div>
          <div>
            <label>Delivery Time (Day)</label>
            <input
              type="number"
              placeholder="how many day?"
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
            />
          </div>
          <div>
            <label>Price On 1 Spare Part (VND) </label>
            <input
              type="number"
              placeholder="Ex:1000"
              value={priceOn1SparePart}
              onChange={(e) => setPriceOn1SparePart(e.target.value)}
            />
          </div>
          <div>
            <label>Curent Inventory</label>
            <input
              type="number"
              placeholder="Ex:1000"
              value={inventoryQuantity}
              onChange={(e) => setInventoryQuantity(e.target.value)}
            />
          </div>
        </div>
        {errMessage && <div className="error_message">{errMessage}</div>}
        {successMessage && (
          <div className="success_message">{successMessage}</div>
        )}
        {isLoading && <div className="loading_message">Loading...</div>}
        <button onClick={addSparePart}>Add Spare Part</button>
      </div>
    </div>
  );
}

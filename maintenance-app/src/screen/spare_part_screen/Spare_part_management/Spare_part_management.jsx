import React from "react";
import { Link } from "react-router-dom";
import "./Spare_part_management.css";
import { useState, useEffect } from "react";
import NavbarSparePart from "../../../component/navbarSparePart/NavbarSparePart";

export default function Spare_part_management() {
  const [spareParts, setSpareParts] = useState([]);
  const [sparePartsListForDisPlay, setSparePartsListForDisPlay] = useState([]);
  const [estimateOption, setEstimateOption] = useState("week");
  const [indexOfUpdatedSparePart, setIndexOfUpdatedSparePart] = useState(null);

  const [signalReload, setSignalReload] = useState(false);

  /// varaiable for filter spare part list
  const [sparePartCodeSearch, setSparePartCodeSearch] = useState("");
  const [sparePartNameSearch, setSparePartNameSearch] = useState("");
  const [suplierNameSearch, setSuplierNameSearch] = useState("");
  const [orderDeliveryTime, setOrderDeliveryTime] = useState("none");
  const [orderInventoryQuantity, setOrderInventoryQuantity] = useState("none");
  const [orderUnitPrice, setOrderUnitPrice] = useState("none");

  ///variable for update value of spare part  when user edit
  const [newSuplierName, setNewSuplierName] = useState("");
  const [newDeliveryTime, setNewDeliveryTime] = useState("");
  const [newInventoryQuantity, setNewInventoryQuantity] = useState("");
  const [newUnitPrice, setNewUnitPrice] = useState("");

  useEffect(() => {
    fetch("http://localhost:3001/list_spare_parts")
      .then((res) => res.json())
      .then((data) => {
        setSpareParts(data);
        setSparePartsListForDisPlay(data);
      });
  }, [signalReload]);

  function onEditSparePart(index) {
    setIndexOfUpdatedSparePart(index);
    setNewSuplierName(sparePartsListForDisPlay[index].spare_part_suplier);
    setNewDeliveryTime(sparePartsListForDisPlay[index].delivery_time);
    setNewInventoryQuantity(sparePartsListForDisPlay[index].inventory_quantity);
    setNewUnitPrice(sparePartsListForDisPlay[index].unit_price);
  }

  async function onSaveChangeSparePart(index) {
    ////save change to BE
    const response = await fetch("http://localhost:3001/list_spare_parts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        spare_part_code: sparePartsListForDisPlay[index].spare_part_code,
        new_spare_part_suplier: newSuplierName,
        new_delivery_time: newDeliveryTime,
        new_inventory_quantity: newInventoryQuantity,
        new_unit_price: newUnitPrice,
      }),
    });
    const data = await response.json();
    if (data.status === "success") {
      setSignalReload(!signalReload);
      setIndexOfUpdatedSparePart(null);
    } else {
      alert("Error when update spare part");
    }
  }

  async function onDeleteSparePart(index) {
    const response = await fetch("http://localhost:3001/list_spare_parts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        spare_part_code: sparePartsListForDisPlay[index].spare_part_code,
      }),
    });
    const data = await response.json();
    if (data.status === "success") {
      setSignalReload(!signalReload);
    } else {
      alert("Error when delete spare part");
    }
  }

  ///use for filter when search
  function filterSparePartList() {
    const newSpareList = spareParts.filter((sparePart) => {
      return (
        sparePart.spare_part_code
          .toLowerCase()
          .includes(sparePartCodeSearch.toLowerCase()) &&
        sparePart.spare_part_name
          .toLowerCase()
          .includes(sparePartNameSearch.toLowerCase()) &&
        sparePart.spare_part_suplier
          .toLowerCase()
          .includes(suplierNameSearch.toLowerCase())
      );
    });
    setSparePartsListForDisPlay(newSpareList);
  }

  useEffect(() => {
    filterSparePartList();
  }, [
    sparePartCodeSearch,
    sparePartNameSearch,
    suplierNameSearch,
    signalReload,
  ]);

  /// use for filter by sort
  function sortByDelivery() {
    let sortedList = [...sparePartsListForDisPlay];
    if (orderDeliveryTime === "asc") {
      sortedList.sort((a, b) => a.delivery_time - b.delivery_time);
    } else if (orderDeliveryTime === "dec") {
      sortedList.sort((a, b) => b.delivery_time - a.delivery_time);
    }
    setSparePartsListForDisPlay(sortedList);
  }

  function sortByInventory() {
    let sortedList = [...sparePartsListForDisPlay];
    if (orderInventoryQuantity === "asc") {
      sortedList.sort((a, b) => a.inventory_quantity - b.inventory_quantity);
    } else if (orderInventoryQuantity === "dec") {
      sortedList.sort((a, b) => b.inventory_quantity - a.inventory_quantity);
    }
    setSparePartsListForDisPlay(sortedList);
  }

  function sortByPrice() {
    let sortedList = [...sparePartsListForDisPlay];
    if (orderUnitPrice === "asc") {
      sortedList.sort((a, b) => a.unit_price - b.unit_price);
    } else if (orderUnitPrice === "dec") {
      sortedList.sort((a, b) => b.unit_price - a.unit_price);
    }
    setSparePartsListForDisPlay(sortedList);
  }

  useEffect(() => {
    sortByDelivery();
  }, [orderDeliveryTime]);

  useEffect(() => {
    sortByInventory();
  }, [orderInventoryQuantity]);

  useEffect(() => {
    sortByPrice();
  }, [orderUnitPrice]);

  return (
    <div className="spare_part_management_container">
      <NavbarSparePart />
      <h3>Spare Part Management</h3>
      <div className="list_spare_part_management">
        <table className="spare_part_table">
          <thead>
            <tr>
              <th className="col-1">
                <div>
                  <p>Code</p>
                  <input
                    value={sparePartCodeSearch}
                    placeholder="Ex:SP1004"
                    onChange={(e) => setSparePartCodeSearch(e.target.value)}
                  ></input>
                </div>
              </th>
              <th className="col-2">
                <div>
                  <p>Spare Part Name</p>
                  <input
                    value={sparePartNameSearch}
                    placeholder="Ex:Motors"
                    onChange={(e) => setSparePartNameSearch(e.target.value)}
                  ></input>
                </div>
              </th>
              <th className="col-3">
                <div>
                  <p>Suplier Name</p>
                  <input
                    value={suplierNameSearch}
                    placeholder="Ex: Robot Next Company"
                    onChange={(e) => setSuplierNameSearch(e.target.value)}
                  ></input>
                </div>
              </th>
              <th className="col-1">
                <div>
                  <p>Delivery Time (Days)</p>
                  <select
                    value={orderDeliveryTime}
                    onChange={(e) => setOrderDeliveryTime(e.target.value)}
                  >
                    <option value="none">none</option>
                    <option value="asc">ascending</option>
                    <option value="dec">decrease</option>
                  </select>
                </div>
              </th>
              <th className="col-1">
                <div>
                  <p>Inventory</p>{" "}
                  <select
                    value={orderInventoryQuantity}
                    onChange={(e) => setOrderInventoryQuantity(e.target.value)}
                  >
                    <option value="none">none</option>
                    <option value="asc">ascending</option>
                    <option value="dec">decrease</option>
                  </select>
                </div>
              </th>
              <th className="col-1">
                {" "}
                <div>
                  <p>Price </p>{" "}
                  <select
                    value={orderUnitPrice}
                    onChange={(e) => setOrderUnitPrice(e.target.value)}
                  >
                    <option value="none">none</option>
                    <option value="asc">ascending</option>
                    <option value="dec">decrease</option>
                  </select>
                </div>
              </th>
              <th className="col-2">
                <div>
                  <p>Estimate of uesed in </p>
                  <select
                    value={estimateOption}
                    onChange={(e) => setEstimateOption(e.target.value)}
                  >
                    <option value="week">1 week</option>
                    <option value="month">1 month</option>
                    <option value="year"> 1 year</option>
                  </select>
                </div>
              </th>
              <th className="col-4">Action</th>
            </tr>
          </thead>
          <tbody>
            {sparePartsListForDisPlay.map((sparePart, index) => {
              return (
                <tr key={index}>
                  <td className="col-1">{sparePart.spare_part_code}</td>
                  <td className="col-2">{sparePart.spare_part_name}</td>
                  <td className="col-3">
                    {indexOfUpdatedSparePart === index ? (
                      <input
                        value={newSuplierName}
                        onChange={(e) => setNewSuplierName(e.target.value)}
                        type="text"
                      ></input>
                    ) : (
                      sparePart.spare_part_suplier
                    )}
                  </td>
                  <td className="col-1">
                    {indexOfUpdatedSparePart === index ? (
                      <input
                        value={newDeliveryTime}
                        onChange={(e) => setNewDeliveryTime(e.target.value)}
                        type="number"
                      ></input>
                    ) : (
                      sparePart.delivery_time
                    )}
                  </td>
                  <td className="col-1">
                    {indexOfUpdatedSparePart === index ? (
                      <input
                        value={newInventoryQuantity}
                        onChange={(e) =>
                          setNewInventoryQuantity(e.target.value)
                        }
                        type="number"
                      ></input>
                    ) : (
                      sparePart.inventory_quantity
                    )}
                  </td>
                  <td className="col-1">
                    {indexOfUpdatedSparePart === index ? (
                      <input
                        value={newUnitPrice}
                        onChange={(e) => setNewUnitPrice(e.target.value)}
                        type="number"
                        step="0.01"
                      ></input>
                    ) : (
                      sparePart.unit_price + " VND"
                    )}
                  </td>
                  <td className="col-2">
                    {estimateOption === "week"
                      ? 100
                      : estimateOption === "month"
                      ? 400
                      : 2000}
                  </td>
                  <td className="col-4">
                    {indexOfUpdatedSparePart === index ? (
                      <button onClick={() => onSaveChangeSparePart(index)}>
                        save
                      </button>
                    ) : (
                      <button onClick={() => onEditSparePart(index)}>
                        update
                      </button>
                    )}
                    <button onClick={() => onDeleteSparePart(index)}>
                      delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

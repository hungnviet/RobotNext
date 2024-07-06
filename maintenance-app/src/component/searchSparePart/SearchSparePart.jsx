import React from "react";
import { useState } from "react";
import "./searchSparePart.css";
export default function SearchSparePart() {
  const [sparePart, setSparePart] = useState([]);
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  async function search() {
    const response = await fetch("http://localhost:3001/search_spare_parts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code: code,
        name: name,
      }),
    });
    const data = await response.json();
    setSparePart(data);
  }

  return (
    <div className="search_spare_part_container">
      <h4>Search Spare Part</h4>
      <div className="search_spare_part_sub_container">
        <div className="search_spare_part_input_container">
          {" "}
          <p>Input spare part code or name for searching</p>
          <input
            type="text"
            placeholder="Spare part code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <input
            type="text"
            placeholder="Spare part name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={search}>Search</button>
        </div>
        <div className="search_spare_part_result_container">
          <p>List Spare Part</p>
          <div className="list_result">
            {sparePart.length > 0 ? (
              sparePart.map((sparePart) => (
                <div className="result" key={sparePart.code}>
                  <p>{sparePart.spare_part_name}</p>
                  <p>{sparePart.spare_part_code}</p>
                </div>
              ))
            ) : (
              <p>No spare part found</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/// Instruction for using
// --------------------------------------------------------------------------------------------------------------------------------
// <div className="search_spare_part_container_used">
//   <SearchSparePart />
// </div>;
// --------------------------------------------------------------------------------------------------------------------------------
// the css for that tag is
//--------------------------------------------------------------------------------------------------------------------------------
// .search_spare_part_container_used {
//   display: flex;
//   justify-content: center;
//   align-items: center;
//   width: 100%;
//   height: max-content;
// }

import "./Homepage.css";
import React from "react";
import { useState, useEffect } from "react";

export default function Homepage() {
  const [messageList, setMessageList] = useState([]);
  const [isLoaded, setIsLoaded] = useState(true); // Typically starts as false

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(
        "http://localhost:3001/list_spare_parts_need_to_buy"
      );
      if (response.ok) {
        const data = await response.json();
        setMessageList(data);
        setIsLoaded(false); // Set to true when data is loaded
      } else {
        alert("HTTP-Error: " + response.status);
      }
    }
    fetchData();
  }, []);

  async function DoneTask(id) {
    const response = await fetch(
      "http://localhost:3001/list_spare_parts_need_to_buy",
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
      }
    );
    if (response.ok) {
      const data = await response.json();
      if (data.status === "success") {
        setMessageList((prev) =>
          prev.filter((message) => message.message_id !== id)
        );
      } else {
        alert(data.message);
      }
    } else {
      alert("HTTP-Error: " + response.status);
    }
  }

  // const currentDate = new Date();
  // const options = {
  //   weekday: "long",
  //   year: "numeric",
  //   month: "long",
  //   day: "numeric",
  // };
  // const formattedDate = currentDate.toLocaleDateString(undefined, options); // e.g., "Tuesday, September 28, 2021"

  const currentDate = new Date();
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };
  const formattedDate = currentDate.toLocaleDateString("en-US", options); // e.g., "Tuesday, September 28, 2021"
  return (
    <div className="homepage_container">
      <div className="header_homepage">
        <h2>HOMEPAGE</h2>
      </div>
      <h3 style={{ marginLeft: "30px" }}>{formattedDate}</h3>
      <p style={{ marginLeft: "30px" }}>{messageList.length} messages</p>
      {isLoaded && <p>Loading...</p>}
      {!isLoaded && messageList.length === 0 && <p>No messages</p>}
      {messageList.length > 0 && (
        <div className="message_on_homepage_container">
          {messageList.map((message) => (
            <div className="each_message_container" key={message.id}>
              <p>
                You need to buy {message.quantity} {message.spare_part_name}{" "}
                with spare part id is {message.spare_part_id}
              </p>
              <button onClick={() => DoneTask(message.message_id)}>done</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

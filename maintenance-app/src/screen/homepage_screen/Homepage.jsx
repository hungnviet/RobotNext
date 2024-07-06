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

  function Request_maintenance({ message }) {
    return (
      <div className="request_maintenance_message_container">
        <h4>Request maintenance</h4>

        <div>
          <p>Machine Name : {message.machine_name}</p>
          <p>Machine Code : {message.machine_code}</p>
        </div>
        <p>Problem : {message.problem}</p>
        <div>
          <p>Date of request: {message.request_date}</p>
          <p>Requested by: {message.requested_by}</p>
        </div>
        <div>
          <p>Priority: {message.priority}</p>
          <p>Request code: {message.request_code}</p>
        </div>

        <button
          onClick={() => {
            DoneTask(message.message_id);
          }}
        >
          Done
        </button>
      </div>
    );
  }

  function Reminder_maintenance({ message }) {
    return (
      <div className="reminder_maintenance_message_container">
        <h4>Reminder for daily maintenance</h4>
        <div>
          <p>Machine Name : {message.machine_name}</p>
          <p>Machine Code : {message.machine_code}</p>
        </div>
        <div>
          <p>Type of maintenance: {message.type_of_maintenance}</p>
          <p>Date for maintenance: {message.date_for_maintenance}</p>
        </div>
        <button
          onClick={() => {
            DoneTask(message.message_id);
          }}
        >
          Done
        </button>
      </div>
    );
  }

  function Buy_spare_parts({ message }) {
    return (
      <div className="buy_spare_part_message_container">
        <h4>Buy spare parts</h4>
        <div>
          <p>Spare Part Name: {message.spare_part_name}</p>
          <p>Spare Part Code: {message.spare_part_code}</p>
          <p>Quantity:{message.quantity}</p>
        </div>
        <button
          onClick={() => {
            DoneTask(message.message_id);
          }}
        >
          Done
        </button>
      </div>
    );
  }
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
          {messageList.map((message) =>
            message.message_type === "request_maintenance" ? (
              <Request_maintenance message={message} />
            ) : message.message_type === "reminder_maintenance" ? (
              <Reminder_maintenance message={message} />
            ) : message.message_type === "buy_spare_parts" ? (
              <Buy_spare_parts message={message} />
            ) : (
              <></>
            )
          )}
        </div>
      )}
    </div>
  );
}

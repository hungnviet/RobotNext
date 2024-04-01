const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json()); // This middleware is used to parse JSON bodies
app.use("/images", express.static(path.join(__dirname, "../../images")));
app.get("/data", (req, res) => {
  fs.readFile(
    path.join(__dirname, "../../Data/maintenance_data.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
      } else {
        res.json(JSON.parse(data));
      }
    }
  );
});
app.post("/data", (req, res) => {
  const newData = req.body;
  fs.readFile(
    path.join(__dirname, "../../Data/maintenance_data.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
        return;
      }
      let existingData;
      if (data.length === 0) {
        existingData = [];
      } else {
        existingData = JSON.parse(data);
        if (!Array.isArray(existingData)) {
          existingData = [existingData];
        }
      }
      existingData.push(newData);
      fs.writeFile(
        path.join(__dirname, "../../Data/maintenance_data.json"),
        JSON.stringify(existingData, null, 2),
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error writing file");
          } else {
            res.send("Form template created successfully");
          }
        }
      );
    }
  );
});
app.post("/formTemplate", (req, res) => {
  const newData = req.body;
  fs.readFile(
    path.join(__dirname, "../../Data/form_template.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
        return;
      }

      let existingData;
      if (data.length === 0) {
        existingData = [];
      } else {
        existingData = JSON.parse(data);
        if (!Array.isArray(existingData)) {
          existingData = [existingData];
        }
      }
      console.log(existingData);
      const checkExist = existingData.find(
        (item) =>
          item.machine_name === newData.form_template.machine_name &&
          item.type_of_maintenance === newData.form_template.type_of_maintenance
      );

      if (checkExist) {
        console.log(
          "Item with the same name and maintenance type already exists"
        );
        res
          .status(400)
          .send("Item with the same name and maintenance type already exists");
        return;
      }

      existingData.push(newData);

      fs.writeFile(
        path.join(__dirname, "../../Data/form_template.json"),
        JSON.stringify(existingData, null, 2),
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error writing file");
          } else {
            res.send("Form template created successfully");
          }
        }
      );
    }
  );
});
app.get("/formTemplate/:machineName/:maintenanceType", (req, res) => {
  const machine_name = req.params.machineName;
  const type_of_maintenance = req.params.maintenanceType;
  fs.readFile(
    path.join(__dirname, "../../Data/form_template.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
        return;
      }
      const existingData = JSON.parse(data);
      if (!Array.isArray(existingData)) {
        existingData = [existingData];
      }
      const checkExist = existingData.find(
        (item) =>
          item.form_template.machine_name.toLowerCase() ===
            machine_name.toLowerCase() &&
          item.form_template.type_of_maintenance.toLowerCase() ===
            type_of_maintenance.toLowerCase()
      );

      if (checkExist) {
        res.json(checkExist);
      } else {
        res.status(404).send("Data not found");
      }
    }
  );
});

app.listen(3001, () => console.log("Server listening on port12 3001"));

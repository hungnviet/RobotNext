const express = require("express");
const fs = require("fs");
const cors = require("cors");
const path = require("path");
const app = express();

app.use(cors());
app.use(express.json()); // This middleware is used to parse JSON bodies

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
      const checkExist = existingData.find(
        (item) =>
          item.machine_name === newData.machine_name &&
          item.type_of_maintenance === newData.type_of_maintenance
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
app.get("/formTemplate", (req, res) => {
  const filter = req.body;
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
      const checkExist = existingData.find(
        (item) =>
          item.machine_name === filter.machine_name &&
          item.type_of_maintenance === filter.type_of_maintenance
      );
      if (checkExist) {
        res.status(200).json(checkExist);
      } else {
        res.status(404).send("Template for device not found");
      }
    }
  );
});

app.use("/images", express.static(path.join(__dirname, "public/images")));

app.listen(3001, () => console.log("Server listening on port 3001"));

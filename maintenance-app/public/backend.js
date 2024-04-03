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

app.get('/dailyForm/:machineName/:dailyTime/:machineCode', (req, res) => {
  const machine_name = req.params.machineName;
  const daily_time = req.params.dailyTime;
  const machine_code = req.params.machineCode;
  console.log(machine_name, daily_time, machine_code);
  fs.readFile(
    path.join(__dirname, "../../Data/maintenance_data.json"),
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
      const finding_data = existingData.filter((item) => item.data.machine_name.toLowerCase() === machine_name.toLowerCase() && item.data.daily_time == daily_time && item.data.machine_number === machine_code);

      if (finding_data.length > 0) {
        console.log('dayne')
        res.json(finding_data[0]);
      } else {
        fs.readFile(
          path.join(__dirname, "../../Data/form_template.json"), (err, dataTemplate) => {
            if (err) {
              console.error(err);
              res.status(500).send("Error reading file");
              return;
            }
            const existingTemplate = JSON.parse(dataTemplate);
            if (!Array.isArray(existingTemplate)) {
              existingTemplate = [existingTemplate];
            }
            const finding_data_template = existingTemplate.filter((item) => item.form_template.machine_name.toLowerCase() === machine_name.toLowerCase() && item.form_template.type_of_maintenance.toLowerCase() === "daily");
            if (finding_data_template.length > 0) {
              const newData = finding_data_template[0];
              newData.form_template.daily_time = daily_time;
              newData.form_template.machine_number = machine_code;
              const finalData = {
                data: newData.form_template,
              }
              res.json(finalData);
            } else {
              res.status(404).send("Data not found");
            }
          });

      }
    }
  )
});
function deleteMatchingElement(existingData, updatedData) {
  return existingData.filter(item => {
    return !(
      item.data.machine_name === updatedData.data.machine_name &&
      item.data.type_of_maintenance === updatedData.data.type_of_maintenance &&
      item.data.daily_time === updatedData.data.daily_time &&
      item.data.machine_number === updatedData.data.machine_number
    );
  });
}
app.post("/dailyForm", (req, res) => {
  const newData = req.body;
  console.log("save daily form")
  console.log(newData);
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
      const updatedData = {
        data: newData.dailyForm.data,
      }
      existingData = deleteMatchingElement(existingData, updatedData);
      existingData.push(updatedData);
      console.log(existingData);
      fs.writeFile(
        path.join(__dirname, "../../Data/maintenance_data.json"),
        JSON.stringify(existingData, null, 2),
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error writing file");
          } else {
            res.status(200).send("Form template created successfully");
          }
        }
      );
    }
  );
});

app.listen(3001, () => console.log("Server listening on port12 3001"));

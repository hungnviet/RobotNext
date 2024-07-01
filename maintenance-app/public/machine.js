const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

router.get("/list_machines", (req, res) => {
  fs.readFile(
    path.join(__dirname, "../../Data/machineData.json"),
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
router.get("/machine/:machineCode", (req, res) => {
  const { machineCode } = req.params;
  fs.readFile(
    path.join(__dirname, "../../Data/machineData.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
        return;
      }
      const machines = JSON.parse(data);
      const machine = machines.find((m) => m.machine_code === machineCode);
      if (machine) {
        res.json(machine);
      } else {
        res.status(404).send("Machine not found");
      }
    }
  );
});
router.delete("/machine/:machineCode", (req, res) => {
  const { machineCode } = req.params;
  fs.readFile(
    path.join(__dirname, "../../Data/machineData.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
        return;
      }
      let machines = JSON.parse(data);
      const machineIndex = machines.findIndex(
        (m) => m.machine_code === machineCode
      );
      if (machineIndex !== -1) {
        machines.splice(machineIndex, 1); // Remove the machine from the array
        fs.writeFile(
          path.join(__dirname, "../../Data/machineData.json"),
          JSON.stringify(machines, null, 2), // Write the updated machines array back to the file
          (err) => {
            if (err) {
              console.error(err);
              res.status(500).send("Error writing file");
              return;
            }
            res.send("Machine deleted successfully");
          }
        );
      } else {
        res.status(404).send("Machine not found");
      }
    }
  );
});
router.post("/machine", (req, res) => {
  const newMachine = req.body; // Assuming the new machine details are sent in the request body

  // Validate newMachine object as needed

  fs.readFile(
    path.join(__dirname, "../../Data/machineData.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error reading file");
        return;
      }
      const machines = JSON.parse(data);
      // Optionally, add a check here to ensure a machine with the same machine_code does not already exist
      machines.push(newMachine); // Add the new machine to the array

      fs.writeFile(
        path.join(__dirname, "../../Data/machineData.json"),
        JSON.stringify(machines, null, 2), // Write the updated machines array back to the file
        (err) => {
          if (err) {
            console.error(err);
            res.status(500).send("Error writing file");
            return;
          }
          res.status(201).send("Machine created successfully");
        }
      );
    }
  );
});

module.exports = router;

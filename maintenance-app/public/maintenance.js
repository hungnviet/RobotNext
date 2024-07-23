const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

router.get("/form_history", (req, res) => {
  fs.readFile(path.join(__dirname, "../../Data/formData.json"), (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error reading file");
    } else {
      res.json(JSON.parse(data));
    }
  });
});
router.get("/maintenance_history", (req, res) => {
  fs.readFile(
    path.join(__dirname, "../../Data/maintenanceData.json"),
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
router.post("/form_new", (req, res) => {
  const newData = req.body;

  fs.readFile(path.join(__dirname, "../../Data/formData.json"), (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error reading file" });
    }

    try {
      const existingData = JSON.parse(data);

      existingData.push(newData);

      fs.writeFile(
        path.join(__dirname, "../../Data/formData.json"),
        JSON.stringify(existingData, null, 2),
        (writeErr) => {
          if (writeErr) {
            console.error(writeErr);
            return res.status(500).json({ message: "Error writing file" });
          }
          res.status(201).json({ message: "Data added successfully" });
        }
      );
    } catch (parseErr) {
      console.error(parseErr);
      res.status(500).json({ message: "Error parsing file data" });
    }
  });
});
router.get("/form_detail/:machine_code/:typemaintain", (req, res) => {
  const machineCode = req.params.machine_code;
  const typeMaintain = req.params.typemaintain;
  const filePath = path.join(__dirname, "../../Data/formData.json");

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading file"); // Exit the function after sending the response
    }

    let listform;
    try {
      listform = JSON.parse(data);
    } catch (parseErr) {
      console.error(parseErr);
      return res.status(500).send("Error parsing JSON data");
    }

    const formmaintain = listform.find(
      (formmaintain) =>
        formmaintain.machine_code === machineCode &&
        formmaintain.type_of_maintenance === typeMaintain
    );

    if (formmaintain) {
      return res.json(formmaintain); // Exit the function after sending the response
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "Form not found" }); // Exit the function after sending the response
    }
  });
});
router.get("/maintenance_detail/:maintenance_code", (req, res) => {
  const maintenanceCode = req.params.maintenance_code;
  const filePath = path.join(__dirname, "../../Data/maintenanceData.json");

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading file");
    }

    let listform;
    try {
      listform = JSON.parse(data);
    } catch (parseErr) {
      console.error(parseErr);
      return res.status(500).send("Error parsing JSON data");
    }

    const formmaintain = listform.find(
      (formmaintain) => formmaintain.maintenance_code === maintenanceCode
    );

    if (formmaintain) {
      return res.json(formmaintain); //
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "Form not found" });
    }
  });
});

router.put("/form_update/:machine_code/:typemaintain", (req, res) => {
  const machineCode = req.params.machine_code;
  const typeMaintain = req.params.typemaintain;
  const updatedForm = req.body; // Assuming the body contains the updated form data
  const filePath = path.join(__dirname, "../../Data/formData.json");

  fs.readFile(filePath, (err, data) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error reading file");
    }

    let listform;
    try {
      listform = JSON.parse(data);
    } catch (parseErr) {
      console.error(parseErr);
      return res.status(500).send("Error parsing JSON data");
    }

    const formIndex = listform.findIndex(
      (form) =>
        form.machine_code === machineCode &&
        form.type_of_maintenance === typeMaintain
    );

    if (formIndex !== -1) {
      // Update the form with new data
      listform[formIndex] = { ...listform[formIndex], ...updatedForm };

      // Write the updated list back to formData.json
      fs.writeFile(filePath, JSON.stringify(listform, null, 2), (writeErr) => {
        if (writeErr) {
          console.error(writeErr);
          return res.status(500).send("Error writing to file");
        }
        return res.json({
          status: "success",
          message: "Form updated successfully",
        });
      });
    } else {
      return res
        .status(404)
        .json({ status: "error", message: "Form not found" });
    }
  });
});
router.post("/maintenance_new", (req, res) => {
  const newData = req.body;

  fs.readFile(
    path.join(__dirname, "../../Data/maintenanceData.json"),
    (err, data) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error reading file" });
      }

      try {
        const existingData = JSON.parse(data);
        const newMaintenanceCode = existingData.length + 1;
        newData.maintenance_code = newMaintenanceCode.toString();

        existingData.push(newData);

        fs.writeFile(
          path.join(__dirname, "../../Data/maintenanceData.json"),
          JSON.stringify(existingData, null, 2),
          (writeErr) => {
            if (writeErr) {
              console.error(writeErr);
              return res.status(500).json({ message: "Error writing file" });
            }
            res.status(201).json({ message: "Data added successfully" });
          }
        );
      } catch (parseErr) {
        console.error(parseErr);
        res.status(500).json({ message: "Error parsing file data" });
      }
    }
  );
});
module.exports = router;
